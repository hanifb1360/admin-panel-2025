import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { tw, componentVariants } from '../../design-system/utilities/tailwind';
import { Form, FormSection, FormCard, FormError, FormSuccess } from '../ui/Form';
import { 
  Input, 
  Select, 
  Checkbox, 
  RadioGroup 
} from '../ui/FormControls';

// Multi-step form schema
const multiStepSchema = z.object({
  // Step 1: Personal Information
  personal: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
  }),
  
  // Step 2: Address Information
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  
  // Step 3: Professional Information
  professional: z.object({
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    experience: z.number().min(0, 'Experience cannot be negative'),
    salary: z.number().positive('Salary must be positive'),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
  }),
  
  // Step 4: Preferences
  preferences: z.object({
    newsletter: z.boolean().default(false),
    notifications: z.boolean().default(true),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('en'),
  }),
});

type MultiStepFormData = z.infer<typeof multiStepSchema>;

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic personal details',
  },
  {
    id: 'address',
    title: 'Address Information',
    description: 'Contact and location details',
  },
  {
    id: 'professional',
    title: 'Professional Information',
    description: 'Work and career details',
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Account preferences and settings',
  },
];

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
];

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

interface MultiStepFormProps {
  onSubmit: (data: MultiStepFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function MultiStepForm({ onSubmit, onCancel, isLoading }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const form = useForm<MultiStepFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(multiStepSchema) as any,
    defaultValues: {
      personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      professional: {
        company: '',
        position: '',
        experience: 0,
        salary: 0,
        skills: [],
      },
      preferences: {
        newsletter: false,
        notifications: true,
        theme: 'system' as const,
        language: 'en',
      },
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: MultiStepFormData) => {
    try {
      setSubmitError('');
      setSubmitSuccess('');
      await onSubmit(data);
      setSubmitSuccess('Form submitted successfully!');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Removed unused nextStep function

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer',
              index === currentStep && tw.interactive.primary,
              index < currentStep && cn(tw.bg.green[600], 'text-white'),
              index > currentStep && cn(tw.bg.gray[200], tw.text.secondary)
            )}
            onClick={() => goToStep(index)}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              'w-16 h-0.5 mx-2',
              index < currentStep ? tw.bg.green[600] : tw.bg.gray[200]
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalStep = () => (
    <FormSection title="Personal Information" description="Tell us about yourself">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Controller
            name="personal.firstName"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter first name"
                variant={form.formState.errors.personal?.firstName ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.personal?.firstName?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.personal?.firstName?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Controller
            name="personal.lastName"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter last name"
                variant={form.formState.errors.personal?.lastName ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.personal?.lastName?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.personal?.lastName?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <Controller
            name="personal.email"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Enter email address"
                variant={form.formState.errors.personal?.email ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.personal?.email?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.personal?.email?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Controller
            name="personal.phone"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="tel"
                placeholder="Enter phone number"
                variant={form.formState.errors.personal?.phone ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.personal?.phone?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.personal?.phone?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <Controller
            name="personal.dateOfBirth"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                variant={form.formState.errors.personal?.dateOfBirth ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.personal?.dateOfBirth?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.personal?.dateOfBirth?.message}</p>
          )}
        </div>
      </div>
    </FormSection>
  );

  const renderAddressStep = () => (
    <FormSection title="Address Information" description="Where can we reach you?">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <Controller
            name="address.street"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter street address"
                variant={form.formState.errors.address?.street ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.address?.street?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.address?.street?.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">City</label>
          <Controller
            name="address.city"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter city"
                variant={form.formState.errors.address?.city ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.address?.city?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.address?.city?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">State</label>
          <Controller
            name="address.state"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter state"
                variant={form.formState.errors.address?.state ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.address?.state?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.address?.state?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <Controller
            name="address.zipCode"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter ZIP code"
                variant={form.formState.errors.address?.zipCode ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.address?.zipCode?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.address?.zipCode?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Country</label>
          <Controller
            name="address.country"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                options={countryOptions}
                placeholder="Select country"
                variant={form.formState.errors.address?.country ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.address?.country?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.address?.country?.message}</p>
          )}
        </div>
      </div>
    </FormSection>
  );

  const renderProfessionalStep = () => (
    <FormSection title="Professional Information" description="Tell us about your work">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Company</label>
          <Controller
            name="professional.company"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter company name"
                variant={form.formState.errors.professional?.company ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.professional?.company?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.professional?.company?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Position</label>
          <Controller
            name="professional.position"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter position"
                variant={form.formState.errors.professional?.position ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.professional?.position?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.professional?.position?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Years of Experience</label>
          <Controller
            name="professional.experience"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="Enter years of experience"
                variant={form.formState.errors.professional?.experience ? 'error' : 'default'}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
          {form.formState.errors.professional?.experience?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.professional?.experience?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Salary</label>
          <Controller
            name="professional.salary"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min="0"
                placeholder="Enter salary"
                variant={form.formState.errors.professional?.salary ? 'error' : 'default'}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
          {form.formState.errors.professional?.salary?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.professional?.salary?.message}</p>
          )}
        </div>
      </div>
    </FormSection>
  );

  const renderPreferencesStep = () => (
    <FormSection title="Preferences" description="Customize your experience">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Theme</label>
          <Controller
            name="preferences.theme"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                options={themeOptions}
                direction="vertical"
                variant={form.formState.errors.preferences?.theme ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.preferences?.theme?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.preferences?.theme?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Language</label>
          <Controller
            name="preferences.language"
            control={form.control}
            render={({ field }) => (
              <Select
                {...field}
                options={languageOptions}
                placeholder="Select language"
                variant={form.formState.errors.preferences?.language ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.preferences?.language?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.preferences?.language?.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Subscribe to newsletter</label>
          <Controller
            name="preferences.newsletter"
            control={form.control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                variant={form.formState.errors.preferences?.newsletter ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.preferences?.newsletter?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.preferences?.newsletter?.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">Enable push notifications</label>
          <Controller
            name="preferences.notifications"
            control={form.control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                variant={form.formState.errors.preferences?.notifications ? 'error' : 'default'}
              />
            )}
          />
          {form.formState.errors.preferences?.notifications?.message && (
            <p className={cn("mt-1 text-xs", tw.text.error)}>{form.formState.errors.preferences?.notifications?.message}</p>
          )}
        </div>
      </div>
    </FormSection>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalStep();
      case 1:
        return renderAddressStep();
      case 2:
        return renderProfessionalStep();
      case 3:
        return renderPreferencesStep();
      default:
        return renderPersonalStep();
    }
  };

  return (
    <FormCard 
      title={steps[currentStep].title} 
      description={steps[currentStep].description}
      className={cn("max-w-4xl mx-auto", tw.bg.white, tw.effects.rounded.lg, tw.effects.shadow.sm, tw.border.primary, "border")}
    >
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        {renderStepIndicator()}
        <FormError error={submitError} />
        <FormSuccess message={submitSuccess} />
        {renderCurrentStep()}
        <div className="flex gap-4 justify-end mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              className={cn(componentVariants.button.secondary, "transition")}
              onClick={prevStep}
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>
          )}
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
            disabled={isLoading}
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </Form>
    </FormCard>
  );
}
