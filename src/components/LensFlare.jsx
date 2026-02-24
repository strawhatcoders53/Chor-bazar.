import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LensFlare = () => {
    const { scrollY } = useScroll();

    // Lens flare completely fades out within the first 500px of scroll
    const opacity = useTransform(scrollY, [0, 500], [0.8, 0]);
    // The flare moves slightly up as you scroll down
    const y = useTransform(scrollY, [0, 500], [0, -200]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] lens-flare pointer-events-none"
            style={{ opacity, y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }} // Initial fade in 
        />
    );
};

export default LensFlare;
