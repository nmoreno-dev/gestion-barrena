import { forwardRef } from 'react';

export interface ProgressProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  /**
   * The progress value. If not provided, progress will be indeterminate.
   */
  value?: number;
  /**
   * The maximum value of the progress.
   * @default 100
   */
  max?: number;
  /**
   * The color variant of the progress bar.
   * @default undefined
   */
  color?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  /**
   * Additional CSS classes to apply to the progress element.
   */
  className?: string;
}

/**
 * Progress component based on DaisyUI progress element.
 * Can be used to show the progress of a task or to show the passing of time.
 *
 * @example
 * ```tsx
 * // Basic progress
 * <Progress value={50} max={100} />
 *
 * // With color variant
 * <Progress value={75} max={100} color="primary" />
 *
 * // Indeterminate progress (without value)
 * <Progress />
 * ```
 */
export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  ({ value, max = 100, color, className, ...props }, ref) => {
    const colorClasses = {
      neutral: 'progress-neutral',
      primary: 'progress-primary',
      secondary: 'progress-secondary',
      accent: 'progress-accent',
      info: 'progress-info',
      success: 'progress-success',
      warning: 'progress-warning',
      error: 'progress-error',
    };

    const progressClasses = ['progress', color && colorClasses[color], className]
      .filter(Boolean)
      .join(' ');

    return <progress ref={ref} className={progressClasses} value={value} max={max} {...props} />;
  },
);

Progress.displayName = 'Progress';

export default Progress;
