import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-semibold uppercase tracking-[0.12em] font-sans transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-ui active:scale-[0.98] motion-reduce:transform-none [@media(pointer:coarse)]:min-h-11 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none border focus-visible:border-white focus-visible:ring-1 focus-visible:ring-white",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-white hover:bg-black hover:text-white dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white",
        destructive:
          "bg-black text-white border-white/60 hover:bg-white hover:text-black hover:border-white",
        outline:
          "border-white/20 bg-transparent text-white hover:border-white hover:bg-white/10 dark:border-white/20 dark:hover:border-white dark:hover:bg-white/10",
        secondary:
          "bg-white/10 text-white border-white/15 hover:bg-white/20 hover:border-white/40",
        ghost:
          "border-transparent text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20",
        link: "border-transparent text-white underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 px-3 py-1.5 has-[>svg]:px-2.5 text-[11px]",
        lg: "h-11 px-6 py-2.5 has-[>svg]:px-4 text-xs tracking-[0.14em]",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        data-variant={variant}
        data-size={size}
        aria-busy={loading ? "true" : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export { Button, buttonVariants }
