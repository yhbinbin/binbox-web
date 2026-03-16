import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, Info, CheckCircle2, AlertTriangle, Construction } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-12",
  {
    variants: {
      variant: {
        default: "border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)]",
        info: "border-[var(--info)]/30 bg-[var(--info)]/10 text-[var(--text-primary)] [&>svg]:text-[var(--info)]",
        success: "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--text-primary)] [&>svg]:text-[var(--success)]",
        warning: "border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--text-primary)] [&>svg]:text-[var(--warning)]",
        destructive: "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--text-primary)] [&>svg]:text-[var(--destructive)]",
        wip: "border-[var(--accent-quaternary)]/30 bg-[var(--accent-quaternary)]/10 text-[var(--text-primary)] [&>svg]:text-[var(--accent-quaternary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
  wip: Construction,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", showIcon = true, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <Icon className="h-5 w-5" />}
        {children}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
