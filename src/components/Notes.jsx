import {
  Heading,
  Text,
  Flex,
  IconButton,
  Button,
  Tag,
  TagLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { DeleteIcon, EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { format } from 'date-fns/esm';
import DOMPurify from 'dompurify';
import { BiPlus, BiPrinter, BiTag } from 'react-icons/bi';
import PrintComponent from './PrintComponent';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { auth, db } from '../../firebase';
import {
  doc,
  query,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsTags } from 'react-icons/bs';
import ManageTags from './ManageTags';

const Notes = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const printRef = useRef();
  const [notes, setNotes] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const handlePrintClick = (content) => {
    printRef.current.innerHTML = content;
    handlePrint();
  };
  const navigate = useNavigate();
  const createNewNote = async () => {
    let title = '';
    let content = '';
    let tags = [];
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'notes'), {
        title,
        content,
        tags,
      });
      console.log(docRef);
      navigate(`/notes/${docRef.id}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, 'users', user.uid, 'notes', id));
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/');
      return;
    }
    if (!user && authLoading) return;
    const q = query(collection(db, 'users', user.uid, 'notes'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const notesFromDb = [];
      querySnapshot.forEach((doc) => {
        const obj = {
          title: doc.data().title,
          content: doc.data().content,
          tags: doc.data().tags,
          id: doc.id,
        };
        notesFromDb.push(obj);
        console.log(obj);
      });
      setNotes(notesFromDb);
      console.log(notes);
    });
    return () => {
      unsub();
    };
  }, [user, authLoading]);

  return (
    <>
      <Accordion allowToggle>
        <Flex w="100%" align="center" justify="center" p="3">
          <Button
            size="lg"
            variant="ghost"
            onClick={createNewNote}
            leftIcon={<BiPlus />}
            p="2"
            marginInline="2"
          >
            New
          </Button>
          <Button
            marginInline="2"
            p="2"
            size="lg"
            variant="ghost"
            leftIcon={<BsTags />}
            onClick={onOpen}
          >
            Manage Tags
          </Button>
        </Flex>
        {notes &&
          notes.map((note) => (
            <AccordionItem key={note.id}>
              <Heading as="h2" d="flex">
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontSize={['1.1rem', '1.3rem']}>
                      {note.title !== '' ? note.title : 'Untitled Note'}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <Flex align="center" justify="center" m="1">
                  <IconButton
                    as={Link}
                    to={`/notes/${note.id}`}
                    icon={<EditIcon />}
                    variant="ghost"
                    size="lg"
                  />
                  <IconButton
                    icon={<BiPrinter />}
                    variant="ghost"
                    size="lg"
                    onClick={() => handlePrintClick(note.content)}
                  />
                  <IconButton
                    onClick={() => deleteNote(note.id)}
                    icon={<DeleteIcon />}
                    variant="ghost"
                    size="lg"
                  />
                </Flex>
              </Heading>

              <AccordionPanel pos="relative" pb={4}>
                <Flex flexFlow="column">
                  <Flex align="center">
                    {note.tags.map((item) => (
                      <Tag
                        size="sm"
                        key={item.value}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="blue"
                        mt="0"
                        ml="0"
                        mb="3"
                      >
                        <TagLabel>{item.label}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                  <div
                    style={{ pointerEvents: 'none' }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(note.content),
                    }}
                  />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
      <div style={{ display: 'none' }}>
        <PrintComponent ref={printRef} />
      </div>
      {user !== null && (
        <ManageTags
          user={user}
          authLoading={authLoading}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default Notes;
