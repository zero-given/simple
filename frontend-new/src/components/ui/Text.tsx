import React from 'react';

interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
}

export function Text({ 
  variant = 'body', 
  color = 'primary',
  className = '',
  children 
}: TextProps) {
  const variantStyles = {
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-medium',
    body: 'text-base',
    caption: 'text-sm',
    label: 'text-sm font-medium'
  };

  const colorStyles = {
    primary: 'text-[var(--color-text)]',
    secondary: 'text-[var(--color-textSecondary)]',
    success: 'text-[var(--color-status-success)]',
    warning: 'text-[var(--color-status-warning)]',
    error: 'text-[var(--color-status-error)]'
  };

  const Element = variant.startsWith('h') ? variant : 'span';

  return (
    <Element className={`${variantStyles[variant]} ${colorStyles[color]} ${className}`}>
      {children}
    </Element>
  );
} 