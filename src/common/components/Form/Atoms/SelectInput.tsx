import React, { SelectHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'classnames';
import { useFieldContext } from '@/common/hooks';

/* -------------------------------------------------------------------------- */
/*                           Daisy‑UI Select Styles                           */
/* -------------------------------------------------------------------------- */

// Base DaisyUI class is `select`. We extend it with variants in the same
// spirit as the TextField component so you can compose colours, sizes & shapes
// freely. Any new DaisyUI theme tokens you add to your project will "just work"
// by extending the `intent` map below.
const selectStyles = cva(
  'select w-full transition-colors focus:outline-none focus:ring-2 text-lg block',
  {
    variants: {
      /* ------------------------------------------------ Colors / Intent */
      intent: {
        primary: 'select-primary focus:ring-primary',
        secondary: 'select-secondary focus:ring-secondary',
        accent: 'select-accent focus:ring-accent',
        neutral: 'select-neutral focus:ring-neutral',
        info: 'select-info focus:ring-info',
        success: 'select-success focus:ring-success',
        warning: 'select-warning focus:ring-warning',
        error: 'select-error focus:ring-error',
      },
      /* ------------------------------------------------ Ghost style */
      ghost: {
        true: 'select-ghost',
        false: '',
      },
      /* ------------------------------------------------ Sizes */
      size: {
        xs: 'select-xs',
        sm: 'select-sm',
        md: 'select-md',
        lg: 'select-lg',
        xl: 'select-xl',
      },
      /* ------------------------------------------------ Shapes */
      shape: {
        rounded: 'rounded-lg',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
      /* ------------------------------------------------ Conditional paddings when prefix/suffix icons exist */
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
      ghost: false,
      size: 'md',
      shape: 'rounded',
      hasPrefix: false,
      hasSuffix: false,
    },
  },
);

/* -------------------------------------------------------------------------- */
/*                                 Typings                                    */
/* -------------------------------------------------------------------------- */

export interface SelectFieldOption {
  /** Visible label in the dropdown */
  label: React.ReactNode;
  /** `value` attribute of the option */
  value: string | number;
  /** Optional disabled flag for this option */
  disabled?: boolean;
}

export interface SelectFieldProps
  extends Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      // We override value/onChange/onBlur to drive them from our field context
      'value' | 'onChange' | 'onBlur' | 'prefix' | 'size'
    >,
    VariantProps<typeof selectStyles> {
  /** Top label shown above the select box */
  label: string;
  /** Helper text shown under the field */
  description?: string;
  /** Optional icon / element to the left (inside) */
  prefix?: React.ReactNode;
  /** Optional icon / element to the right (inside) */
  suffix?: React.ReactNode;
  /** Provide options as a plain array instead of JSX children */
  options?: SelectFieldOption[];
  /** Placeholder option (disabled). If not provided no placeholder is rendered */
  placeholder?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                             SelectField component                           */
/* -------------------------------------------------------------------------- */

export default function SelectField({
  label,
  description,
  prefix,
  suffix,
  id,
  intent,
  ghost,
  size,
  shape,
  className = '',
  options,
  placeholder = 'Seleccione una opción',
  children,
  ...props
}: SelectFieldProps) {
  // Hook de contexto para integrarse con la librería de formularios que uses.
  // Tipado genérico: string | number para permitir IDs numéricos sin coerción.
  const field = useFieldContext<string | number>();
  const selectId = id ?? field.name;
  const errorId = `${selectId}-error`;
  const showError = !field.state.meta.isValid && field.state.meta.isTouched;

  return (
    <fieldset className={clsx('form-control my-0.5', className)}>
      {/* ------------- Label ------------- */}
      <label htmlFor={selectId} className="label">
        <span className="label-text font-semibold text-base-content text-xl mb-1">{label}</span>
      </label>

      {/* ------------- Select wrapper (for prefix / suffix) ------------- */}
      <div className="relative w-full">
        {prefix && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {prefix}
          </span>
        )}

        <select
          id={selectId}
          className={selectStyles({
            intent,
            ghost,
            size,
            shape,
            hasPrefix: Boolean(prefix),
            hasSuffix: Boolean(suffix),
            class: showError ? 'select-error' : '',
          })}
          value={field.state.value}
          onChange={e => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : props['aria-describedby']}
          {...props}
        >
          {/* Optional placeholder as first disabled option */}
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}

          {/* If consumer passes an options array, prefer it. Fallback to JSX children */}
          {options
            ? options.map(({ label, value, disabled }) => (
                <option key={value} value={value} disabled={disabled}>
                  {label}
                </option>
              ))
            : children}
        </select>

        {suffix && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {/* ------------- Helper / description ------------- */}
      {description && (
        <label className="label">
          <span className="label-text-alt text-gray-500">{description}</span>
        </label>
      )}

      {/* ------------- Error message ------------- */}
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
