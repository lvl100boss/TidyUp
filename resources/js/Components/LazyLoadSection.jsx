import React from 'react';
import { useInView } from 'react-intersection-observer';

const LazyLoadSection = ({ children, minHeight = '200px', threshold = 0.1, rootMargin = '100px 0px' }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Keep this so children mount only once
        threshold: threshold,
        rootMargin: rootMargin,
    });

    return (
        // This div detects intersection and reserves space
        <div ref={ref} style={{ minHeight: inView ? 'auto' : minHeight }}>
            {/* Render children directly when in view.
                The children's own motion.div will handle their animation. */}
            {inView ? children : null}
        </div>
    );
};

export default LazyLoadSection;