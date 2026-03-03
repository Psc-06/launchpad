import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ className, children, ...props }: CardHeaderProps) => {
  return (
    <div
      className={cn("border-b border-gray-200 px-6 py-4 dark:border-gray-800", className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardBody = ({ className, children, ...props }: CardBodyProps) => {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({ className, children, ...props }: CardFooterProps) => {
  return (
    <div
      className={cn(
        "border-t border-gray-200 px-6 py-4 dark:border-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const CardTitle = ({ className, children, ...props }: CardTitleProps) => {
  return (
    <h3
      className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const CardDescription = ({
  className,
  children,
  ...props
}: CardDescriptionProps) => {
  return (
    <p
      className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
      {...props}
    >
      {children}
    </p>
  );
};
