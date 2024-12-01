import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface ImageSize {
  width: number;
  quality: number;
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const DEFAULT_SIZES: ImageSize[] = [
  { width: 640, quality: 75 },
  { width: 750, quality: 75 },
  { width: 828, quality: 75 },
  { width: 1080, quality: 75 },
  { width: 1200, quality: 75 },
  { width: 1920, quality: 75 },
  { width: 2048, quality: 75 }
];

const generateSrcSet = (src: string, sizes: ImageSize[]): string => {
  return sizes
    .map(({ width, quality }) => {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', quality.toString());
      return `${url.toString()} ${width}w`;
    })
    .join(', ');
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    src, 
    alt, 
    sizes = '100vw', 
    className,
    priority = false,
    onLoad,
    placeholder = 'empty',
    blurDataURL,
    ...props 
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const { ref: inViewRef, inView } = useInView({
      triggerOnce: true,
      rootMargin: '50px 0px',
      skip: priority
    });

    const setRefs = React.useCallback(
      (node: HTMLImageElement | null) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        inViewRef(node);
      },
      [ref, inViewRef]
    );

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setError(true);
    };

    // Generate srcSet for responsive images
    const srcSet = generateSrcSet(src, DEFAULT_SIZES);

    return (
      <div className={cn('relative overflow-hidden', className)}>
        {placeholder === 'blur' && !isLoaded && (
          <div 
            className="absolute inset-0 blur-lg scale-110 transform"
            style={{
              backgroundImage: `url(${blurDataURL || src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        {(priority || inView) && (
          <img
            ref={setRefs}
            src={src}
            alt={alt}
            sizes={sizes}
            srcSet={srcSet}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            className={cn(
              'transition-opacity duration-300',
              !isLoaded && 'opacity-0',
              isLoaded && 'opacity-100'
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-500">Failed to load image</span>
          </div>
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';