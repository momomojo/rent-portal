import React, { useState, useEffect, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { trackComponentLoad } from '@core/monitoring/metrics';

interface ImageDimensions {
  width: number;
  height: number;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}) => {
  const [loading, setLoading] = useState(!priority);
  const [error, setError] = useState<Error | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const loadStartTime = useRef<number>(0);

  // Generate blur placeholder
  const blurPlaceholder = blurDataURL || `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

  useEffect(() => {
    loadStartTime.current = performance.now();

    const loadImage = async () => {
      try {
        let finalSrc = src;
        let finalDimensions: ImageDimensions | null = null;

        if (src.startsWith('data:')) {
          setImageSrc(src);
        } else if (src.includes('firebasestorage.googleapis.com')) {
          const storage = getStorage();
          const imageRef = ref(storage, src);
          finalSrc = await getDownloadURL(imageRef);
        } else {
          // Load image to get dimensions
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              finalDimensions = {
                width: img.naturalWidth,
                height: img.naturalHeight
              };
              resolve(null);
            };
            img.onerror = reject;
            img.src = src;
          });
        }

        setImageSrc(finalSrc);
        if (finalDimensions) {
          setDimensions(finalDimensions);
        }
        setLoading(false);
        
        // Track performance
        const loadTime = performance.now() - loadStartTime.current;
        trackComponentLoad('OptimizedImage', loadTime);
        
        onLoad?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load image');
        console.error('Error loading image:', error);
        setError(error);
        setLoading(false);
        onError?.(error);
      }
    };

    loadImage();
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  if (error) {
    return (
      <div 
        className={`bg-gray-200 ${className}`}
        role="img"
        aria-label={`Error loading image: ${alt}`}
      >
        <svg className="w-full h-full text-gray-400" viewBox="0 0 24 24">
          <path 
            fill="currentColor" 
            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
          />
        </svg>
      </div>
    );
  }

  const imageProps = {
    ref: imgRef,
    src: priority ? imageSrc : undefined,
    'data-src': !priority ? imageSrc : undefined,
    alt,
    className: `
      ${className}
      ${loading ? 'blur-up scale-110' : 'scale-100'}
      transition-all duration-300 ease-in-out
    `.trim(),
    loading: priority ? 'eager' : 'lazy',
    onLoad: () => setLoading(false),
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const error = new Error('Image failed to load');
      setError(error);
      onError?.(error);
    },
    style: loading
      ? { filter: 'blur(20px)', backgroundSize: '400% 100%' }
      : undefined,
    ...(dimensions && {
      width: dimensions.width,
      height: dimensions.height,
    })
  };

  if (!imageSrc.includes('firebasestorage.googleapis.com') && dimensions) {
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={`${src}?w=640&format=webp&q=${quality} 640w,
                  ${src}?w=960&format=webp&q=${quality} 960w,
                  ${src}?w=1280&format=webp&q=${quality} 1280w`}
          sizes={sizes}
        />
        <source
          type="image/jpeg"
          srcSet={`${src}?w=640&q=${quality} 640w,
                  ${src}?w=960&q=${quality} 960w,
                  ${src}?w=1280&q=${quality} 1280w`}
          sizes={sizes}
        />
        <img
          {...imageProps}
          style={{
            ...imageProps.style,
            backgroundImage: loading ? `url(${blurPlaceholder})` : 'none'
          }}
        />
      </picture>
    );
  }

  return (
    <img
      {...imageProps}
      style={{
        ...imageProps.style,
        backgroundImage: loading ? `url(${blurPlaceholder})` : 'none'
      }}
    />
  );
};
