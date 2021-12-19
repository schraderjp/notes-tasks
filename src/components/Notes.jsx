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
  useColorModeValue,
  Icon,
  LinkBox,
  LinkOverlay,
  MenuIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
import { BsPrinter, BsTag, BsTags, BsThreeDotsVertical } from 'react-icons/bs';
import ManageTags from './ManageTags';

const Notes = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const printRef = useRef();
  const [notes, setNotes] = useState(null);
  const cardBg = useColorModeValue('#f1f1f1', '#222838');
  const tagIconColor = useColorModeValue('blue.500', 'blue.300');

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
      <Flex w="100%" align="center" justify="center" p="3">
        <Button
          size="md"
          variant="ghost"
          onClick={createNewNote}
          leftIcon={<BiPlus />}
          p="2"
          marginInline="2"
          fontFamily="Inter"
        >
          New
        </Button>
        <Button
          marginInline="2"
          p="2"
          size="md"
          variant="ghost"
          leftIcon={<BsTags />}
          onClick={onOpen}
          fontFamily="Inter"
        >
          Manage Tags
        </Button>
      </Flex>
      {notes &&
        notes.map((note) => (
          <LinkBox key={note.id}>
            <Box bg={cardBg} p="3" mb="3" marginInline="4" borderRadius="6">
              <Flex mb="2" align="center" justify="space-between">
                <Text fontFamily="Inter" fontSize={['1rem', '1.2rem']}>
                  <LinkOverlay as={Link} to={`/notes/view/${note.id}`}>
                    {note.title !== '' ? note.title : 'Untitled Note'}
                  </LinkOverlay>
                </Text>
                <Menu>
                  <MenuButton
                    variant="ghost"
                    as={IconButton}
                    icon={<BsThreeDotsVertical />}
                  />
                  <MenuList minW="max-content">
                    <MenuItem
                      as={Link}
                      to={`/notes/${note.id}`}
                      icon={<EditIcon />}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        const titleToPrint = `<h1>${note.title}</h1>`;
                        const contentToPrint = titleToPrint + note.content;
                        handlePrintClick(contentToPrint);
                      }}
                      icon={<BsPrinter />}
                    >
                      Print
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteIcon />}
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Flex align="center" justify="flex-start">
                <Flex align="flex-start" justify="flex-start">
                  <Icon
                    mr="2"
                    fontSize="1.2rem"
                    color={tagIconColor}
                    as={BsTag}
                  />
                </Flex>
                <Flex align="flex-start" justify="flex-start" flexWrap="wrap">
                  {note.tags.map((tag) => (
                    <Tag mr="2">
                      <TagLabel>{tag.label}</TagLabel>
                    </Tag>
                  ))}
                </Flex>
              </Flex>
            </Box>
          </LinkBox>
        ))}

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
