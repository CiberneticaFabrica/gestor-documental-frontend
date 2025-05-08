import React from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
}

export function LazyImage({ src, alt, placeholder = '/placeholder.png', className, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={placeholder}
        alt=""
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        {...props}
      />
    </div>
  );
}

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItems + overscan * 2
  );

  const handleScroll = React.useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div
        style={{
          height: items.length * itemHeight,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: startIndex * itemHeight,
            left: 0,
            right: 0,
          }}
        >
          {items.slice(startIndex, endIndex + 1).map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DeferredRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
}

export function DeferredRender({
  children,
  fallback = null,
  timeout = 0,
}: DeferredRenderProps) {
  const [isDeferred, setIsDeferred] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsDeferred(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (isDeferred) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 