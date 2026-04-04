'use client';

import React from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#7c3aed',
      },
      secondary: {
        main: '#ec4899',
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
