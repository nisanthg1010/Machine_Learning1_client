import React from 'react';
import ModelTrainingGuide from '../components/training/ModelTrainingGuide';
import { motion } from 'framer-motion';

const TrainingGuidePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ModelTrainingGuide />
    </motion.div>
  );
};

export default TrainingGuidePage;
