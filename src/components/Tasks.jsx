import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
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
  Tag,
  TagLabel,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  VisuallyHidden,
  VStack,
} from '@chakra-ui/react';
import { MdAddTask, MdTag } from 'react-icons/md';
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
import { FaFilter, FaTag } from 'react-icons/fa';
import SelectTaskTags from './SelectTaskTags';
import { BiTag } from 'react-icons/bi';

const Tasks = () => {
  const initialTaskState = {
    id: '',
    description: '',
    dueDate: '',
    notes: '',
    completed: false,
    tags: [],
    shown: true,
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
  const [userTags, setUserTags] = useState(null);
  const [defaultTags, setDefaultTags] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
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
    await updateDoc(doc(db, 'users', user.uid), {
      tasks: arrayUnion({ ...task, id: newId }),
    });
    closeModal();
  };

  const updateTaskStatus = async (taskId) => {
    const currentTasks = allTasks;
    const taskIndex = currentTasks.findIndex((item) => item.id == taskId);
    currentTasks[taskIndex].completed = !currentTasks[taskIndex].completed;
    currentTasks[taskIndex].shown = showCompleted;
    await updateDoc(doc(db, 'users', user.uid), {
      tasks: currentTasks,
    });
  };

  const updateTask = async (taskId) => {
    const currentTasks = allTasks;
    const taskIndex = currentTasks.findIndex((item) => item.id == taskId);
    const updatedTask = {
      id: taskId,
      description: task.description,
      dueDate: task.dueDate,
      notes: task.notes,
      tags: task.tags,
      completed: task.completed,
      shown: task.shown,
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

  const handleTagFilter = async (value) => {
    const currentTasks = allTasks;
    if (value !== 'all') {
      currentTasks.forEach((task) => {
        if (task.tags.find((item) => item.value === value) === undefined) {
          task.shown = false;
        }
      });
    } else {
      currentTasks.forEach((task) => (task.shown = true));
    }

    await updateDoc(doc(db, 'users', user.uid), {
      tasks: currentTasks,
    });
  };

  const toggleShowCompleted = async (value) => {
    setShowCompleted(value);
    const currentTasks = allTasks;
    currentTasks.forEach((task) => {
      if (task.completed) {
        task.shown = value;
      }
    });

    await updateDoc(doc(db, 'users', user.uid), {
      tasks: currentTasks,
    });
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/');
      return;
    }
    if (!user && authLoading) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const tasksList = doc.data().tasks;
      console.log(doc.data().tasks);
      const tagsFromDb = doc.data().userTags;
      setUserTags(tagsFromDb);
      setAllTasks(tasksList);
      setTasks(
        tasksList.filter((task) => {
          if (task.shown) {
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
          <Menu>
            <MenuButton as={IconButton} icon={<FaFilter />} variant="ghost" />
            <MenuList minWidth="max-content">
              {userTags && (
                <MenuOptionGroup
                  onChange={(value) => handleTagFilter(value)}
                  type="radio"
                  title="Filter by Tag"
                  defaultValue="all"
                >
                  <MenuItemOption isChecked="true" value="all">
                    All
                  </MenuItemOption>
                  {userTags.map((tag) => (
                    <MenuItemOption value={tag.value} key={tag.value}>
                      {tag.label}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              )}
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
              setTask(initialTaskState);
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
              onChange={(e) => toggleShowCompleted(e.target.checked)}
              id="show-completed"
            />
          </Flex>
        </Flex>

        <VStack p="3">
          {!tasks && (
            <Flex mt="3" align="center" justify="center">
              <Spinner />
            </Flex>
          )}
          {tasks &&
            tasks.map((task) => (
              <Flex
                cursor="pointer"
                key={task.id}
                flex="1"
                h="5rem"
                width="100%"
                p="0"
                bg={cardBg}
                borderRadius={6}
                align="center"
                justify="space-between"
              >
                <Flex
                  h="100%"
                  alignItems="centent"
                  justifyContent="center"
                  pl="3"
                  pr="3"
                  onClick={() => {
                    updateTaskStatus(task.id);
                  }}
                >
                  <Checkbox
                    flex="1"
                    maxWidth="max-content"
                    id={task.id}
                    onChange={() => {
                      updateTaskStatus(task.id);
                    }}
                    spacing="0"
                    size="lg"
                    flex="1"
                    isChecked={task.completed}
                  >
                    <VisuallyHidden>{task.description}</VisuallyHidden>
                  </Checkbox>
                </Flex>
                <Flex
                  flexFlow="column"
                  flex="1"
                  p="1"
                  onClick={() => {
                    editClickHandler(task);
                  }}
                >
                  <Flex align="center">
                    <Text
                      userSelect="none"
                      pl="3"
                      style={task.completed ? completedStyle : undefined}
                    >
                      {task.description}
                    </Text>
                  </Flex>

                  <Flex>
                    <Flex
                      flex="1"
                      mt="1"
                      ml={'2'}
                      mb="1"
                      justifyContent="flex-start"
                    >
                      <Flex ml={'1'} align="center" flex="1" w="100%">
                        {task.tags[0] && (
                          <Flex align="center">
                            <Icon mr="2" as={FaTag} />
                            {task.tags.map((tag) => (
                              <Tag
                                size="sm"
                                mr="1"
                                colorScheme="blue"
                                key={tag.value}
                              >
                                <TagLabel>{tag.label}</TagLabel>
                              </Tag>
                            ))}
                          </Flex>
                        )}
                        {task.dueDate && (
                          <>
                            <Text pl="3" pr="3">
                              •
                            </Text>
                            <Text
                              style={
                                task.completed ? completedStyle : undefined
                              }
                              userSelect="none"
                              fontWeight="bold"
                              color="blue.300"
                            >
                              Due:
                            </Text>
                            <Text
                              style={
                                task.completed ? completedStyle : undefined
                              }
                              userSelect="none"
                              pl="2"
                            >
                              {task.dueDate}
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            ))}
        </VStack>
      </Box>
      <Drawer placement="right" isOpen={isOpen} onClose={closeModal}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader textAlign="center">
            {editMode ? 'Edit' : 'New'} Task
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
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
          </DrawerBody>
          <DrawerFooter d="flex" alignItems="center" justifyContent="center">
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Tasks;
