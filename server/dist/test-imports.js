"use strict";
async function testImports() {
    try {
        console.log('Testing route imports...');
        const authModule = await import('./routes/auth');
        console.log('Auth module:', typeof authModule.default, authModule.default?.name);
        const vitalsModule = await import('./routes/vitals');
        console.log('Vitals module:', typeof vitalsModule.default, vitalsModule.default?.name);
        const chatModule = await import('./routes/chat-new');
        console.log('Chat module:', typeof chatModule.default, chatModule.default?.name);
        const alertsModule = await import('./routes/alerts');
        console.log('Alerts module:', typeof alertsModule.default, alertsModule.default?.name);
        const uploadModule = await import('./routes/upload');
        console.log('Upload module:', typeof uploadModule.default, uploadModule.default?.name);
        const analyticsModule = await import('./routes/analytics');
        console.log('Analytics module:', typeof analyticsModule.default, analyticsModule.default?.name);
    }
    catch (error) {
        console.error('Error importing:', error);
    }
}
testImports();
//# sourceMappingURL=test-imports.js.map