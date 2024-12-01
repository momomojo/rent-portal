import React from 'react';

interface PictureProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Picture component that provides optimized responsive images with modern format support
 * @param src - Source path of the image (without extension)
 * @param alt - Alt text for accessibility
 * @param sizes - Sizes attribute for responsive images (default: '100vw')
 * @param className - Optional CSS class name
 * @param width - Optional width in pixels
 * @param height - Optional height in pixels
 * @param loading - Image loading strategy ('lazy' | 'eager')
 * @param priority - Whether this is a high-priority image
 * @param objectFit - CSS object-fit property
 */
export const Picture: React.FC<PictureProps> = ({
  src,
  alt,
  sizes = '100vw',
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  objectFit = 'cover',
}) => {
  // Common breakpoints from our optimization config
  const breakpoints = [640, 768, 1024, 1280];
  
  // Remove file extension if present
  const baseSrc = src.replace(/\.(jpg|jpeg|png|webp|avif)$/, '');
  
  // Common image attributes
  const imgAttributes: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: `${baseSrc}.jpg`, // JPEG fallback
    alt,
    className,
    width,
    height,
    loading: priority ? 'eager' : loading,
    style: { objectFit },
    decoding: 'async',
  };

  // Generate srcSet for each format
  const generateSrcSet = (format: string) => 
    breakpoints
      .map(w => `${baseSrc}-${w}.${format} ${w}w`)
      .join(', ');

  return (
    <picture>
      {/* AVIF format - Best compression, modern browsers */}
      <source
        type="image/avif"
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
      />
      
      {/* WebP format - Good compression, wide support */}
      <source
        type="image/webp"
        srcSet={generateSrcSet('webp')}
        sizes={sizes}
      />
      
      {/* JPEG fallback - Universal support */}
      <img {...imgAttributes} />
    </picture>
  );
};

export default Picture;
