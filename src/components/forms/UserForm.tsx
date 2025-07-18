import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormSection, FormCard, FormError, FormSuccess } from '../ui/Form';
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
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Name</label>
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
              {form.formState.errors.name?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.name?.message}</p>
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
                    placeholder="Enter email address"
                    variant={form.formState.errors.email ? 'error' : 'default'}
                  />
                )}
              />
              {form.formState.errors.email?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.email?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Phone</label>
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
              {form.formState.errors.phone?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Department</label>
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
              {form.formState.errors.department?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.department?.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Role & Permissions">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Role</label>
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
              {form.formState.errors.role?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.role?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Active user</label>
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    variant={form.formState.errors.isActive ? 'error' : 'default'}
                  />
                )}
              />
              {form.formState.errors.isActive?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.isActive?.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Additional Information">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Bio</label>
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
            {form.formState.errors.bio?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.bio?.message}</p>
            )}
          </div>
        </FormSection>

        <div className="flex gap-4 justify-end mt-6">
          {onCancel && (
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition" onClick={onCancel} disabled={isLoading}>Cancel</button>
          )}
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition" disabled={isLoading}>
            {initialData ? 'Update User' : 'Create User'}
          </button>
        </div>
      </Form>
    </FormCard>
  );
}
