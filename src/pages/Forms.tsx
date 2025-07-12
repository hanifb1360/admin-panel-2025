import { useState } from 'react';
import { UserForm } from '../components/forms/UserForm';
import { MultiStepForm } from '../components/forms/MultiStepForm';
import { ContactForm } from '../components/forms/ContactForm';
import { SettingsForm } from '../components/forms/SettingsForm';
import { ProfileForm } from '../components/forms/ProfileForm';
import { FormButton } from '../components/ui/Form';
import { cn } from '../lib/utils';
import { tw } from '../design-system/utilities/tailwind';
import type { 
  UserFormData, 
  MultiStepFormData, 
  ContactFormData, 
  SettingsFormData,
  ProfileFormData 
} from '../lib/validations';

type FormType = 'user' | 'multistep' | 'contact' | 'settings' | 'profile';

export default function Forms() {
  const [activeForm, setActiveForm] = useState<FormType>('user');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('User form submitted:', data);
      
      // In a real app, you would send this to your API
      // await api.createUser(data);
      
    } catch (error) {
      console.error('Error submitting user form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiStepSubmit = async (data: MultiStepFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Multi-step form submitted:', data);
      
      // In a real app, you would send this to your API
      // await api.createProfile(data);
      
    } catch (error) {
      console.error('Error submitting multi-step form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Contact form submitted:', data);
      
      // In a real app, you would send this to your API
      // await api.sendContactMessage(data);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Settings form submitted:', data);
      
      // In a real app, you would send this to your API
      // await api.updateSettings(data);
      
    } catch (error) {
      console.error('Error submitting settings form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Profile form submitted:', data);
      
      // In a real app, you would send this to your API
      // await api.updateProfile(data);
      
    } catch (error) {
      console.error('Error submitting profile form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormNavigation = () => (
    <div className="flex space-x-2 mb-6">
      <FormButton
        type="button"
        variant={activeForm === 'user' ? 'primary' : 'outline'}
        onClick={() => setActiveForm('user')}
        size="sm"
      >
        User Form
      </FormButton>
      <FormButton
        type="button"
        variant={activeForm === 'multistep' ? 'primary' : 'outline'}
        onClick={() => setActiveForm('multistep')}
        size="sm"
      >
        Multi-Step Form
      </FormButton>
      <FormButton
        type="button"
        variant={activeForm === 'contact' ? 'primary' : 'outline'}
        onClick={() => setActiveForm('contact')}
        size="sm"
      >
        Contact Form
      </FormButton>
      <FormButton
        type="button"
        variant={activeForm === 'settings' ? 'primary' : 'outline'}
        onClick={() => setActiveForm('settings')}
        size="sm"
      >
        Settings Form
      </FormButton>
      <FormButton
        type="button"
        variant={activeForm === 'profile' ? 'primary' : 'outline'}
        onClick={() => setActiveForm('profile')}
        size="sm"
      >
        Profile Form
      </FormButton>
    </div>
  );

  const renderContactForm = () => (
    <ContactForm
      onSubmit={handleContactSubmit}
      isLoading={isLoading}
      onCancel={() => console.log('Contact form cancelled')}
    />
  );

  const renderSettingsForm = () => (
    <SettingsForm
      onSubmit={handleSettingsSubmit}
      isLoading={isLoading}
      onCancel={() => console.log('Settings form cancelled')}
    />
  );

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'user':
        return (
          <UserForm
            onSubmit={handleUserSubmit}
            isLoading={isLoading}
            onCancel={() => console.log('User form cancelled')}
          />
        );
      case 'multistep':
        return (
          <MultiStepForm
            onSubmit={handleMultiStepSubmit}
            isLoading={isLoading}
            onCancel={() => console.log('Multi-step form cancelled')}
          />
        );
      case 'contact':
        return renderContactForm();
      case 'settings':
        return renderSettingsForm();
      case 'profile':
        return (
          <ProfileForm
            onSubmit={handleProfileSubmit}
            isLoading={isLoading}
            onCancel={() => console.log('Profile form cancelled')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(tw.bg.secondary, "min-h-screen py-8")}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={cn(tw.typography.heading.xl, tw.text.primary, 'mb-2')}>
            Advanced Form Handling
          </h1>
          <p className={cn(tw.typography.body.base, tw.text.secondary)}>
            Comprehensive form examples with validation, error handling, and different layouts
          </p>
        </div>

        {renderFormNavigation()}

        <div className={cn(tw.bg.primary, tw.border.primary, "rounded-lg shadow-sm border p-6")}>
          <div className="mb-6">
            <h2 className={cn(tw.typography.heading.lg, tw.text.primary, 'mb-2')}>
              Advanced Form Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h3 className={cn(tw.typography.heading.sm, tw.text.primary)}>
                  Validation
                </h3>
                <ul className={cn(tw.text.secondary, tw.typography.body.sm, 'space-y-1')}>
                  <li>• Zod schema validation</li>
                  <li>• Real-time field validation</li>
                  <li>• Custom error messages</li>
                  <li>• Cross-field validation</li>
                  <li>• Nested object validation</li>
                  <li>• Conditional validation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className={cn(tw.typography.heading.sm, tw.text.primary)}>
                  Form Controls
                </h3>
                <ul className={cn(tw.text.secondary, tw.typography.body.sm, 'space-y-1')}>
                  <li>• Input with variants</li>
                  <li>• Textarea with resize</li>
                  <li>• Select with options</li>
                  <li>• Checkbox and radio groups</li>
                  <li>• File upload with validation</li>
                  <li>• Date and time pickers</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className={cn(tw.typography.heading.sm, tw.text.primary)}>
                  Advanced Features
                </h3>
                <ul className={cn(tw.text.secondary, tw.typography.body.sm, 'space-y-1')}>
                  <li>• Auto-save drafts</li>
                  <li>• Form persistence</li>
                  <li>• Multi-step navigation</li>
                  <li>• Dynamic field generation</li>
                  <li>• Conditional rendering</li>
                  <li>• Password strength validation</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className={cn(tw.typography.heading.sm, tw.text.primary)}>
                  UX Features
                </h3>
                <ul className={cn(tw.text.secondary, tw.typography.body.sm, 'space-y-1')}>
                  <li>• Loading states</li>
                  <li>• Error and success messages</li>
                  <li>• Character counters</li>
                  <li>• Field dependencies</li>
                  <li>• Responsive layouts</li>
                  <li>• Accessibility support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {renderActiveForm()}
        </div>
      </div>
    </div>
  );
}
