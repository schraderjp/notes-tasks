import Creatable from 'react-select/creatable';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  useColorMode,
  Text,
  Divider,
} from '@chakra-ui/react';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: state.selectProps.bgColor,
    display: 'flex',
    outline: 'none',
    border: 'none',
    boxShadow: 'none',
    width: '100%',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.selectProps.textColor,
  }),
  input: (provided, state) => ({
    ...provided,
    color: state.selectProps.textColor,
  }),
  container: (provided, state) => ({
    ...provided,
    flex: '1 1 auto',
  }),
  menu: (provided, state) => ({
    ...provided,
    background: state.selectProps.listBgColor,
    zIndex: '200',
  }),
  option: (provided, state) => ({
    ...provided,
    background: !state.isFocused
      ? state.selectProps.listBgColor
      : state.selectProps.optionHoverBgColor,
  }),
};

const SelectTaskTags = ({ task, tasks, setTask, user }) => {
  const { colorMode } = useColorMode();
  const updateTags = async (newValue) => {
    const currentTasks = tasks;
    const taskIndex = currentTasks.findIndex((item) => item.id == task.id);
    currentTasks[taskIndex].tags = newValue;
    await updateDoc(doc(db, 'users', user.uid), {
      tasks: currentTasks,
    });
  };
  const [value, setValue] = useState(task.tags);
  const [tagList, setTagList] = useState([]);
  const addTag = async (v) => {
    const { label, value } = createOption(v);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        userTags: arrayUnion({ label: label, value: value }),
      });
      updateTags([...value, newValue]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCreate = (input) => {
    addTag(input);
    const newValue = [...value, { ...createOption(input) }];
    updateTags(newValue);
    setValue(newValue);
    setTask({ ...task, tags: newValue });
  };

  const handleChange = (newValue) => {
    updateTags(newValue);
    setValue(newValue);
    setTask({ ...task, tags: newValue });
  };

  const handleDeleteTag = (tagValue) => {
    let filteredTags = task.tags.filter((item) => {
      if (item.value !== tagValue) {
        return item;
      }
    });
    updateTags(filteredTags);
    setValue(filteredTags);
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      setTagList(doc.data().userTags);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <Divider marginY="1" />
      <Flex align="center" mt="2" ml="3" pr="5" w="100%">
        <Text mr="4" fontWeight="600">
          Tags:
        </Text>

        <Creatable
          styles={customStyles}
          isMulti
          controlShouldRenderValue={false}
          isSearchable
          value={value}
          bgColor={colorMode === 'light' ? '#f5f6f6' : '#2D3748'}
          textColor={colorMode === 'light' ? '#2D3748' : '#CBD5E0'}
          listBgColor={colorMode === 'light' ? '#fff' : '#2D3748'}
          optionHoverBgColor={colorMode === 'light' ? '#E2E8F0' : '#4A5568'}
          options={tagList}
          onCreateOption={handleCreate}
          onChange={handleChange}
        />
      </Flex>
      <Flex
        pb="2"
        pt="2"
        ml="1"
        flexFlow="row wrap"
        align="center"
        justify="flex-start"
        spacing={4}
      >
        {value &&
          value.map((item) => (
            <Tag
              size="md"
              key={item.value}
              borderRadius="full"
              colorScheme="blue"
              m="1"
            >
              <TagLabel>{item.label}</TagLabel>

              <TagCloseButton onClick={() => handleDeleteTag(item.value)} />
            </Tag>
          ))}
      </Flex>
    </>
  );
};

export default SelectTaskTags;
