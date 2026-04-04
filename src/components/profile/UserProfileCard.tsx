'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface UserProfileCardProps {
  username?: string;
  email?: string;
  avatar?: string;
}

export default function UserProfileCard({ username = '用户', email = 'user@example.com', avatar }: UserProfileCardProps) {
  return (
    <Box className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <Box className="flex items-center justify-between mb-4">
        <Box className="flex items-center gap-3 sm:gap-4">
          <Avatar
            src={avatar}
            alt={username}
            className="w-12 h-12 sm:w-16 sm:h-16"
            sx={{ bgcolor: '#7c3aed', width: { xs: 48, sm: 64 }, height: { xs: 48, sm: 64 } }}
          >
            {username.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontSize: { xs: '0.95rem', sm: '1rem', md: '1.25rem' } }} className="font-bold">
              {username}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
