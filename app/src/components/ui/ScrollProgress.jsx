import React from "react";
import { motion, useScroll, useSpring } from "motion/react";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary z-[9999] origin-[0%]"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;
