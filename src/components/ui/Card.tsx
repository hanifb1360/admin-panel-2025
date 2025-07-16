
import React from 'react';
import { card } from '../../design-system/components/card';


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: keyof typeof card.variants;
  padding?: keyof typeof card.padding;
}


export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  // Merge base, variant, and padding styles
  const styleObj = {
    ...card.base,
    ...(card.variants[variant] || {}),
    ...(card.padding[padding] || {}),
  };
  return (
    <div
      style={styleObj}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
