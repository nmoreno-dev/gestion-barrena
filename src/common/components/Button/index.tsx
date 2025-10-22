import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from 'classnames';

const buttonVariants = cva('btn', {
  variants: {
    bgColor: {
      default: '',
      neutral: 'btn-neutral',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      info: 'btn-info',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-error',
    },
    variant: {
      default: '',
      outline: 'btn-outline',
      dash: 'btn-dash',
      soft: 'btn-soft',
      ghost: 'btn-ghost',
      link: 'btn-link',
    },
    size: {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
      xl: 'btn-xl',
    },
    shape: {
      default: '',
      square: 'btn-square',
      circle: 'btn-circle',
    },
    wide: {
      true: 'btn-wide',
    },
    block: {
      true: 'btn-block flex-1',
    },
    active: {
      true: 'btn-active',
    },
  },
  defaultVariants: {
    bgColor: 'default',
    variant: 'default',
    size: 'md',
    shape: 'default',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: string;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  bgColor,
  size,
  shape,
  wide,
  block,
  active,
  loading,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'btn basis-0',
        buttonVariants({ bgColor, size, shape, wide, block, active }),
        { ['btn-disabled']: disabled },
        className,
      )}
      {...props}
    >
      {loading && <span className="loading loading-spinner" />}
      {!loading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
