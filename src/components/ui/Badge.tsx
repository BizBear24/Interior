import { cn } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'default' && 'bg-primary/10 text-primary',
      variant === 'secondary' && 'bg-gray-100 text-gray-700',
      variant === 'outline' && 'border border-gray-200 text-gray-700',
      variant === 'destructive' && 'bg-red-50 text-red-700',
      className,
    )}>
      {children}
    </span>
  );
}
