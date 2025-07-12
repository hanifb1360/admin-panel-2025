import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const urlRegex = /^https?:\/\/.+/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// Custom validation functions
const isValidAge = (dateString: string) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 13; // Minimum age requirement
  }
  return age >= 13;
};

const isValidZipCode = (zipCode: string, country: string) => {
  const zipPatterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  };
  
  const pattern = zipPatterns[country];
  return pattern ? pattern.test(zipCode) : true; // Allow any format for unknown countries
};

// Enhanced User form validation schema
export const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'),
  role: z.enum(['admin', 'user', 'moderator', 'guest'], {
    message: 'Please select a valid role',
  }),
  isActive: z.boolean().default(true),
  phone: z.string().optional().refine(
    (val) => !val || phoneRegex.test(val),
    'Please enter a valid phone number (e.g., +1234567890)'
  ),
  department: z.string().optional(),
  dateOfBirth: z.string().optional().refine(
    (val) => !val || (new Date(val) < new Date() && isValidAge(val)),
    'Please enter a valid date of birth (must be at least 13 years old)'
  ),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional().refine(
    (address) => {
      if (!address?.zipCode || !address?.country) return true;
      return isValidZipCode(address.zipCode, address.country);
    },
    { message: 'Please enter a valid ZIP code for the selected country' }
  ),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional().refine(
    (val) => !val || val.length <= 500,
    'Bio must be less than 500 characters'
  ),
  website: z.string().optional().refine(
    (val) => !val || urlRegex.test(val),
    'Please enter a valid website URL'
  ),
  linkedinProfile: z.string().optional().refine(
    (val) => !val || val.includes('linkedin.com'),
    'Please enter a valid LinkedIn profile URL'
  ),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional().refine(
      (val) => !val || phoneRegex.test(val),
      'Please enter a valid emergency contact phone number'
    ),
    relationship: z.string().optional(),
  }).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('en'),
    timezone: z.string().default('UTC'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false),
      sms: z.boolean().default(false),
    }).default({
      email: true,
      push: false,
      sms: false,
    }),
  }).optional(),
});

// Settings form validation schema
export const settingsFormSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().optional(),
  adminEmail: z.string().email('Please enter a valid email address'),
  maintenanceMode: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    sms: z.boolean().default(false),
  }),
  security: z.object({
    twoFactorAuth: z.boolean().default(false),
    sessionTimeout: z.number().min(5).max(1440).default(30),
    passwordPolicy: z.object({
      minLength: z.number().min(6).max(50).default(8),
      requireUppercase: z.boolean().default(true),
      requireNumbers: z.boolean().default(true),
      requireSymbols: z.boolean().default(false),
    }),
  }),
});

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.enum(['general', 'technical', 'billing', 'feedback']).default('general'),
  attachments: z.array(z.instanceof(File)).optional(),
});

// Product form validation schema
export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  status: z.enum(['active', 'inactive', 'discontinued']).default('active'),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  discount: z.object({
    type: z.enum(['percentage', 'fixed']).optional(),
    value: z.number().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
});

// Login form validation schema
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

// Register form validation schema
export const registerFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(strongPasswordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Advanced Profile form validation schema
export const profileFormSchema = z.object({
  id: z.string().optional(),
  personal: z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
    middleName: z.string().optional(),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().refine(val => phoneRegex.test(val), 'Please enter a valid phone number'),
    dateOfBirth: z.string().refine(val => isValidAge(val), 'You must be at least 13 years old'),
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    nationality: z.string().optional(),
    profileImage: z.string().optional(),
  }),
  
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    zipCode: z.string().min(1, 'ZIP/Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }).refine(
    (address) => isValidZipCode(address.zipCode, address.country),
    { message: 'Please enter a valid ZIP code for the selected country' }
  ),
  
  professional: z.object({
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    department: z.string().optional(),
    experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience seems too high'),
    salary: z.number().positive('Salary must be positive').optional(),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    certifications: z.array(z.string()).optional(),
    languages: z.array(z.object({
      language: z.string(),
      proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native']),
    })).optional(),
    linkedinProfile: z.string().optional().refine(
      (val) => !val || val.includes('linkedin.com'),
      'Please enter a valid LinkedIn profile URL'
    ),
    portfolio: z.string().optional().refine(
      (val) => !val || urlRegex.test(val),
      'Please enter a valid portfolio URL'
    ),
  }),
  
  emergency: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z.string().refine(val => phoneRegex.test(val), 'Please enter a valid phone number'),
    relationship: z.string().min(1, 'Relationship is required'),
    address: z.string().optional(),
  }),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    language: z.string().default('en'),
    timezone: z.string().default('UTC'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false),
      sms: z.boolean().default(false),
      marketing: z.boolean().default(false),
    }),
    privacy: z.object({
      profileVisible: z.boolean().default(true),
      showEmail: z.boolean().default(false),
      showPhone: z.boolean().default(false),
    }),
  }),
});

// Dynamic Form Schema Generator
export const createDynamicFormSchema = (fields: Array<{
  name: string;
  type: 'text' | 'email' | 'number' | 'boolean' | 'select' | 'date' | 'tel' | 'url';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  options?: string[];
}>) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  fields.forEach(field => {
    let schema: z.ZodTypeAny;
    
    switch (field.type) {
      case 'text':
        schema = z.string();
        if (field.required) schema = (schema as z.ZodString).min(1, `${field.name} is required`);
        if (field.minLength) schema = (schema as z.ZodString).min(field.minLength, `${field.name} must be at least ${field.minLength} characters`);
        if (field.maxLength) schema = (schema as z.ZodString).max(field.maxLength, `${field.name} must be less than ${field.maxLength} characters`);
        if (field.pattern) schema = (schema as z.ZodString).regex(field.pattern, `${field.name} format is invalid`);
        break;
        
      case 'email':
        schema = z.string().email(`Please enter a valid email address`);
        if (field.required) schema = (schema as z.ZodString).min(1, `${field.name} is required`);
        break;
        
      case 'number':
        schema = z.number();
        if (field.min !== undefined) schema = (schema as z.ZodNumber).min(field.min, `${field.name} must be at least ${field.min}`);
        if (field.max !== undefined) schema = (schema as z.ZodNumber).max(field.max, `${field.name} must be at most ${field.max}`);
        break;
        
      case 'boolean':
        schema = z.boolean();
        if (field.required) schema = (schema as z.ZodBoolean).refine(val => val === true, `${field.name} is required`);
        break;
        
      case 'select':
        if (field.options) {
          schema = z.enum(field.options as [string, ...string[]], {
            message: `Please select a valid ${field.name}`,
          });
        } else {
          schema = z.string();
        }
        if (field.required && !field.options) schema = (schema as z.ZodString).min(1, `${field.name} is required`);
        break;
        
      case 'date':
        schema = z.string().refine(val => !isNaN(Date.parse(val)), `Please enter a valid date`);
        if (field.required) schema = (schema as z.ZodString).min(1, `${field.name} is required`);
        break;
        
      case 'tel':
        schema = z.string().refine(val => phoneRegex.test(val), `Please enter a valid phone number`);
        if (field.required) schema = (schema as z.ZodString).min(1, `${field.name} is required`);
        break;
        
      case 'url':
        schema = z.string().refine(val => urlRegex.test(val), `Please enter a valid URL`);
        if (field.required) schema = (schema as z.ZodString).min(1, `${field.name} is required`);
        break;
        
      default:
        schema = z.string();
    }
    
    if (!field.required && field.type !== 'boolean') {
      schema = schema.optional();
    }
    
    schemaFields[field.name] = schema;
  });
  
  return z.object(schemaFields);
};

// Multi-step form validation schema
export const multiStepFormSchema = z.object({
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

// Type exports
export type UserFormData = z.infer<typeof userFormSchema>;
export type SettingsFormData = z.infer<typeof settingsFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type MultiStepFormData = z.infer<typeof multiStepFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Advanced validation utility functions
export const validatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Password should contain lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Password should contain uppercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Password should contain numbers');
  
  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Password should contain special characters');
  
  if (password.length >= 12) score += 1;
  
  return { score, feedback };
};

export const validateFileUpload = (file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
}): { isValid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [] } = options;
  
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }
  
  return { isValid: true };
};

export const validateCreditCard = (cardNumber: string): {
  isValid: boolean;
  type?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
} => {
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  if (!/^\d+$/.test(cleanNumber)) {
    return { isValid: false };
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  const isValid = sum % 10 === 0;
  
  if (!isValid) {
    return { isValid: false };
  }
  
  // Determine card type
  let type: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' = 'unknown';
  
  if (/^4/.test(cleanNumber)) {
    type = 'visa';
  } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    type = 'mastercard';
  } else if (/^3[47]/.test(cleanNumber)) {
    type = 'amex';
  } else if (/^6(?:011|5)/.test(cleanNumber)) {
    type = 'discover';
  }
  
  return { isValid: true, type };
};

export const validateSSN = (ssn: string): boolean => {
  const cleanSSN = ssn.replace(/\D/g, '');
  
  if (cleanSSN.length !== 9) return false;
  
  // Check for invalid patterns
  const invalidPatterns = [
    '000000000',
    '123456789',
    '111111111',
    '222222222',
    '333333333',
    '444444444',
    '555555555',
    '666666666',
    '777777777',
    '888888888',
    '999999999'
  ];
  
  return !invalidPatterns.includes(cleanSSN) && 
         !cleanSSN.startsWith('000') && 
         !cleanSSN.startsWith('666') && 
         !cleanSSN.startsWith('9');
};
