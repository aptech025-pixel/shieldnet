
"use client";

import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function Preloader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1, 1.1, 1],
            opacity: [1, 0.8, 1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <Shield className="h-16 w-16 text-primary" />
        </motion.div>
        <motion.h1 
            className="text-2xl font-bold font-headline text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            ShieldNet
        </motion.h1>
         <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            Securing your network...
        </motion.p>
      </motion.div>
    </div>
  );
}
