import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormField, 
  FormSection, 
  FormActions, 
  FormButton, 
  FormGrid, 
  FormCard, 
  FormError,
  FormSuccess 
} from '../ui/Form';
import { 
  Input, 
  Textarea, 
  Select, 
  Checkbox 
} from '../ui/FormControls';

// User form schema
const userSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'user', 'moderator'], {
    message: 'Please select a valid role',
  }),
  isActive: z.boolean().default(true),
  phone: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' },
];

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
];

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const form = useForm<UserFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      role: 'user' as const,
      isActive: true,
      phone: '',
      department: '',
      bio: '',
      ...initialData,
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    try {
      setSubmitError('');
      setSubmitSuccess('');
      await onSubmit(data);
      setSubmitSuccess('User saved successfully!');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <FormCard title="User Information" description="Manage user details and permissions">
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormError error={submitError} />
        <FormSuccess message={submitSuccess} />

        <FormSection title="Basic Information">
          <FormGrid columns={2}>
            <FormField
              label="Name"
              error={form.formState.errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter full name"
                    variant={form.formState.errors.name ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Email"
              error={form.formState.errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    variant={form.formState.errors.email ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Phone"
              error={form.formState.errors.phone?.message}
            >
              <Controller
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                    variant={form.formState.errors.phone ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Department"
              error={form.formState.errors.department?.message}
            >
              <Controller
                name="department"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={departmentOptions}
                    placeholder="Select department"
                    variant={form.formState.errors.department ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Role & Permissions">
          <FormGrid columns={2}>
            <FormField
              label="Role"
              error={form.formState.errors.role?.message}
              required
            >
              <Controller
                name="role"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={roleOptions}
                    placeholder="Select role"
                    variant={form.formState.errors.role ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Status"
              error={form.formState.errors.isActive?.message}
            >
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    label="Active user"
                    variant={form.formState.errors.isActive ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Additional Information">
          <FormField
            label="Bio"
            error={form.formState.errors.bio?.message}
            helperText="Optional description about the user"
          >
            <Controller
              name="bio"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter user bio..."
                  rows={4}
                  variant={form.formState.errors.bio ? 'error' : 'default'}
                />
              )}
            />
          </FormField>
        </FormSection>

        <FormActions>
          {onCancel && (
            <FormButton 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </FormButton>
          )}
          <FormButton 
            type="submit" 
            variant="primary" 
            loading={isLoading}
            disabled={isLoading}
          >
            {initialData ? 'Update User' : 'Create User'}
          </FormButton>
        </FormActions>
      </Form>
    </FormCard>
  );
}
