import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-amber-500 text-brown-900 hover:bg-amber-600',
    secondary: 'bg-brown-900 text-cream-500 hover:bg-brown-800',
    outline: 'border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-brown-900',
    ghost: 'text-amber-500 hover:bg-amber-500/10'
  };
  
  const sizeClasses = {
    sm: 'h-8 px-3 py-2 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
} 