'use client';

import { Container, Box, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',              
        display: 'flex',
        alignItems: 'center',         
        justifyContent: 'center',    
      }}
    >
      <Box textAlign="center">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Task Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A Quick React(NextJS) / Nest JS application for managing tasks.
        </Typography>
        <Typography> Ali Altaraif, Lumaa Spring 2025 </Typography>
      </Box>
    </Container>
  );
}
