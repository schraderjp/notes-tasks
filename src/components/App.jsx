import useDarkMode from '../hooks/useDarkMode';
import ReloadPrompt from './ReloadPrompt';
import {
  ChakraProvider,
  Container,
  Button,
  useColorMode,
  Spinner,
} from '@chakra-ui/react';
import theme from '../theme';
import Header from './Header';
import Notes from './Notes';
import TextEditor from './TextEditor';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Authentication from './Authentication';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

function App() {
  const [user, authLoading, authErrors] = useAuthState(auth);
  if (!user && authLoading) return <Spinner />;

  return (
    <>
      <Router>
        <ChakraProvider theme={theme}>
          <Header />
          <Container p={['0', '1em']} maxW={['100vw', '100vw', '800px']}>
            <Routes>
              <Route path="/" element={<Authentication />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:noteId" element={<TextEditor />} />
            </Routes>
          </Container>
          <ReloadPrompt />
        </ChakraProvider>
      </Router>
    </>
  );
}

export default App;
