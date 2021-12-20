import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { MdAddTask } from 'react-icons/md';
import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  query,
  addDoc,
  arrayUnion,
  doc,
  updateDoc,
  where,
  onSnapshot,
  arrayRemove,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { FaFilter } from 'react-icons/fa';
import SelectTaskTags from './SelectTaskTags';

const Tasks = () => {
  const initialTaskState = {
    id: '',
    description: '',
    dueDate: '',
    notes: '',
    completed: false,
    tags: [],
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('#f0f0f0', '#222838');
  const completedColor = useColorModeValue(
    'rgb(128, 128, 128)',
    'rgb(88,88,88'
  );
  const [user, authLoading, authErrors] = useAuthState(auth);
  const completedStyle = {
    textDecoration: 'line-through',
    textDecorationThickness: '3px',
    color: completedColor,
  };
  const [showCompleted, setShowCompleted] = useState(true);
  const [tags, setTags] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [task, setTask] = useState(initialTaskState);
  const [editMode, setEditMode] = useState(false);
  const editClickHandler = (currentTask) => {
    setEditMode(true);
    setTask(currentTask);
    onOpen();
  };
  const closeModal = () => {
    setEditMode(false);
    onClose();
  };

  const addNewTask = async () => {
    const newId = nanoid();
    setTask(initialTaskState);
    await updateDoc(doc(db, 'users', user.uid), {
      tasks: arrayUnion({ ...task, id: newId }),
    });
    closeModal();
  };

  const updateTaskStatus = async (taskId) => {
    const currentTasks = tasks;
    const taskIndex = currentTasks.findIndex((item) => item.id == taskId);
    currentTasks[taskIndex].completed = !currentTasks[taskIndex].completed;
    await updateDoc(doc(db, 'users', user.uid), {
      tasks: currentTasks,
    });
  };

  const updateTask = async (taskId) => {
    const currentTasks = tasks;
    const taskIndex = currentTasks.findIndex((item) => item.id == taskId);
    const updatedTask = {
      id: taskId,
      description: task.description,
      dueDate: task.dueDate,
      notes: task.notes,
      tags: task.tags,
    };
    currentTasks[taskIndex] = updatedTask;
    await updateDoc(doc(db, 'users', user.uid), {
      tasks: currentTasks,
    });
    closeModal();
  };

  const saveTask = () => {
    if (!editMode) {
      addNewTask();
    } else {
      updateTask(task.id);
    }
  };

  const deleteTaskHandler = async (task) => {
    updateDoc(doc(db, 'users', user.uid), {
      tasks: arrayRemove(task),
    });
    closeModal();
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/');
      return;
    }
    if (!user && authLoading) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const tasksList = doc.data().tasks;
      const userTags = doc.data().userTags;
      setUserTags(userTags);
      showCompleted
        ? setTasks(tasksList)
        : setTasks(
            tasksList.filter((task) => {
              if (task.completed === false) {
                return task;
              }
            })
          );
    });
    return () => {
      unsub();
    };
  }, [user, showCompleted, authLoading]);

  if (!user && authLoading)
    return (
      <Flex w="100%" align="center" justify="center" mt="3">
        <Spinner size="lg" />
      </Flex>
    );

  return (
    <>
      <Box pos="relative" textAlign="center">
        {/* <Heading as="h2">Tasks</Heading> */}
        <Flex align="center" justify="space-around" p="3">
          <Menu closeOnSelect={false}>
            <MenuButton as={IconButton} icon={<FaFilter />} variant="ghost" />
            <MenuList minWidth="max-content">
              <MenuOptionGroup type="checkbox" title="Filter by Tag">
                <MenuItemOption>Item</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Button
            size="md"
            variant="ghost"
            p="2"
            marginInline="2"
            fontFamily="Inter"
            leftIcon={<MdAddTask size="25" />}
            onClick={() => {
              setEditMode(false);
              onOpen();
            }}
          >
            New Task
          </Button>
          <Flex align="center" ml="3">
            <Text fontSize="1rem" mb="0" mr="2">
              Toggle Completed
            </Text>
            <Switch
              isChecked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              id="show-completed"
            />
          </Flex>
        </Flex>

        <VStack>
          {!tasks && (
            <Flex mt="3" align="center" justify="center">
              <Spinner />
            </Flex>
          )}
          {tasks &&
            tasks.map((task) => (
              <Box
                cursor="pointer"
                key={task.id}
                flex="1"
                width="100%"
                p="2"
                bg={cardBg}
                borderRadius={6}
                onClick={() => editClickHandler(task)}
              >
                <Flex flexFlow="column">
                  <Flex align="center">
                    <Checkbox
                      maxWidth="max-content"
                      id={task.id}
                      onChange={() => updateTaskStatus(task.id)}
                      spacing="0"
                      ml="3"
                      size="lg"
                      flex="1"
                      isChecked={task.completed}
                    >
                      <VisuallyHidden>{task.description}</VisuallyHidden>
                    </Checkbox>
                    <Text
                      userSelect="none"
                      pl="3"
                      style={task.completed ? completedStyle : undefined}
                    >
                      {task.description}
                    </Text>
                  </Flex>
                  <Flex>
                    <Flex mt="1" ml={'2'} mb="1">
                      {/* <IconButton
                        onClick={() => editClickHandler(task)}
                        mr="1"
                        variant="ghost"
                        icon={<EditIcon />}
                      />
                      <IconButton
                        variant="ghost"
                        icon={<DeleteIcon />}
                        onClick={() => deleteTaskHandler(task)}
                      /> */}
                      {task.dueDate && (
                        <Flex
                          style={task.completed ? completedStyle : undefined}
                          ml={'1'}
                          align="center"
                          w="9rem"
                        >
                          <Text
                            userSelect="none"
                            fontWeight="bold"
                            color="blue.300"
                          >
                            Due:
                          </Text>
                          <Text userSelect="none" pl="2">
                            {task.dueDate}
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ))}
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {editMode ? 'Edit' : 'New'} Task
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="2" ml="2" mr="2">
              <FormLabel>Description:</FormLabel>
              <Input
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                type="text"
              />
            </FormControl>
            <FormControl m="2">
              <FormLabel>Due Date:</FormLabel>
              <Input
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                type="date"
              />
            </FormControl>
            <FormControl m="2">
              <FormLabel>Notes:</FormLabel>
              <Textarea
                value={task.notes}
                onChange={(e) => setTask({ ...task, notes: e.target.value })}
                resize="none"
              ></Textarea>
            </FormControl>
            <SelectTaskTags
              tasks={tasks}
              setTask={setTask}
              user={user}
              task={task}
            />
          </ModalBody>
          <ModalFooter d="flex" alignItems="center" justifyContent="center">
            <Button
              onClick={saveTask}
              leftIcon={<CheckIcon />}
              colorScheme="green"
              m="2"
            >
              Save
            </Button>
            <Button
              onClick={closeModal}
              leftIcon={<CloseIcon />}
              colorScheme="red"
            >
              Cancel
            </Button>
            <IconButton
              ml="3"
              size="lg"
              variant="ghost"
              icon={<DeleteIcon />}
              onClick={() => deleteTaskHandler(task)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Tasks;
