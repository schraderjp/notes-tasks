import React, { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { BiPrinter } from 'react-icons/bi';
import PrintComponent from './PrintComponent';
import { useReactToPrint } from 'react-to-print';

const ViewNote = () => {
  const [user, authLoading, authErrors] = useAuthState(auth);
  const [note, setNote] = useState(null);
  const navigate = useNavigate();
  const { noteId } = useParams();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const handlePrintClick = (content) => {
    printRef.current.innerHTML = content;
    handlePrint();
  };
  const fetchNote = async (docRef) => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No data found for this doc ID.');
    }
  };

  const deleteNote = async () => {
    await deleteDoc(doc(db, 'users', user.uid, 'notes', noteId));
    navigate('/notes');
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/');
    }
    const getNote = async () => {
      const dbNote = await fetchNote(
        doc(db, 'users', user.uid, 'notes', noteId)
      );
      setNote(dbNote);
    };
    getNote();
  }, [user, authLoading]);

  if (!user && authLoading)
    return (
      <Flex w="100%" align="center" justify="center" mt="3">
        <Spinner size="lg" />
      </Flex>
    );
  return (
    <>
      <Flex mb="4" mr="4" ml="4" align="center" justify="space-between">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          leftIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Flex>
          <IconButton
            size="md"
            colorScheme="blue"
            icon={<EditIcon />}
            as={Link}
            variant="ghost"
            to={`/notes/${noteId}`}
          />
          <IconButton
            variant="ghost"
            size="md"
            colorScheme="blue"
            icon={<BiPrinter />}
            onClick={() => {
              const titleToPrint = `<h1>${note.title}</h1>`;
              const contentToPrint = titleToPrint + note.content;
              handlePrintClick(contentToPrint);
            }}
          />
          <IconButton
            variant="ghost"
            size="md"
            colorScheme="blue"
            icon={<DeleteIcon />}
            onClick={deleteNote}
          />
        </Flex>
      </Flex>
      <Heading textAlign="center" mb="3" as="h2">
        {note && note.title}
      </Heading>
      {note && (
        <Box
          ml="8"
          mr="8"
          style={{ pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{
            __html: note.content,
          }}
        />
      )}
      <div style={{ display: 'none' }}>
        <PrintComponent ref={printRef} />
      </div>
    </>
  );
};

export default ViewNote;
