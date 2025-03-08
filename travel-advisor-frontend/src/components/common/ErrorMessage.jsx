// src/components/common/ErrorMessage.jsx
import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function ErrorMessage({ 
  error, 
  onRetry = null, 
  title = 'Error', 
  severity = 'error' 
}) {
  // Get a user-friendly error message
  const errorMessage = error?.message || 'An unexpected error occurred';
  
  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity={severity}
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small"
              onClick={onRetry}
            >
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
}

export default ErrorMessage;