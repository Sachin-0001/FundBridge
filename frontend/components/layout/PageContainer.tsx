import { ReactNode } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function PageContainer({ children, title, description }: PageContainerProps) {
  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 flex flex-col gap-8 min-h-[calc(100vh-4rem)]">
      {(title || description) && (
        <AnimatedSection>
          <div className="space-y-2">
            {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
            {description && <p className="text-muted-foreground text-lg">{description}</p>}
          </div>
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.1}>
        {children}
      </AnimatedSection>
    </div>
  );
}
