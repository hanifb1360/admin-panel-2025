export interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function FormButton({ children, className, ...props }: FormButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      className={cn(
        'px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
import React from 'react';
import { cn } from '../../lib/utils';
import { form, formHeader, formContent, formError, formSuccess } from '../../design-system/components/form';
import { spacing } from '../../design-system/tokens/spacing';
import { colors } from '../../design-system/tokens/colors';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({ children, className, ...props }: FormProps) {
  // Ensure borderRadius and padding are valid CSS values
  const style: React.CSSProperties = {
    ...form.base,
    borderRadius: typeof form.base.borderRadius === 'number' ? `${form.base.borderRadius}px` : form.base.borderRadius,
    padding: typeof form.base.padding === 'number' ? `${form.base.padding}px` : form.base.padding,
    boxSizing: 'border-box',
  };
  return (
    <form style={style} className={cn(className)} {...props}>
      {children}
    </form>
  );
}

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section style={formHeader.base} className={cn(className)}>
      {(title || description) && (
        <header>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </header>
      )}
      <div style={formContent.base}>{children}</div>
    </section>
  );
}

export interface FormCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormCard({ title, description, children, className }: FormCardProps) {
  const style: React.CSSProperties = {
    ...form.base,
    borderRadius: typeof form.base.borderRadius === 'number' ? `${form.base.borderRadius}px` : form.base.borderRadius,
    padding: typeof form.base.padding === 'number' ? `${form.base.padding}px` : form.base.padding,
    boxSizing: 'border-box',
  };
  return (
    <div style={style} className={cn(className)}>
      {(title || description) && (
        <div style={formHeader.base}>
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
      )}
      <div style={formContent.base}>{children}</div>
    </div>
  );
}

export interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;
  return (
    <div style={formError.base} className={cn(className)}>
      <svg width="20" height="20" fill="currentColor" style={{ marginRight: spacing[2], color: colors.red[400] }} viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span>{error}</span>
    </div>
  );
}

export interface FormSuccessProps {
  message?: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null;
  return (
    <div style={formSuccess.base} className={cn(className)}>
      <svg width="20" height="20" fill="currentColor" style={{ marginRight: spacing[2], color: colors.green[400] }} viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
