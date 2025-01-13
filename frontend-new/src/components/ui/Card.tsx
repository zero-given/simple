import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-lg p-4';
    const variantStyles = {
      default: 'bg-[var(--color-surface)] shadow-sm',
      elevated: 'bg-[var(--color-surface)] shadow-md',
      outlined: 'border border-[var(--color-border)]'
    };

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
); 