import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { tw } from '../../design-system/utilities/tailwind';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || variant === 'error';
    const isSuccess = variant === 'success';

    const sizeClasses = {
      sm: 'py-1.5 px-2 text-sm',
      md: 'py-2 px-3 text-sm',
      lg: 'py-3 px-4 text-base',
    };

    const variantClasses = {
      default: tw.border.secondary,
      error: tw.border.error,
      success: tw.border.success,
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1',
              hasError ? tw.text.error : tw.text.primary
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={cn(
              'w-full border rounded-lg transition-colors duration-200',
              tw.bg.primary,
              tw.text.primary,
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              sizeClasses[size],
              variantClasses[variant],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError && 'focus:ring-red-500',
              isSuccess && 'focus:ring-green-500',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            hasError ? tw.text.error : tw.text.secondary
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    variant = 'default',
    resize = 'vertical',
    id,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || variant === 'error';
    const isSuccess = variant === 'success';

    const variantClasses = {
      default: tw.border.secondary,
      error: tw.border.error,
      success: tw.border.success,
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block text-sm font-medium mb-1',
              hasError ? tw.text.error : tw.text.primary
            )}
          >
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full border rounded-lg py-2 px-3 text-sm transition-colors duration-200',
            tw.bg.primary,
            tw.text.primary,
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'min-h-[80px]',
            variantClasses[variant],
            resizeClasses[resize],
            hasError && 'focus:ring-red-500',
            isSuccess && 'focus:ring-green-500',
            className
          )}
          {...props}
        />
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            hasError ? tw.text.error : tw.text.secondary
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'error' | 'success';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    error,
    helperText,
    options,
    placeholder,
    variant = 'default',
    id,
    ...props
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || variant === 'error';
    const isSuccess = variant === 'success';

    const variantClasses = {
      default: tw.border.secondary,
      error: tw.border.error,
      success: tw.border.success,
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'block text-sm font-medium mb-1',
              hasError ? tw.text.error : tw.text.primary
            )}
          >
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full border rounded-lg py-2 px-3 text-sm transition-colors duration-200',
            tw.bg.primary,
            tw.text.primary,
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed',
            'appearance-none',
            'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")] dark:bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23a1a1aa\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
            'bg-no-repeat bg-right-2 bg-center pr-10',
            variantClasses[variant],
            hasError && 'focus:ring-red-500',
            isSuccess && 'focus:ring-green-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            hasError ? tw.text.error : tw.text.secondary
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    label,
    error,
    helperText,
    variant = 'default',
    id,
    ...props
  }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || variant === 'error';

    return (
      <div className="w-full">
        <div className="flex items-start">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'w-4 h-4 mt-0.5 rounded text-primary-600',
              tw.border.secondary,
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'ml-2 text-sm cursor-pointer',
                hasError ? tw.text.error : tw.text.primary
              )}
            >
              {label}
            </label>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            hasError ? tw.text.error : tw.text.secondary
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
  direction?: 'horizontal' | 'vertical';
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({
    name,
    options,
    value,
    onChange,
    label,
    error,
    helperText,
    variant = 'default',
    direction = 'vertical',
  }, ref) => {
    const hasError = error || variant === 'error';

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            'block text-sm font-medium mb-1',
            hasError ? tw.text.error : tw.text.primary
          )}>
            {label}
          </label>
        )}
        
        <div className={cn(
          'flex',
          direction === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-2'
        )}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                ref={ref}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className={cn(
                  'w-4 h-4 text-primary-600',
                  tw.border.secondary,
                  'focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  hasError && 'border-red-500 focus:ring-red-500'
                )}
              />
              <label
                className={cn(
                  'ml-2 text-sm cursor-pointer',
                  hasError ? tw.text.error : tw.text.primary,
                  option.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            hasError ? tw.text.error : tw.text.secondary
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'error' | 'success';
  onFileSelect?: (files: FileList | null) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({
    className,
    label,
    error,
    helperText,
    variant = 'default',
    onFileSelect,
    maxFiles = 1,
    acceptedTypes = [],
    maxSize = 5 * 1024 * 1024, // 5MB default
    id,
    ...props
  }, ref) => {
    const fileInputId = id || `file-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = error || variant === 'error';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      onFileSelect?.(files);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={fileInputId}
            className={cn(
              'block text-sm font-medium mb-1',
              hasError ? tw.text.error : tw.text.primary
            )}
          >
            {label}
          </label>
        )}
        
        <div className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-200',
          'hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
          hasError 
            ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
            : cn(tw.border.secondary, tw.bg.secondary),
          className
        )}>
          <input
            ref={ref}
            type="file"
            id={fileInputId}
            className="hidden"
            onChange={handleFileChange}
            multiple={maxFiles > 1}
            accept={acceptedTypes.join(',')}
            {...props}
          />
          
          <label htmlFor={fileInputId} className="cursor-pointer">
            <div className="space-y-2">
              <div className={tw.text.secondary}>
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className={cn(tw.typography.body.sm, tw.text.secondary)}>
                <span className={cn("font-medium", tw.text.link)}>Click to upload</span> or drag and drop
              </div>
              <div className={cn(tw.typography.body.xs, tw.text.muted)}>
                {acceptedTypes.length > 0 && `Accepted types: ${acceptedTypes.join(', ')}`}
                {maxFiles > 1 && ` • Max ${maxFiles} files`}
                {` • Max size: ${formatFileSize(maxSize)}`}
              </div>
            </div>
          </label>
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-xs',
            hasError ? tw.text.error : tw.text.secondary
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
