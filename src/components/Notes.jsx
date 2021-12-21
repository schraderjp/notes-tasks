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
  Spinner,
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
import Note from './Note';
import { useTransition } from 'react-spring';

const Notes = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const printRef = useRef();
  const [notes, setNotes] = useState([]);
  const transitions = useTransition(notes, {
    from: {
      opacity: 0,
      maxHeight: '10rem',
      transition: 'max-height 0.2s',
    },
    enter: {
      opacity: 1,
      maxHeight: '10rem',
      transition: 'max-height 0.2s',
    },
    leave: {
      opacity: 0,
      maxHeight: '0rem',
      transition: 'max-height 0.1s',
    },
    keys: (item) => item.id,
  });

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
      {!notes && (
        <Flex w="100%" h="6rem" align="center" justify="center">
          <Spinner />
        </Flex>
      )}
      {notes &&
        transitions((values, note) => (
          <Note
            note={note}
            values={values}
            deleteNote={deleteNote}
            handlePrintClick={handlePrintClick}
          />
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
