import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Form, FormSection, FormCard, FormError, FormSuccess } from '../ui/Form';
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
          <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition" onClick={loadDraftData} disabled={isLoading}>Load Draft</button>
          <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition" onClick={clearDraftData} disabled={isLoading}>Clear Form</button>
        </div>
      </div>

      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormError error={submitError} />
        <FormSuccess message={submitSuccess} />

        <FormSection title="Personal Information">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">First Name</label>
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
              {form.formState.errors.personal?.firstName?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.firstName?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Middle Name</label>
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
              {form.formState.errors.personal?.middleName?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.middleName?.message}</p>
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
                    placeholder="Enter your last name"
                    variant={form.formState.errors.personal?.lastName ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.personal?.lastName?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.lastName?.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Email</label>
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
              {form.formState.errors.personal?.email?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.email?.message}</p>
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
                    placeholder="Enter your phone number"
                    variant={form.formState.errors.personal?.phone ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.personal?.phone?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.phone?.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
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
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.personal?.dateOfBirth?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.dateOfBirth?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Gender</label>
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
              {form.formState.errors.personal?.gender?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.gender?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Nationality</label>
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
              {form.formState.errors.personal?.nationality?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.personal?.nationality?.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Address Information">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Street Address</label>
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
            {form.formState.errors.address?.street?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.address?.street?.message}</p>
            )}
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
                    placeholder="Enter your city"
                    variant={form.formState.errors.address?.city ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.address?.city?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.address?.city?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">State/Province</label>
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
              {form.formState.errors.address?.state?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.address?.state?.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
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
              {form.formState.errors.address?.zipCode?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.address?.zipCode?.message}</p>
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
                    placeholder="Select your country"
                    variant={form.formState.errors.address?.country ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
              {form.formState.errors.address?.country?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.address?.country?.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Professional Information">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Company <span className="text-red-500">*</span></label>
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
              {form.formState.errors.professional?.company?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.company?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Position <span className="text-red-500">*</span></label>
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
              {form.formState.errors.professional?.position?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.position?.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Department</label>
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
              {form.formState.errors.professional?.department?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.department?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Years of Experience <span className="text-red-500">*</span></label>
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
              {form.formState.errors.professional?.experience?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.experience?.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <label className="block text-sm font-medium mb-1">Skills <span className="text-red-500">*</span></label>
            <span className="text-xs text-gray-500">Select your technical skills ({selectedSkills.length} selected)</span>
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
            {form.formState.errors.professional?.skills?.message && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.skills?.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
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
              {form.formState.errors.professional?.linkedinProfile?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.linkedinProfile?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Portfolio Website</label>
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
              {form.formState.errors.professional?.portfolio?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.professional?.portfolio?.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Emergency Contact">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Emergency Contact Name <span className="text-red-500">*</span></label>
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
              {form.formState.errors.emergency?.name?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.emergency?.name?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Emergency Contact Phone <span className="text-red-500">*</span></label>
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
              {form.formState.errors.emergency?.phone?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.emergency?.phone?.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Relationship <span className="text-red-500">*</span></label>
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
              {form.formState.errors.emergency?.relationship?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.emergency?.relationship?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Emergency Contact Address</label>
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
              {form.formState.errors.emergency?.address?.message && (
                <p className="mt-1 text-xs text-red-600">{form.formState.errors.emergency?.address?.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection title="Privacy & Preferences">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Privacy Settings</label>
              <span className="text-xs text-gray-500">Control who can see your profile information</span>
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.privacy.profileVisible"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">Make profile visible to others</span>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.privacy.showEmail"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">Show email address on profile</span>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.privacy.showPhone"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">Show phone number on profile</span>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Notification Preferences</label>
              <span className="text-xs text-gray-500">Choose how you want to receive notifications</span>
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.notifications.email"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">Email notifications</span>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.notifications.push"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">Push notifications</span>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.notifications.sms"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">SMS notifications</span>
                      </>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Controller
                    name="preferences.notifications.marketing"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          disabled={isLoading}
                        />
                        <span className="text-sm">Marketing emails</span>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        <div className="flex gap-4 justify-end mt-6">
          {onCancel && (
            <button 
              type="button" 
              className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button 
            type="button" 
            className="px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition" 
            onClick={persistence.manualSave}
            disabled={isLoading}
          >
            Save Draft
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition" 
            disabled={isLoading}
          >
            Save Profile
          </button>
        </div>
      </Form>
    </FormCard>
  );
}
