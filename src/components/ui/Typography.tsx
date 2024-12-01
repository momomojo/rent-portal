import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      subtitle1: 'text-xl text-muted-foreground',
      subtitle2: 'text-lg text-muted-foreground',
      body1: 'text-base leading-7',
      body2: 'text-sm leading-6',
      caption: 'text-sm text-muted-foreground',
      overline: 'text-xs uppercase tracking-wide',
    },
    align: {
      inherit: '',
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    weight: {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-green-600 dark:text-green-500',
      error: 'text-red-600 dark:text-red-500',
      warning: 'text-yellow-600 dark:text-yellow-500',
      info: 'text-blue-600 dark:text-blue-500',
    },
  },
  defaultVariants: {
    variant: 'body1',
    align: 'inherit',
    weight: 'regular',
    color: 'default',
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {
  component?: React.ElementType;
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
}

export const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({
    className,
    variant,
    align,
    weight,
    color,
    component,
    gutterBottom,
    noWrap,
    paragraph,
    ...props
  }, ref) => {
    const Component = component || (variant?.startsWith('h') ? variant : 'p');

    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({ variant, align, weight, color }),
          gutterBottom && 'mb-4',
          noWrap && 'truncate',
          paragraph && 'mb-4',
          className
        )}
        {...props}
      />
    );
  }
);

Typography.displayName = 'Typography';
