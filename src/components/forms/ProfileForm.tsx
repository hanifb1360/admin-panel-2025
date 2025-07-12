import { useState } from 'react';
import { Controller } from 'react-hook-form';
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
  Select, 
  Checkbox
} from '../ui/FormControls';
import { useFormWithValidation, useFormPersistence } from '../../hooks/useFormWithValidation';
import { profileFormSchema, type ProfileFormData } from '../../lib/validations';
import { cn } from '../../lib/utils';
import { tw } from '../../design-system/utilities/tailwind';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'BR', label: 'Brazil' },
];

const skillsOptions = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
  'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
  'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'Git', 'CI/CD', 'Testing', 'DevOps', 'Microservices'
];

const relationshipOptions = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' },
];

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<ProfileFormData>;
}

export function ProfileForm({ onSubmit, onCancel, isLoading, initialData }: ProfileFormProps) {
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const form = useFormWithValidation<ProfileFormData>({
    schema: profileFormSchema,
    defaultValues: {
      personal: {
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: undefined,
        nationality: '',
        profileImage: '',
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
        department: '',
        experience: 0,
        salary: undefined,
        skills: [],
        certifications: [],
        languages: [],
        linkedinProfile: '',
        portfolio: '',
      },
      emergency: {
        name: '',
        phone: '',
        relationship: '',
        address: '',
      },
      preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          push: false,
          sms: false,
          marketing: false,
        },
        privacy: {
          profileVisible: true,
          showEmail: false,
          showPhone: false,
        },
      },
      ...initialData,
    },
    mode: 'onChange',
  });

  // Auto-save functionality
  const persistence = useFormPersistence(form, 'profile-form', {
    debounceMs: 2000,
    autoSave: true,
    clearOnSubmit: true,
  });

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setSubmitError('');
      setSubmitSuccess('');
      await onSubmit(data);
      setSubmitSuccess('Profile saved successfully!');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleSkillToggle = (skill: string) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(updatedSkills);
    form.setValue('professional.skills', updatedSkills);
  };

  const loadDraftData = () => {
    const loaded = persistence.loadSavedData();
    if (loaded) {
      setSubmitSuccess('Draft data loaded successfully!');
      setTimeout(() => setSubmitSuccess(''), 3000);
    }
  };

  const clearDraftData = () => {
    persistence.clearSavedData();
    form.reset();
    setSelectedSkills([]);
    setSubmitSuccess('Form cleared successfully!');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  return (
    <FormCard 
      title="Professional Profile" 
      description="Complete your professional profile with personal, contact, and professional information"
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={cn(tw.typography.body.sm, tw.text.secondary)}>
            {persistence.isSaving ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </span>
            ) : persistence.lastSaved ? (
              <span>Last saved: {persistence.lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span>No draft saved</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <FormButton
            type="button"
            variant="outline"
            size="sm"
            onClick={loadDraftData}
            disabled={isLoading}
          >
            Load Draft
          </FormButton>
          <FormButton
            type="button"
            variant="outline"
            size="sm"
            onClick={clearDraftData}
            disabled={isLoading}
          >
            Clear Form
          </FormButton>
        </div>
      </div>

      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormError error={submitError} />
        <FormSuccess message={submitSuccess} />

        <FormSection title="Personal Information">
          <FormGrid columns={3}>
            <FormField
              label="First Name"
              error={form.formState.errors.personal?.firstName?.message}
              required
            >
              <Controller
                name="personal.firstName"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your first name"
                    variant={form.formState.errors.personal?.firstName ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Middle Name"
              error={form.formState.errors.personal?.middleName?.message}
            >
              <Controller
                name="personal.middleName"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your middle name"
                    variant={form.formState.errors.personal?.middleName ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Last Name"
              error={form.formState.errors.personal?.lastName?.message}
              required
            >
              <Controller
                name="personal.lastName"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your last name"
                    variant={form.formState.errors.personal?.lastName ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormGrid columns={2}>
            <FormField
              label="Email"
              error={form.formState.errors.personal?.email?.message}
              required
            >
              <Controller
                name="personal.email"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email address"
                    variant={form.formState.errors.personal?.email ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Phone"
              error={form.formState.errors.personal?.phone?.message}
              required
            >
              <Controller
                name="personal.phone"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter your phone number"
                    variant={form.formState.errors.personal?.phone ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormGrid columns={3}>
            <FormField
              label="Date of Birth"
              error={form.formState.errors.personal?.dateOfBirth?.message}
              required
            >
              <Controller
                name="personal.dateOfBirth"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    variant={form.formState.errors.personal?.dateOfBirth ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Gender"
              error={form.formState.errors.personal?.gender?.message}
            >
              <Controller
                name="personal.gender"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={genderOptions}
                    placeholder="Select gender"
                    variant={form.formState.errors.personal?.gender ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Nationality"
              error={form.formState.errors.personal?.nationality?.message}
            >
              <Controller
                name="personal.nationality"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your nationality"
                    variant={form.formState.errors.personal?.nationality ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Address Information">
          <FormField
            label="Street Address"
            error={form.formState.errors.address?.street?.message}
            required
          >
            <Controller
              name="address.street"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your street address"
                  variant={form.formState.errors.address?.street ? 'error' : 'default'}
                  disabled={isLoading}
                />
              )}
            />
          </FormField>

          <FormGrid columns={2}>
            <FormField
              label="City"
              error={form.formState.errors.address?.city?.message}
              required
            >
              <Controller
                name="address.city"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your city"
                    variant={form.formState.errors.address?.city ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="State/Province"
              error={form.formState.errors.address?.state?.message}
              required
            >
              <Controller
                name="address.state"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your state or province"
                    variant={form.formState.errors.address?.state ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormGrid columns={2}>
            <FormField
              label="ZIP/Postal Code"
              error={form.formState.errors.address?.zipCode?.message}
              required
            >
              <Controller
                name="address.zipCode"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your ZIP or postal code"
                    variant={form.formState.errors.address?.zipCode ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Country"
              error={form.formState.errors.address?.country?.message}
              required
            >
              <Controller
                name="address.country"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countryOptions}
                    placeholder="Select your country"
                    variant={form.formState.errors.address?.country ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Professional Information">
          <FormGrid columns={2}>
            <FormField
              label="Company"
              error={form.formState.errors.professional?.company?.message}
              required
            >
              <Controller
                name="professional.company"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your company name"
                    variant={form.formState.errors.professional?.company ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Position"
              error={form.formState.errors.professional?.position?.message}
              required
            >
              <Controller
                name="professional.position"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your job title"
                    variant={form.formState.errors.professional?.position ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormGrid columns={2}>
            <FormField
              label="Department"
              error={form.formState.errors.professional?.department?.message}
            >
              <Controller
                name="professional.department"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your department"
                    variant={form.formState.errors.professional?.department ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Years of Experience"
              error={form.formState.errors.professional?.experience?.message}
              required
            >
              <Controller
                name="professional.experience"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="50"
                    placeholder="Enter years of experience"
                    variant={form.formState.errors.professional?.experience ? 'error' : 'default'}
                    disabled={isLoading}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormField
            label="Skills"
            error={form.formState.errors.professional?.skills?.message}
            helperText={`Select your technical skills (${selectedSkills.length} selected)`}
            required
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
              {skillsOptions.map((skill) => (
                <label
                  key={skill}
                  className={cn(
                    'flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-colors',
                    selectedSkills.includes(skill)
                      ? cn(tw.bg.blue[50], 'border-blue-200 dark:border-blue-700', tw.text.info)
                      : cn(tw.bg.secondary, tw.border.primary, 'hover:bg-gray-100 dark:hover:bg-gray-700')
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className={cn("rounded text-blue-600 focus:ring-blue-500", tw.border.secondary)}
                  />
                  <span className={cn("text-sm font-medium", tw.text.primary)}>{skill}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormGrid columns={2}>
            <FormField
              label="LinkedIn Profile"
              error={form.formState.errors.professional?.linkedinProfile?.message}
            >
              <Controller
                name="professional.linkedinProfile"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    variant={form.formState.errors.professional?.linkedinProfile ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Portfolio Website"
              error={form.formState.errors.professional?.portfolio?.message}
            >
              <Controller
                name="professional.portfolio"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://yourportfolio.com"
                    variant={form.formState.errors.professional?.portfolio ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Emergency Contact">
          <FormGrid columns={2}>
            <FormField
              label="Emergency Contact Name"
              error={form.formState.errors.emergency?.name?.message}
              required
            >
              <Controller
                name="emergency.name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter emergency contact name"
                    variant={form.formState.errors.emergency?.name ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Emergency Contact Phone"
              error={form.formState.errors.emergency?.phone?.message}
              required
            >
              <Controller
                name="emergency.phone"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Enter emergency contact phone"
                    variant={form.formState.errors.emergency?.phone ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormGrid columns={2}>
            <FormField
              label="Relationship"
              error={form.formState.errors.emergency?.relationship?.message}
              required
            >
              <Controller
                name="emergency.relationship"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={relationshipOptions}
                    placeholder="Select relationship"
                    variant={form.formState.errors.emergency?.relationship ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Emergency Contact Address"
              error={form.formState.errors.emergency?.address?.message}
            >
              <Controller
                name="emergency.address"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter emergency contact address"
                    variant={form.formState.errors.emergency?.address ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Privacy & Preferences">
          <FormGrid columns={2}>
            <FormField
              label="Privacy Settings"
              helperText="Control who can see your profile information"
            >
              <div className="space-y-3">
                <Controller
                  name="preferences.privacy.profileVisible"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Make profile visible to others"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="preferences.privacy.showEmail"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Show email address on profile"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="preferences.privacy.showPhone"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Show phone number on profile"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </FormField>

            <FormField
              label="Notification Preferences"
              helperText="Choose how you want to receive notifications"
            >
              <div className="space-y-3">
                <Controller
                  name="preferences.notifications.email"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Email notifications"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="preferences.notifications.push"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Push notifications"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="preferences.notifications.sms"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="SMS notifications"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="preferences.notifications.marketing"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Marketing emails"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </FormField>
          </FormGrid>
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
            type="button" 
            variant="outline" 
            onClick={persistence.manualSave}
            disabled={isLoading}
          >
            Save Draft
          </FormButton>
          <FormButton 
            type="submit" 
            variant="primary" 
            loading={isLoading}
            disabled={isLoading}
          >
            Save Profile
          </FormButton>
        </FormActions>
      </Form>
    </FormCard>
  );
}
