'use client';
import { AppBar, Avatar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from './components/Loading';
import SignInButton from './components/SignInButton';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [userloading, setUserloading] = useState(false);
  const router = useRouter();

  // Loading state
  if (userloading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{
          background: 'rgba(0, 0, 0, 0.85)', // Dark background for loading state
          overflow: 'hidden',
          position: 'relative',
          zIndex: 9999,
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }} // Row on larger screens, column on small screens
      justifyContent="space-between"
      alignItems="center"
      style={{
        backgroundColor: '#ffffff', // Solid black background for the page
        overflow: 'hidden',
        position: 'relative',
        padding: '1rem', // Add padding for smaller devices
      }}
      color="black"
    >
      {/* Navigation Bar */}
      <AppBar
        position="absolute"
        style={{
          backgroundColor: 'black', // Transparent white nav bar background
          boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.15)', // Light shadow
          backdropFilter: 'blur(10px)', // Frosted glass effect
        }}
      >
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt="AI CareerGuru Logo"
              src="/images (1).png" // Ensure logo matches black and white theme
              sx={{ width: 48, height: 48 }}
            />
            <Typography
              variant="h4"
              style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                background: 'linear-gradient(90deg, #ffffff, #c0c0c0)', // White and light gray gradient
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              AI CareerGuru
            </Typography>
          </Stack>
          <SignInButton setUserloading={setUserloading} />
        </Toolbar>
      </AppBar>

      {/* Left Section - Description */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' }, // Full width on small screens, half on larger
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' }, // Center text on small screens
          textAlign: { xs: 'center', md: 'left' }, // Center text alignment on small screens
        }}
      >
        {/* Welcome Message */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' }, // Responsive font size
            fontWeight: '800',
            backgroundColor: '#262626', // White and light gray gradient
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Montserrat, sans-serif',
            marginBottom: '1rem',
          }}
        >
          Welcome to AI CareerGuru
        </Typography>

        {/* Application Description */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: '600',
            backgroundColor: '#262626',// Light gray gradient
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Montserrat, sans-serif',
            marginBottom: '10px',
            fontSize: { xs: '1.5rem', md: '2rem' }, // Responsive font size
          }}
        >
          The Ultimate AI Career Coach
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1.2rem',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '200',
            lineHeight: '1.6',
            color: '#262626', // White text for readability
            maxWidth: { xs: '90%', md: '90%' }, // Max width for better readability on smaller screens
          }}
        >
          AI CareerGuru helps individuals from all age groups looking for career guidance.
          Whether you need help with communication skills, technical abilities, or aptitude training,
          AI CareerGuru will provide personalized career coaching and training, guiding you every step
          of the way to achieve your professional dreams.
        </Typography>
      </Box>

      {/* Right Section - 3D Robot Model */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' }, // Full width on small screens, half on larger
          height: { xs: '50vh', md: '100%' }, // Smaller height on mobile
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Canvas style={{ width: '100%', height: '100%' }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <RobotModel position={[0, -1.5, 0]} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </Box>
    </Box>
  );
}

// 3D Robot Model Component with Default Animation
function RobotModel(props) {
  const { scene, animations } = useGLTF('/eve_wall-e__eva.glb'); // Load your 3D robot model here
  const { ref, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    const action = mixer.clipAction(animations[0]); // Play the first animation by default
    action.play();
  }, [animations, mixer]);

  return <primitive ref={ref} object={scene} {...props} />;
}
