'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Box, Toolbar, Typography, Stack, Avatar } from '@mui/material';
import SignInButton from './components/SignInButton';
import { auth } from './firebase';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import Loader from './components/Loading';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [userloading,setUserloading]=useState(false);
  const router = useRouter();

  // useEffect(() => {

  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setUserloading(true)
  //     if (user) {
  //       setUser(user);
  //       router.push('/dashboard'); 
  //       // Redirect to the chat page if already signed in
  //     }
  //     setUserloading(false)

  //   });

  //   return () => unsubscribe();
  // }, [router]);

  if (userloading) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{
          background: 'rgba(0.5)', // Semi-transparent black background
          overflow: 'hidden',
          position: 'relative',
          zIndex: 9999, // Ensure it overlays other content
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
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{
        background: 'radial-gradient(circle at 52.1% -29.6%, rgb(30, 30, 30) 0%, rgb(0, 0, 0) 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
      color="text.primary"
    >
      {/* Navigation Bar */}
      <AppBar
        position="absolute"
        style={{
          background: 'rgba(0, 0, 0, 0.85)', // Dark background with slight transparency
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.6)', // Dark shadow for depth
          backdropFilter: 'blur(10px)', // Frosted glass effect
        }}
      >
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt="AI CareerGuru Logo"
              src="/images (1).png" // Assuming a black and white logo image
              sx={{ width: 48, height: 48 }}
            />
            <Typography
              variant="h4"
              style={{
                fontWeight: '700',
                color: '#f0f0f0', // Light grey text color
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              AI CareerGuru
            </Typography>
          </Stack>
          <SignInButton setUserloading={setUserloading} />
        </Toolbar>
      </AppBar>

      {/* Welcome Message */}
      <Typography
        variant="h2"
        style={{
          position: 'absolute',
          top: '45%',
          transform: 'translateY(-50%)',
          textAlign: 'center',
          color: '#f0f0f0', // Light grey text color
          zIndex: 2,
          animation: 'fadeInDown 1.5s ease-in-out',
          fontWeight: '800',
          fontFamily: 'Montserrat, sans-serif',
          letterSpacing: '2px',
        }}
      >
        Welcome to AI CareerGuru
      </Typography>

      {/* 3D Robot UI */}
      <Canvas
        style={{
          width: '100%',
          height: '70%',
          position: 'absolute',
          bottom: 0,
          animation: 'slideInUp 1.5s ease-in-out',
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RobotModel position={[0, -1.5, 0]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>

      {/* Message Pointing to Robot */}
      <Box
        style={{
          position: 'absolute',
          bottom: '20vh',
          right: '12vw',
          color: '#f0f0f0', // Light grey text color
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 2s ease-in-out',
        }}
      >
        <Typography
          variant="h5"
          style={{
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '10px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Meet your AI Career Guide!
        </Typography>
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
