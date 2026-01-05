import { cn } from '@/lib/utils'

interface SkeletonProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

function Skeleton({ 
  className, 
  variant = 'default',
  animation = 'pulse',
  ...props 
}: SkeletonProps) {
  const baseClasses = 'bg-muted';
  
  const variantClasses = {
    default: 'rounded-md',
    text: 'rounded-sm h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  return (
    <div
      data-slot="skeleton"
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      role="status"
      aria-label="Loading content"
      {...props}
    />
  )
}

// Utility skeleton components
function SkeletonText({ 
  lines = 1, 
  className,
  ...props 
}: { lines?: number } & React.ComponentProps<'div'>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton 
          key={i} 
          variant="text" 
          className={cn(
            "w-full",
            i === lines - 1 && lines > 1 && "w-3/4" // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({ 
  size = 'md',
  className,
  ...props 
}: { size?: 'sm' | 'md' | 'lg' } & React.ComponentProps<'div'>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  return (
    <Skeleton 
      variant="circular"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
}

function SkeletonButton({ 
  size = 'md',
  className,
  ...props 
}: { size?: 'sm' | 'md' | 'lg' } & React.ComponentProps<'div'>) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  };

  return (
    <Skeleton 
      className={cn('rounded-md', sizeClasses[size], className)}
      {...props}
    />
  );
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton }
