// components/SignInButton.js
import { useEffect, useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import Loader from './Loading';

export default function SignInButton({setUserloading}) {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Initialize router for navigation
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setUserloading(true);
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard'); // Redirect to a dashboard or another page after signing in
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.'); // Show a user-friendly error message
    }
    setUserloading(false);
    setLoading(false);
  };

  const handleSignOut = async () => {
    setUserloading(true);
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      router.push('/'); // Redirect to the homepage or a sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.'); // Show a user-friendly error message
    }
    setUserloading(false);
    setLoading(false);
  };


  return (
    <div>
        {loading ? (
        <Loader /> // Display the Loader component while loading
      ) : 
      user ? (
        <Button
          variant="contained"
        
          sx={{
            maxWidth: '10vw',
            minWidth: '100px',
            background: 'linear-gradient(72deg, rgb(156, 43, 171) 58.92%, rgb(39, 43, 44) 100.00%);linear-gradient(72deg, rgb(44, 222, 242) 0.00%, rgb(156, 43, 171) 19.49%, rgb(39, 43, 44) 100.00%);' // Ensures a minimum width for the button
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{
            maxWidth: '10vw',
            minWidth: '100px',
            background: 'linear-gradient(72deg, rgb(156, 43, 171) 58.92%, rgb(39, 43, 44) 100.00%);linear-gradient(72deg, rgb(44, 222, 242) 0.00%, rgb(156, 43, 171) 19.49%, rgb(39, 43, 44) 100.00%);' // Ensures a minimum width for the button
          }}
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      )}
    </div>
  );
}
