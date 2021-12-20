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
import ViewNote from './ViewNote';
import Tasks from './Tasks';

function App() {
  return (
    <>
      <Router>
        <ChakraProvider theme={theme}>
          <Header />
          <Container
            h="calc(100vh-4rem)"
            p={['0', '1em']}
            maxW={['100vw', '100vw', '800px']}
          >
            <Routes>
              <Route path="/" element={<Authentication />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:noteId" element={<TextEditor />} />
              <Route path="/notes/view/:noteId" element={<ViewNote />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </Container>
          <ReloadPrompt />
        </ChakraProvider>
      </Router>
    </>
  );
}

export default App;
