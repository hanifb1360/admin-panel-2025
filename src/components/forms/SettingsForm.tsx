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
  Textarea, 
  Select, 
  Checkbox,
  RadioGroup 
} from '../ui/FormControls';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import { settingsFormSchema, type SettingsFormData } from '../../lib/validations';
import { cn } from '../../lib/utils';
import { tw } from '../../design-system/utilities/tailwind';

const themeOptions = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'system', label: 'System Default' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
];

const timezoneOptions = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'British Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Berlin', label: 'German Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)' },
];

interface SettingsFormProps {
  onSubmit: (data: SettingsFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  initialData?: Partial<SettingsFormData>;
}

export function SettingsForm({ onSubmit, onCancel, isLoading, initialData }: SettingsFormProps) {
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const form = useFormWithValidation<SettingsFormData>({
    schema: settingsFormSchema,
    defaultValues: {
      siteName: '',
      siteDescription: '',
      adminEmail: '',
      maintenanceMode: false,
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: false,
        },
      },
      ...initialData,
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: SettingsFormData) => {
    try {
      setSubmitError('');
      setSubmitSuccess('');
      await onSubmit(data);
      setSubmitSuccess('Settings saved successfully!');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const maintenanceMode = form.watch('maintenanceMode');
  const twoFactorAuth = form.watch('security.twoFactorAuth');
  const sessionTimeout = form.watch('security.sessionTimeout');

  return (
    <FormCard 
      title="Application Settings" 
      description="Configure your application settings, security, and preferences"
      className="max-w-6xl mx-auto"
    >
      <Form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormError error={submitError} />
        <FormSuccess message={submitSuccess} />

        <FormSection title="General Settings">
          <FormGrid columns={2}>
            <FormField
              label="Site Name"
              error={form.getFieldError('siteName')}
              required
            >
              <Controller
                name="siteName"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your site name"
                    variant={form.getFieldError('siteName') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Admin Email"
              error={form.getFieldError('adminEmail')}
              required
            >
              <Controller
                name="adminEmail"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter admin email address"
                    variant={form.getFieldError('adminEmail') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>

          <FormField
            label="Site Description"
            error={form.getFieldError('siteDescription')}
            helperText="A brief description of your site (optional)"
          >
            <Controller
              name="siteDescription"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter a description of your site..."
                  rows={3}
                  variant={form.getFieldError('siteDescription') ? 'error' : 'default'}
                  disabled={isLoading}
                />
              )}
            />
          </FormField>

          <FormField
            label="Maintenance Mode"
            error={form.getFieldError('maintenanceMode')}
            helperText="Enable maintenance mode to restrict site access"
          >
            <Controller
              name="maintenanceMode"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  label="Enable maintenance mode"
                  variant={form.getFieldError('maintenanceMode') ? 'error' : 'default'}
                  disabled={isLoading}
                />
              )}
            />
          </FormField>

          {maintenanceMode && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className={cn(tw.text.warning, tw.typography.body.sm)}>
                ⚠️ Maintenance mode is enabled. Users will not be able to access the site except for administrators.
              </p>
            </div>
          )}
        </FormSection>

        <FormSection title="Appearance & Localization">
          <FormGrid columns={3}>
            <FormField
              label="Theme"
              error={form.getFieldError('theme')}
              helperText="Choose your preferred theme"
            >
              <Controller
                name="theme"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    options={themeOptions}
                    variant={form.getFieldError('theme') ? 'error' : 'default'}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Language"
              error={form.getFieldError('language')}
              helperText="Default language for the interface"
            >
              <Controller
                name="language"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={languageOptions}
                    placeholder="Select language"
                    variant={form.getFieldError('language') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Timezone"
              error={form.getFieldError('timezone')}
              helperText="Default timezone for dates and times"
            >
              <Controller
                name="timezone"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={timezoneOptions}
                    placeholder="Select timezone"
                    variant={form.getFieldError('timezone') ? 'error' : 'default'}
                    disabled={isLoading}
                  />
                )}
              />
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection title="Notification Settings">
          <FormField
            label="Notification Types"
            helperText="Choose which types of notifications you want to receive"
          >
            <div className="space-y-3">
              <Controller
                name="notifications.email"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    label="Email notifications"
                    helperText="Receive notifications via email"
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="notifications.push"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    label="Push notifications"
                    helperText="Receive push notifications in your browser"
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="notifications.sms"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    label="SMS notifications"
                    helperText="Receive notifications via SMS (requires phone number)"
                    disabled={isLoading}
                  />
                )}
              />
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Security Settings">
          <FormField
            label="Two-Factor Authentication"
            helperText="Enable two-factor authentication for enhanced security"
          >
            <Controller
              name="security.twoFactorAuth"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  label="Enable two-factor authentication"
                  disabled={isLoading}
                />
              )}
            />
          </FormField>

          {twoFactorAuth && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className={cn(tw.text.success, tw.typography.body.sm)}>
                ✅ Two-factor authentication will be enabled. Users will need to provide a second form of authentication when logging in.
              </p>
            </div>
          )}

          <FormField
            label="Session Timeout"
            helperText={`Users will be logged out after ${sessionTimeout} minutes of inactivity`}
          >
            <Controller
              name="security.sessionTimeout"
              control={form.control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  min="5"
                  max="1440"
                  placeholder="Session timeout in minutes"
                  disabled={isLoading}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              )}
            />
          </FormField>

          <FormSection title="Password Policy" className="ml-0 pl-0">
            <FormField
              label="Minimum Password Length"
              helperText="Minimum number of characters required for passwords"
            >
              <Controller
                name="security.passwordPolicy.minLength"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="6"
                    max="50"
                    placeholder="Minimum password length"
                    disabled={isLoading}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Password Requirements"
              helperText="Select which character types are required in passwords"
            >
              <div className="space-y-3">
                <Controller
                  name="security.passwordPolicy.requireUppercase"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Require uppercase letters (A-Z)"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="security.passwordPolicy.requireNumbers"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Require numbers (0-9)"
                      disabled={isLoading}
                    />
                  )}
                />

                <Controller
                  name="security.passwordPolicy.requireSymbols"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      label="Require special characters (!@#$%^&*)"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </FormField>
          </FormSection>
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
            Save Settings
          </FormButton>
        </FormActions>
      </Form>
    </FormCard>
  );
}
