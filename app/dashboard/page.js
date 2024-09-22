// pages/page.js
'use client'

import { AppBar, Avatar, Box, Button, Card, CardContent, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { marked } from 'marked';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SignInButton from '../components/SignInButton';
import { auth, db } from '../firebase';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark'); // Theme state
  const router = useRouter();
  const [userloading, setUserloading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetchMessages(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMessages = async (userId) => {
    setLoading(true);
    const messagesDoc = await getDoc(doc(db, 'users', userId, 'messages', 'chat'));
    if (messagesDoc.exists()) {
      setMessages(messagesDoc.data().messages || []);
    } else {
      const initialMessages = [
        {
          role: 'assistant',
          content: "Hi! I'm the CareerGuru AI Coach. How can I help you today?",
        },
      ];
      setMessages(initialMessages);
      await setDoc(doc(db, 'users', userId, 'messages', 'chat'), { messages: initialMessages });
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    setLoading(true);
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage('');

    const newMessage = { role: 'user', content: message };
    const placeholderResponse = { role: 'assistant', content: '' };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
      placeholderResponse,
    ]);

    try {
      const response = await fetch('../api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, newMessage]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });

        setMessages((prevMessages) => {
          let lastMessageIndex = prevMessages.length - 1;
          let updatedMessages = [...prevMessages];
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            content: assistantMessage,
          };
          return updatedMessages;
        });
      }

      await updateDoc(doc(db, 'users', user.uid, 'messages', 'chat'), {
        messages: [...messages, newMessage, { role: 'assistant', content: assistantMessage }],
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
    setLoading(false);
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      router.push('/'); // Redirect to the homepage or a sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.'); // Show a user-friendly error message
    }
    setLoading(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor:'#FFFFFF',
        color: 'black'
      }}
    >
       <AppBar
        position="absolute"
        width="100vw"
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
      {loading && (
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          top={0}
          left={0}
          bgcolor="rgba(0, 0, 0, 0.5)" // Adds a semi-transparent background
          zIndex={9999} // Ensures the loader is on top of all other elements
        >
          <Loader />
        </Box>
      )}
      <Stack
        direction={'column'}
        width="100vw"
        height="100vh"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems="center"
          spacing={2}
          width="100%"
        >
        
        
        
        </Stack>

        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx={{
            paddingTop:'64px',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              display: 'none', // Hides scrollbar in WebKit-based browsers
            },
            scrollbarWidth: 'none', // Hides scrollbar in Firefox
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
             <Card
  sx={{
    maxWidth: '70%',
    bgcolor: '#F4F4F4', // Slightly transparent gray for user messages
    borderRadius: 2,
    boxShadow: 3,
    padding: '3px', // Add padding to avoid text getting cut off
    margin: '5px', // Add margin to ensure proper spacing
    overflowWrap: 'break-word', // Ensure long words break and don't overflow
    wordBreak: 'break-word', // Ensure long words break and don't overflow
  }}
>
  <CardContent>
    <Typography
      variant="body1"
      component="div"
      sx={{
        color: 'black',
        overflowWrap: 'break-word', // Ensure long words break and don't overflow
        wordBreak: 'break-word', // Ensure long words break and don't overflow
      }}
      dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
    />
  </CardContent>
</Card>

            </Box>
          ))}
        </Stack>

        <Box
          component="form"
          
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
         variant="standard"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              bgcolor: '#F4F4F4',
              color: 'black',
              padding:'15px',
              borderRadius: '20px',
              border: 'none', // Remove the border
    boxShadow: 'none', 

              
            }}
            InputProps={{
              disableUnderline: true,
              style: {
               
                color: 'black',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              minWidth: '50px',
              minHeight: '50px',
              backgroundColor:'#D7D7D7' ,
              color: 'black',
              borderRadius: '50%',
              marginLeft: '10px',
              '&:hover': {
                backgroundColor: 'rgba(215, 215, 215, 0.4)', // Transparent grey effect on hover
                color: 'black', // Keep the text color black on hover
                boxShadow: '0px 0px 8px rgba(215, 215, 215, 0.4)', // Subtle glow or shadow effect with transparent grey
              },
            }}
          >
            Send
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
