import { cn } from '../../utils';

interface ProgressProps {
  value: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function Progress({ value, className, color, showLabel, size = 'sm' }: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor = color || (clampedValue >= 80 ? 'bg-green-500' : clampedValue >= 50 ? 'bg-blue-500' : clampedValue >= 25 ? 'bg-yellow-500' : 'bg-red-400');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-gray-100 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-600 min-w-[2.5rem] text-right">{clampedValue}%</span>}
    </div>
  );
}
