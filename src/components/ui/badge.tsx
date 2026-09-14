import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border-transparent',
        secondary: 'bg-secondary text-secondary-foreground border-transparent',
        outline: 'text-foreground border-border',
        success: 'bg-emerald-500/10 text-emerald-600 border-transparent dark:text-emerald-400',
        destructive: 'bg-destructive/10 text-destructive border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
