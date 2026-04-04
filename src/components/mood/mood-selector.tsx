'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface MoodSelectorProps {
  onSubmit?: (data: { moodId: number; note?: string; tags?: string[] }) => void;
}

export default function MoodSelector({ onSubmit }: MoodSelectorProps) {
  return (
    <Box className="bg-white rounded-2xl shadow-lg p-6">
      <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-bold mb-3 sm:mb-4">
        心情选择器
      </Typography>
      <Box className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
        <Typography className="text-gray-400">
          心情选择器开发中...
        </Typography>
      </Box>
    </Box>
  );
}
