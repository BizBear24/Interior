import { forwardRef } from 'react';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children, className, variant = 'default', size = 'md', loading, leftIcon, disabled, ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
        variant === 'default' && '[background:var(--gold)] [color:var(--brown-dark)] hover:[background:var(--gold-dark)] hover:text-white shadow-sm',
        variant === 'secondary' && '[background:var(--cream-dark)] [color:var(--brown-mid)] hover:[background:#DDD3C2]',
        variant === 'outline' && 'border [border-color:var(--gold)] bg-white [color:var(--brown-mid)] hover:[background:var(--cream)]',
        variant === 'ghost' && '[color:var(--brown-mid)] hover:[background:var(--cream-dark)]',
        variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700',
        variant === 'link' && '[color:var(--gold-dark)] hover:underline p-0',
        size === 'sm' && 'text-xs px-3 py-1.5 gap-1.5',
        size === 'md' && 'text-sm px-4 py-2 gap-2',
        size === 'lg' && 'text-base px-5 py-2.5 gap-2',
        size === 'icon' && 'p-2',
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
