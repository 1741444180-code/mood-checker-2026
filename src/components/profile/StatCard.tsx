'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color = '#7c3aed' }: StatCardProps) {
  return (
    <Box className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6">
      <Box className="flex items-center justify-between mb-2 sm:mb-4">
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} className="text-gray-500">
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }} className="font-bold" style={{ color }}>
        {value}
      </Typography>
    </Box>
  );
}
