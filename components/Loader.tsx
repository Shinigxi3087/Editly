"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-3 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md px-6 py-4 shadow-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 1.2,
          }}
        >
          <Image
            src="/assets/icons/loader.svg"
            alt="Loading"
            width={32}
            height={32}
            priority
            className="drop-shadow-sm"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-300"
        >
          Loading...
        </motion.span>
      </motion.div>
    </div>
  );
};

export default Loader;
