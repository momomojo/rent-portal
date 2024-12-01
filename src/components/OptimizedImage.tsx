import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallback = '/placeholder.png',
  sizes = '100vw',
  quality = 75,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px 0px',
  });

  const [currentSrc, setCurrentSrc] = useState<string>(
    inView ? src : fallback
  );

  useEffect(() => {
    if (inView && currentSrc === fallback) {
      setCurrentSrc(src);
    }
  }, [inView, src, fallback, currentSrc]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
    setCurrentSrc(fallback);
  };

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(width => {
        const imageUrl = new URL(src, window.location.href);
        imageUrl.searchParams.set('w', width.toString());
        imageUrl.searchParams.set('q', quality.toString());
        return `${imageUrl.toString()} ${width}w`;
      })
      .join(', ');
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${
        loading ? 'animate-pulse bg-gray-200' : ''
      } ${className || ''}`}
    >
      {inView && (
        <img
          src={currentSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          srcSet={!error ? generateSrcSet() : undefined}
          {...props}
        />
      )}
    </div>
  );
};