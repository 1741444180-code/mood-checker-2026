'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface MoodCalendarProps {
  data?: any[];
}

export default function MoodCalendar({ data = [] }: MoodCalendarProps) {
  return (
    <Box className="bg-white rounded-2xl shadow-lg p-6">
      <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-bold mb-3 sm:mb-4">
        心情日历
      </Typography>
      <Box className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <Typography className="text-gray-400">
          日历开发中...
        </Typography>
      </Box>
    </Box>
  );
}
