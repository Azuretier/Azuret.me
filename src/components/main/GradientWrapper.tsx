import React from 'react';
import Link from 'next/link';
import type { LinkProps } from 'next/link';

interface GradientLinkProps extends LinkProps {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
  rounded?: string;
  // Standard HTML anchor props not included in LinkProps (like target)
  target?: string;
  rel?: string;
}

export default function GradientLink({ 
  children, 
  gradient = "from-blue-500 to-purple-600", 
  className = "",
  rounded = "rounded-xl",
  ...props 
}: GradientLinkProps) {
  return (
    <Link 
      {...props} 
      className={`group relative inline-block p-[2px] ${rounded} transition-all duration-300 ${className}`}
    >
      {/* The Gradient Layer */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} ${rounded} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* The Content Layer */}
      <div className={`relative bg-white dark:bg-slate-900 h-full w-full rounded-[calc(var(--radius)-2px)]`}
           style={{ '--radius': '12px' } as React.CSSProperties}>
        {children}
      </div>
    </Link>
  );
}