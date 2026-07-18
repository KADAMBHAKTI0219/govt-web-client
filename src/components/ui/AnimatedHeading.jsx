import React from "react";
import { motion } from "framer-motion";

export default function AnimatedHeading({ text, className }) {
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.h2
      className={className}
      variants={headingVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {text}
    </motion.h2>
  );
}
