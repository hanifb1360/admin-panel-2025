import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { 
  Form, 
  FormSection, 
  FormCard, 
  FormError,
  FormSuccess 
} from '../ui/Form';
import { 
  Input, 
  Textarea, 
  Select, 
  FileUpload 
} from '../ui/FormControls';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import { contactFormSchema, type ContactFormData } from '../../lib/validations';
import { validateFileUpload } from '../../lib/validations';
import { cn } from '../../lib/utils';
import { tw, componentVariants } from '../../design-system/utilities/tailwind';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const categoryOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'billing', label: 'Billing' },
  { value: 'feedback', label: 'Feedback' },
];

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<ContactFormData>;
}

export function ContactForm({ onSubmit, onCancel, isLoading, initialData }: ContactFormProps) {
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useFormWithValidation<ContactFormData>({
    schema: contactFormSchema,
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      category: 'general',
      ...initialData,
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError('');
      setSubmitSuccess('');

      // Validate file uploads
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const validation = validateFileUpload(file, {
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
          });
          
          if (!validation.isValid) {
            setSubmitError(validation.error || 'File validation failed');
            return;
          }
        }
      }

      const submissionData = {
        ...data,
        attachments: uploadedFiles,
      };

      await onSubmit(submissionData);
      setSubmitSuccess('Your message has been sent successfully!');
      form.reset();
      setUploadedFiles([]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFieldCharacterCount = (fieldName: keyof ContactFormData) => {
    const value = form.watch(fieldName) as string;
    return value ? value.length : 0;
  };

  return (
    <FormCard 
      title="Contact Form" 
      description="Send us a message and we'll get back to you as soon as possible"
      className={cn("max-w-4xl mx-auto", tw.bg.white, tw.effects.rounded.lg, tw.effects.shadow.sm, tw.border.primary, "border")}
    >
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormError error={submitError} />
        <FormSuccess message={submitSuccess} />

        <FormSection title="Contact Information">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your full name"
                    variant={form.getFieldError('name') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.getFieldError('name') && (
                <p className={cn("mt-1 text-xs", tw.text.error)}>{form.getFieldError('name')}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email address"
                    variant={form.getFieldError('email') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.getFieldError('email') && (
                <p className={cn("mt-1 text-xs", tw.text.error)}>{form.getFieldError('email')}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Message Details">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={priorityOptions}
                    placeholder="Select priority"
                    variant={form.getFieldError('priority') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.getFieldError('priority') && (
                <p className={cn("mt-1 text-xs", tw.text.error)}>{form.getFieldError('priority')}</p>
              )}
              <p className={cn("text-xs", tw.text.secondary)}>Select the urgency level of your inquiry</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Category</label>
              <Controller
                name="category"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categoryOptions}
                    placeholder="Select category"
                    variant={form.getFieldError('category') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.getFieldError('category') && (
                <p className={cn("mt-1 text-xs", tw.text.error)}>{form.getFieldError('category')}</p>
              )}
              <p className={cn("text-xs", tw.text.secondary)}>Choose the category that best fits your inquiry</p>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Controller
              name="subject"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter the subject of your message"
                  variant={form.getFieldError('subject') ? 'error' : 'default'}
                  disabled={isLoading}
                  maxLength={100}
                />
              )}
            />
            {form.getFieldError('subject') && (
              <p className="mt-1 text-xs text-red-600">{form.getFieldError('subject')}</p>
            )}
            <p className={cn("text-xs", tw.text.secondary)}>{getFieldCharacterCount('subject')}/100 characters</p>
          </div>

          <div className="space-y-2 mt-6">
            <label className="block text-sm font-medium mb-1">Message</label>
            <Controller
              name="message"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Please provide detailed information about your inquiry..."
                  rows={6}
                  variant={form.getFieldError('message') ? 'error' : 'default'}
                  disabled={isLoading}
                  maxLength={1000}
                />
              )}
            />
            {form.getFieldError('message') && (
              <p className="mt-1 text-xs text-red-600">{form.getFieldError('message')}</p>
            )}
            <p className={cn("text-xs", tw.text.secondary)}>{getFieldCharacterCount('message')}/1000 characters</p>
          </div>
        </FormSection>

        <FormSection title="Attachments (Optional)">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">File Attachments</label>
            <FileUpload
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.txt"
              maxSize={10 * 1024 * 1024}
              maxFiles={5}
              acceptedTypes={["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"]}
              onFileSelect={(files) => {
                if (files) {
                  const fileArray = Array.from(files);
                  setUploadedFiles(fileArray);
                }
              }}
              disabled={isLoading}
            />
            <p className={cn("text-xs", tw.text.secondary)}>You can attach images (JPEG, PNG, GIF), PDF files, or text documents. Maximum file size: 10MB each.</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className={cn(tw.typography.heading.sm, tw.text.primary)}>
                Uploaded Files ({uploadedFiles.length})
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      tw.bg.secondary,
                      tw.border.primary
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        tw.bg.blue[100]
                      )}>
                        <span className={cn("text-sm font-medium", tw.text.info)}>
                          {file.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className={cn(tw.typography.body.sm, tw.text.primary)}>
                          {file.name}
                        </p>
                        <p className={cn(tw.typography.body.xs, tw.text.secondary)}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={cn("px-2 py-1 rounded border text-xs", tw.border.primary, tw.text.primary, tw.bg.white, tw.states.hover.bg.gray100)}
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>

        <div className="flex gap-4 justify-end mt-6">
          {onCancel && (
            <button 
              type="button" 
              className={cn(componentVariants.button.secondary, "transition")}
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className={cn(componentVariants.button.primary, "transition")}
            disabled={isLoading || !form.state.isValid}
          >
            Send Message
          </button>
        </div>
      </Form>
    </FormCard>
  );
}
