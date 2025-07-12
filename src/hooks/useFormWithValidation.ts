import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

export interface UseFormWithValidationOptions<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues?: Partial<T>;
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
  reValidateMode?: 'onSubmit' | 'onBlur' | 'onChange';
  shouldUnregister?: boolean;
  delayError?: number;
  criteriaMode?: 'firstError' | 'all';
  shouldFocusError?: boolean;
  shouldUseNativeValidation?: boolean;
}

export interface FormValidationState {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitSuccessful: boolean;
  submitCount: number;
  hasErrors: boolean;
  errorCount: number;
}

export interface UseFormWithValidationReturn<T extends FieldValues> extends UseFormReturn<T> {
  state: FormValidationState;
  submitWithValidation: (onSubmit: (data: T) => Promise<void> | void) => Promise<void>;
  resetForm: () => void;
  validateField: (fieldName: keyof T) => Promise<boolean>;
  validateAllFields: () => Promise<boolean>;
  getFieldError: (fieldName: keyof T) => string | undefined;
  setFieldError: (fieldName: keyof T, error: string) => void;
  clearFieldError: (fieldName: keyof T) => void;
  clearAllErrors: () => void;
  saveAsDraft: () => void;
  loadFromDraft: () => void;
  autoSave: boolean;
  setAutoSave: (enabled: boolean) => void;
}

export function useFormWithValidation<T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onSubmit',
  reValidateMode = 'onChange',
  shouldUnregister = false,
  delayError = 0,
  criteriaMode = 'firstError',
  shouldFocusError = true,
  shouldUseNativeValidation = false,
}: UseFormWithValidationOptions<T>): UseFormWithValidationReturn<T> {
  const [autoSave, setAutoSave] = useState(false);
  const [draftKey] = useState(() => `form-draft-${Date.now()}`);

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
    mode,
    reValidateMode,
    shouldUnregister,
    delayError,
    criteriaMode,
    shouldFocusError,
    shouldUseNativeValidation,
  });

  const formState = useFormState({ control: form.control });
  const watchedValues = useWatch({ control: form.control });

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && formState.isDirty) {
      const timer = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(watchedValues));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [watchedValues, autoSave, formState.isDirty, draftKey]);

  const state: FormValidationState = {
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    isSubmitted: formState.isSubmitted,
    isSubmitSuccessful: formState.isSubmitSuccessful,
    submitCount: formState.submitCount,
    hasErrors: Object.keys(formState.errors).length > 0,
    errorCount: Object.keys(formState.errors).length,
  };

  const submitWithValidation = useCallback(async (onSubmit: (data: T) => Promise<void> | void) => {
    try {
      const isValid = await form.trigger();
      if (isValid) {
        const data = form.getValues();
        await onSubmit(data);
        // Clear draft on successful submit
        localStorage.removeItem(draftKey);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }, [form, draftKey]);

  const resetForm = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.reset(defaultValues as any);
    localStorage.removeItem(draftKey);
  }, [form, defaultValues, draftKey]);

  const validateField = useCallback(async (fieldName: keyof T): Promise<boolean> => {
    const result = await form.trigger(fieldName as Path<T>);
    return result;
  }, [form]);

  const validateAllFields = useCallback(async (): Promise<boolean> => {
    const result = await form.trigger();
    return result;
  }, [form]);

  const getFieldError = useCallback((fieldName: keyof T): string | undefined => {
    const fieldError = form.formState.errors[fieldName as string];
    return fieldError?.message as string | undefined;
  }, [form.formState.errors]);

  const setFieldError = useCallback((fieldName: keyof T, error: string) => {
    form.setError(fieldName as Path<T>, { type: 'manual', message: error });
  }, [form]);

  const clearFieldError = useCallback((fieldName: keyof T) => {
    form.clearErrors(fieldName as Path<T>);
  }, [form]);

  const clearAllErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  const saveAsDraft = useCallback(() => {
    const data = form.getValues();
    localStorage.setItem(draftKey, JSON.stringify(data));
  }, [form, draftKey]);

  const loadFromDraft = useCallback(() => {
    const draftData = localStorage.getItem(draftKey);
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [form, draftKey]);

  return {
    ...(form as unknown as UseFormReturn<T>),
    state,
    submitWithValidation,
    resetForm,
    validateField,
    validateAllFields,
    getFieldError,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    saveAsDraft,
    loadFromDraft,
    autoSave,
    setAutoSave,
  };
}

export type FormReturn<T extends FieldValues> = UseFormWithValidationReturn<T>;

// Helper function to get field error
export function getFieldError(form: UseFormReturn<FieldValues>, fieldName: string): string | undefined {
  const fieldError = form.formState.errors[fieldName];
  return fieldError?.message as string | undefined;
}

// Helper function to check if field is touched
export function isFieldTouched(form: UseFormReturn<FieldValues>, fieldName: string): boolean {
  return !!form.formState.touchedFields[fieldName];
}

// Helper function to check if field is dirty
export function isFieldDirty(form: UseFormReturn<FieldValues>, fieldName: string): boolean {
  return !!form.formState.dirtyFields[fieldName];
}

// Advanced form state management hook
export function useFormPersistence<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string,
  options: {
    debounceMs?: number;
    autoSave?: boolean;
    clearOnSubmit?: boolean;
  } = {}
) {
  const { debounceMs = 1000, autoSave = true, clearOnSubmit = true } = options;
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const watchedValues = useWatch({ control: form.control });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const timer = setTimeout(() => {
      setIsSaving(true);
      try {
        localStorage.setItem(`form-${key}`, JSON.stringify(watchedValues));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save form data:', error);
      } finally {
        setIsSaving(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [watchedValues, key, debounceMs, autoSave]);

  const loadSavedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(`form-${key}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        return true;
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    }
    return false;
  }, [form, key]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(`form-${key}`);
    setLastSaved(null);
  }, [key]);

  const manualSave = useCallback(() => {
    setIsSaving(true);
    try {
      const data = form.getValues();
      localStorage.setItem(`form-${key}`, JSON.stringify(data));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save form data:', error);
    } finally {
      setIsSaving(false);
    }
  }, [form, key]);

  // Clear on successful submit
  useEffect(() => {
    if (clearOnSubmit && form.formState.isSubmitSuccessful) {
      clearSavedData();
    }
  }, [form.formState.isSubmitSuccessful, clearOnSubmit, clearSavedData]);

  return {
    isSaving,
    lastSaved,
    loadSavedData,
    clearSavedData,
    manualSave,
  };
}

// Hook for multi-step forms
export function useMultiStepForm<T extends FieldValues>(
  steps: Array<{
    name: string;
    schema: z.ZodSchema<unknown>;
    fields: (keyof T)[];
  }>,
  options: UseFormWithValidationOptions<T>
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const form = useFormWithValidation<T>(options);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  }, [steps.length]);

  const nextStep = useCallback(async () => {
    const currentStepData = steps[currentStep];
    const fieldsToValidate = currentStepData.fields;
    
    // Validate current step fields
    const isValid = await form.trigger(fieldsToValidate as Path<T>[]);
    
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
      return true;
    }
    return false;
  }, [currentStep, steps, form]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToFirstIncompleteStep = useCallback(() => {
    for (let i = 0; i < steps.length; i++) {
      if (!completedSteps.has(i)) {
        setCurrentStep(i);
        return;
      }
    }
  }, [steps.length, completedSteps]);

  const isStepCompleted = useCallback((stepIndex: number) => {
    return completedSteps.has(stepIndex);
  }, [completedSteps]);

  const canGoToStep = useCallback((stepIndex: number) => {
    // Can go to current step, previous steps, or next step if current is completed
    return stepIndex <= currentStep || 
           (stepIndex === currentStep + 1 && completedSteps.has(currentStep));
  }, [currentStep, completedSteps]);

  const isFormComplete = completedSteps.size === steps.length;

  const currentStepData = steps[currentStep];
  const progress = ((completedSteps.size) / steps.length) * 100;

  return {
    ...form,
    currentStep,
    currentStepData,
    steps,
    completedSteps: Array.from(completedSteps),
    progress,
    isFormComplete,
    goToStep,
    nextStep,
    previousStep,
    goToFirstIncompleteStep,
    isStepCompleted,
    canGoToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };
}
