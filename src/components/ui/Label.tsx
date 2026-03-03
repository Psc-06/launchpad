import { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export const Label = ({ className, children, ...props }: LabelProps) => {
  return (
    <label
      className={cn(
        "text-sm font-medium text-gray-900 dark:text-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};
