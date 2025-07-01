import * as React from "react"

export function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 font-heading rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  let color = '';
  if (variant === 'primary') {
    color = 'bg-primary text-white hover:bg-primary/90';
  } else if (variant === 'secondary') {
    color = 'bg-secondary text-white hover:bg-secondary/90';
  } else if (variant === 'ghost') {
    color = 'bg-transparent text-primary hover:bg-primary/10';
  }
  return <button className={`${base} ${color} ${className}`} {...props} />;
}
