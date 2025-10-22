import React, { InputHTMLAttributes } from 'react';
import { useFieldContext } from '@/hooks';
import { cva, type VariantProps } from 'class-variance-authority';

// Definimos variantes de estilo para el Input usando CVA
const inputStyles = cva(
  'input w-full transition-colors focus:outline-none focus:ring-2 text-lg block',
  {
    variants: {
      intent: {
        primary: 'input-primary focus:ring-primary',
        secondary: 'input-secondary focus:ring-secondary',
        accent: 'input-accent focus:ring-accent',
        neutral: 'input-neutral focus:ring-neutral',
        info: 'input-info focus:ring-info',
        success: 'input-success focus:ring-success',
        warning: 'input-warning focus:ring-warning',
        error: 'input-error focus:ring-error',
      },
      size: {
        xs: 'input-xs',
        sm: 'input-sm',
        md: 'input-md',
        lg: 'input-lg',
        xl: 'input-xl',
      },
      shape: {
        rounded: 'rounded-lg',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
      hasPrefix: {
        true: 'pl-10',
        false: '',
      },
      hasSuffix: {
        true: 'pr-10',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
      shape: 'rounded',
      hasPrefix: false,
      hasSuffix: false,
    },
  },
);

interface TextFieldProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'onChange' | 'onBlur' | 'prefix' | 'size'
    >,
    VariantProps<typeof inputStyles> {
  label: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export default function TextField({
  label,
  description,
  prefix,
  suffix,
  id,
  intent,
  size,
  shape,
  className = '',
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const inputId = id ?? field.name;
  const errorId = `${inputId}-error`;
  const showError = !field.state.meta.isValid && field.state.meta.isTouched;

  return (
    <fieldset className={`form-control my-0.5 ${className}`.trim()}>
      <label htmlFor={inputId} className="label">
        <span className="label-text font-semibold text-base-content text-xl mb-1">{label}</span>
      </label>

      <div className="relative w-full">
        {prefix && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">{prefix}</span>
        )}

        <input
          id={inputId}
          style={{ width: '100%' }}
          className={inputStyles({
            intent,
            size,
            shape,
            hasPrefix: Boolean(prefix),
            hasSuffix: Boolean(suffix),
            class: showError ? 'input-error' : '',
          })}
          value={field.state.value}
          onChange={e => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : props['aria-describedby']}
          {...props}
        />

        {suffix && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">{suffix}</span>
        )}
      </div>

      {description && (
        <label className="label">
          <span className="label-text-alt text-gray-500">{description}</span>
        </label>
      )}

      {showError && (
        <label className="label">
          <span id={errorId} role="alert" className="label-text-alt text-error">
            {field.state.meta.errors.join(', ')}
          </span>
        </label>
      )}
    </fieldset>
  );
}
