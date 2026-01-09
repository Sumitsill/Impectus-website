import React from 'react';
import { cn } from '../../lib/utils';
import StarBorder from './StarBorder';

// Card Props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
    color?: string;
    speed?: string;
    className?: string;
    children?: React.ReactNode;
    backgroundColor?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, color = "cyan", speed = "6s", backgroundColor, ...props }, ref) => {
    return (
        <StarBorder
            as="div"
            className={cn(
                'w-full h-full cursor-default',
                className
            )}
            color={color}
            speed={speed}
            backgroundColor={backgroundColor || "bg-slate-900/90"}
            {...props}
        >
            <div
                ref={ref}
                className="h-full w-full bg-transparent p-[inherit]">
                <div className={cn("p-4", className?.includes('p-') ? className.split(' ').filter(c => c.startsWith('p-')).join(' ') : '')}>
                    {children}
                </div>
            </div>
        </StarBorder>
    );
});

Card.displayName = 'Card';
