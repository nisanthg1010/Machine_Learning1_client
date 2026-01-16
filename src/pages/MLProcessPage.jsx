import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, Paper } from '@mui/material';
import MLProcessWorkflow from '../components/ml-process/MLProcessWorkflow';
import MetricsGuide from '../components/ml-process/MetricsGuide';
import DetailedMLProcess from '../components/ml-process/DetailedMLProcess';
import { motion } from 'framer-motion';

const MLProcessPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          sx={{
            background: 'linear-gradient(160deg, rgba(155,107,255,0.1), rgba(255,79,183,0.05))',
            borderRadius: 3,
            border: '1px solid rgba(155,107,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              borderBottom: '1px solid rgba(155,107,255,0.2)',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': { color: '#9b6bff' }
              },
              '& .Mui-selected': {
                color: '#9b6bff !important'
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #9b6bff, #ff4fb7)'
              }
            }}
          >
            <Tab label="ML Process Workflow" />
            <Tab label="Metrics & Formulas" />
            <Tab label="Detailed ML Pipeline" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && <MLProcessWorkflow />}
            {activeTab === 1 && <MetricsGuide />}
            {activeTab === 2 && <DetailedMLProcess />}
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default MLProcessPage;
