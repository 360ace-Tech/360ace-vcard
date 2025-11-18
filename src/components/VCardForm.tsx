'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Mail, Phone, Smartphone, Globe, FileText, Check, AlertCircle } from 'lucide-react';
import { VCardData } from '@/lib/types';

interface VCardFormProps {
  onSubmit: (data: VCardData) => void;
  isLoading?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function VCardForm({ onSubmit, isLoading }: VCardFormProps) {
  const [formData, setFormData] = useState<VCardData>({
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    note: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (field: keyof VCardData, value: string): string => {
    switch (field) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'phone':
      case 'mobile':
        if (value && !/^[\d\s\+\-\(\)]+$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        break;
      case 'website':
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Website must start with http:// or https://';
        }
        break;
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return 'This field is required';
        }
        break;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof VCardData>).forEach((key) => {
      const error = validateField(key, formData[key] as string);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof VCardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof VCardData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field] as string);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    field,
    type = 'text',
    placeholder,
    required = false,
    autoComplete,
  }: {
    icon: any;
    label: string;
    field: keyof VCardData;
    type?: string;
    placeholder: string;
    required?: boolean;
    autoComplete?: string;
  }) => {
    const hasError = touched[field] && errors[field];
    const isValid = touched[field] && !errors[field] && formData[field];

    return (
      <div className="group">
        <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-white/90">
          <Icon size={16} className="text-white/70" />
          {label} {required && <span className="text-red-300">*</span>}
        </label>
        <div className="relative">
          <input
            type={type}
            required={required}
            value={formData[field] as string}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            autoComplete={autoComplete}
            className={`
              w-full px-4 py-3 rounded-xl text-white
              input-modern
              ${hasError ? 'border-red-400/60 focus:border-red-400' : ''}
              ${isValid ? 'border-green-400/60' : ''}
            `}
            placeholder={placeholder}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${field}-error` : undefined}
          />
          {isValid && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Check size={20} className="text-green-400" />
            </motion.div>
          )}
        </div>
        <AnimatePresence>
          {hasError && (
            <motion.div
              id={`${field}-error`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1 mt-1.5 text-sm text-red-300"
              role="alert"
            >
              <AlertCircle size={14} />
              <span>{errors[field]}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5 w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-strong rounded-2xl p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            icon={User}
            label="First Name"
            field="firstName"
            placeholder="John"
            required
            autoComplete="given-name"
          />

          <InputField
            icon={User}
            label="Last Name"
            field="lastName"
            placeholder="Doe"
            required
            autoComplete="family-name"
          />

          <InputField
            icon={Briefcase}
            label="Organization"
            field="organization"
            placeholder="360Ace Inc."
            autoComplete="organization"
          />

          <InputField
            icon={Briefcase}
            label="Job Title"
            field="title"
            placeholder="CEO"
            autoComplete="organization-title"
          />

          <InputField
            icon={Mail}
            label="Email"
            field="email"
            type="email"
            placeholder="john@360ace.com"
            autoComplete="email"
          />

          <InputField
            icon={Phone}
            label="Phone"
            field="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
          />

          <InputField
            icon={Smartphone}
            label="Mobile"
            field="mobile"
            type="tel"
            placeholder="+1 (555) 987-6543"
            autoComplete="tel"
          />

          <InputField
            icon={Globe}
            label="Website"
            field="website"
            type="url"
            placeholder="https://360ace.com"
            autoComplete="url"
          />
        </div>

        {/* Note Field */}
        <div className="group">
          <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-white/90">
            <FileText size={16} className="text-white/70" />
            Note
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl input-modern text-white resize-none"
            placeholder="Additional information..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-white text-blue-600 font-semibold rounded-xl hover:bg-opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl relative overflow-hidden group"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="spinner w-5 h-5"></div>
              Generating...
            </>
          ) : (
            'Generate VCard & QR Code'
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </motion.button>
    </motion.form>
  );
}
