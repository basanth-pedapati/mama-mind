import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

export default async function uploadRoutes(fastify: FastifyInstance) {
  // Authentication middleware
  const authenticate = async (request: any, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded;
    } catch (error) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  };

  // Upload file endpoint
  fastify.post('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.code(400).send({ 
          error: 'Invalid file type. Only JPEG, PNG images and PDF files are allowed.' 
        });
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.file.readableLength && data.file.readableLength > maxSize) {
        return reply.code(400).send({ error: 'File too large. Maximum size is 10MB.' });
      }

      const userId = request.user?.id;
      const fileName = `${Date.now()}-${data.filename}`;
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads', userId);
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, sanitizedFileName);

      try {
        // Save file locally (in production, you'd upload to Supabase Storage or S3)
        await pipeline(data.file, createWriteStream(filePath));

        // For production, upload to Supabase Storage:
        /*
        const { data: uploadResult, error: uploadError } = await (fastify as any).supabase.storage
          .from('medical-files')
          .upload(`${userId}/${sanitizedFileName}`, data.file, {
            contentType: data.mimetype,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }
        */

        // Save file metadata to database
        const { data: fileRecord, error } = await (fastify as any).supabase
          .from('uploaded_files')
          .insert({
            user_id: userId,
            filename: data.filename,
            stored_filename: sanitizedFileName,
            file_path: filePath,
            file_size: data.file.readableLength || 0,
            mime_type: data.mimetype,
            category: 'general', // Could be 'ultrasound', 'lab_results', 'prescription', etc.
            uploaded_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          fastify.log.error('Database file record error:', error);
          return reply.code(400).send({ error: 'Failed to save file record' });
        }

        // Emit real-time notification
        (fastify as any).io.to(`user-${userId}`).emit('file-uploaded', {
          fileId: fileRecord.id,
          filename: data.filename,
          category: fileRecord.category,
        });

        reply.code(201).send({
          message: 'File uploaded successfully',
          file: {
            id: fileRecord.id,
            filename: data.filename,
            size: fileRecord.file_size,
            type: data.mimetype,
            uploadedAt: fileRecord.uploaded_at,
          },
        });

      } catch (fileError) {
        fastify.log.error('File upload error:', fileError);
        return reply.code(500).send({ error: 'Failed to upload file' });
      }

    } catch (error) {
      fastify.log.error('Upload error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get user files
  fastify.get('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const querySchema = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(20),
        category: z.string().optional(),
      });

      const query = querySchema.parse(request.query);
      const offset = (query.page - 1) * query.limit;

      let queryBuilder = (fastify as any).supabase
        .from('uploaded_files')
        .select('id, filename, file_size, mime_type, category, uploaded_at')
        .eq('user_id', request.user?.id)
        .order('uploaded_at', { ascending: false });

      if (query.category) {
        queryBuilder = queryBuilder.eq('category', query.category);
      }

      const { data: files, error, count } = await queryBuilder
        .range(offset, offset + query.limit - 1);

      if (error) {
        fastify.log.error('Get files error:', error);
        return reply.code(400).send({ error: 'Failed to retrieve files' });
      }

      reply.send({
        files,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / query.limit),
        },
      });

    } catch (error) {
      fastify.log.error('Get files error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Download/view file
  fastify.get('/:fileId', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        fileId: z.string(),
      });

      const params = paramsSchema.parse(request.params);

      const { data: fileRecord, error } = await (fastify as any).supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', params.fileId)
        .eq('user_id', request.user?.id)
        .single();

      if (error || !fileRecord) {
        return reply.code(404).send({ error: 'File not found' });
      }

      // In production with Supabase Storage, you'd generate a signed URL:
      /*
      const { data: signedUrl } = await (fastify as any).supabase.storage
        .from('medical-files')
        .createSignedUrl(`${request.user?.id}/${fileRecord.stored_filename}`, 3600); // 1 hour
      
      return reply.send({ downloadUrl: signedUrl.signedUrl });
      */

      // For local files, serve directly
      reply.type(fileRecord.mime_type);
      return reply.sendFile(fileRecord.stored_filename, path.join(process.cwd(), 'uploads', request.user?.id));

    } catch (error) {
      fastify.log.error('Download file error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Update file category/metadata
  fastify.patch('/:fileId', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        fileId: z.string(),
      });

      const bodySchema = z.object({
        category: z.enum(['ultrasound', 'lab_results', 'prescription', 'medical_record', 'general']).optional(),
        notes: z.string().max(500).optional(),
      });

      const params = paramsSchema.parse(request.params);
      const body = bodySchema.parse(request.body);

      const updates: any = {};
      if (body.category) updates.category = body.category;
      if (body.notes) updates.notes = body.notes;
      
      if (Object.keys(updates).length === 0) {
        return reply.code(400).send({ error: 'No valid fields to update' });
      }

      updates.updated_at = new Date().toISOString();

      const { data: fileRecord, error } = await (fastify as any).supabase
        .from('uploaded_files')
        .update(updates)
        .eq('id', params.fileId)
        .eq('user_id', request.user?.id)
        .select()
        .single();

      if (error) {
        fastify.log.error('Update file error:', error);
        return reply.code(400).send({ error: 'Failed to update file' });
      }

      if (!fileRecord) {
        return reply.code(404).send({ error: 'File not found' });
      }

      reply.send({
        message: 'File updated successfully',
        file: fileRecord,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Update file error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Delete file
  fastify.delete('/:fileId', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        fileId: z.string(),
      });

      const params = paramsSchema.parse(request.params);

      const { data: fileRecord, error: fetchError } = await (fastify as any).supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', params.fileId)
        .eq('user_id', request.user?.id)
        .single();

      if (fetchError || !fileRecord) {
        return reply.code(404).send({ error: 'File not found' });
      }

      // Delete from storage (Supabase or local)
      try {
        // For Supabase Storage:
        /*
        await (fastify as any).supabase.storage
          .from('medical-files')
          .remove([`${request.user?.id}/${fileRecord.stored_filename}`]);
        */

        // For local files:
        const fs = await import('fs/promises');
        await fs.unlink(fileRecord.file_path);
      } catch (storageError) {
        fastify.log.warn('Failed to delete file from storage:', storageError);
        // Continue with database deletion even if file deletion fails
      }

      // Delete from database
      const { error: deleteError } = await (fastify as any).supabase
        .from('uploaded_files')
        .delete()
        .eq('id', params.fileId)
        .eq('user_id', request.user?.id);

      if (deleteError) {
        fastify.log.error('Delete file record error:', deleteError);
        return reply.code(400).send({ error: 'Failed to delete file record' });
      }

      reply.send({ message: 'File deleted successfully' });

    } catch (error) {
      fastify.log.error('Delete file error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
