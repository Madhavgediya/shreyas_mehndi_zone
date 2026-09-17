import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DesignCard from './DesignCard';

export const DesignGrid = ({ designs = [], onQuickView }) => {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7"
    >
      <AnimatePresence>
        {designs.map((design) => (
          <DesignCard
            key={design._id || design.slug}
            design={design}
            onQuickView={onQuickView}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default DesignGrid;
