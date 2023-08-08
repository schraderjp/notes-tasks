import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import styled from 'styled-components';
import SelectTag from './SelectTag';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useColorMode,
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import FontFamily from '@tiptap/extension-font-family';
import { ArrowBackIcon } from '@chakra-ui/icons';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const StyledEditor = styled(EditorContent)`
  background-color: ${(props) =>
    props.colorMode === 'light' ? '#f2f7fa' : '#1f2735'};
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 6px;
  min-height: 20rem;
`;

const TextEditor = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState(null);
  const fetchNote = async () => {
    const docSnap = await getDoc(doc(db, 'users', user.uid, 'notes', noteId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No data found for this doc ID.');
    }
  };
  const updateTitle = async (value) => {
    await updateDoc(doc(db, 'users', user.uid, 'notes', noteId), {
      title: value,
    });
    setNote({ ...note, title: value });
  };
  const updateContent = async (html) => {
    await updateDoc(doc(db, 'users', user.uid, 'notes', noteId), {
      content: html,
    });
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'focus-none',
      },
    },
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-list-item',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: 'Start writing your note here...',
      }),
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editable: true,
    autofocus: true,
    onBeforeCreate({ editor }) {
      const getContent = async () => {
        const { content } = await fetchNote();
        console.log(content);
        editor.commands.setContent(content);
        setReady(true);
      };
      getContent();
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      updateContent(html);
    },
  });

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/');
    }
    const getTitle = async () => {
      const data = await fetchNote();
      setNote(data);
    };
    getTitle();
  }, [user, authLoading]);

  if (note === undefined || note === null || authLoading) {
    return (
      <Flex w="100%" align="center" justify="center" mt="3">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex align="center" justify="flex-start"></Flex>
      <Flex align="center" justify="space-between" mr="3" ml="3" pt="1" pb="1">
        <IconButton
          size="lg"
          icon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate(-1)}
        />
        <Editable
          onChange={updateTitle}
          ml="4"
          mr="2"
          fontSize="lg"
          style={{
            color: note.title === '' ? '#636363' : '',
          }}
          placeholder="Create a title..."
          defaultValue={note.title}
          flex="1"
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
      <SelectTag
        docRef={doc(db, 'users', user.uid, 'notes', noteId)}
        note={note}
        user={user}
        setNote={setNote}
      />
      <EditorToolbar editor={editor} />
      <StyledEditor colorMode={colorMode} editor={editor} />
    </Box>
  );
};

export default TextEditor;
