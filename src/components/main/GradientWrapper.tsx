import React from 'react';

interface GradientBorderWrapperProps {
  children: React.ReactNode;
  gradient?: string; // Optional: customize the colors
  className?: string; // Optional: for custom width/margin
}

export default function GradientWrapper({ 
  children, 
  gradient = "from-blue-500 to-purple-600", 
  className = "" 
}: GradientBorderWrapperProps) {
  return (
    <div className={`group relative p-[2px] rounded-xl transition-all duration-300 ${className}`}>
      {/* The Gradient Layer */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* The Content Layer */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[10px] h-full w-full">
        {children}
      </div>
    </div>
  );
}