import {
  Checkbox,
  Flex,
  Icon,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import React from 'react';
import { FaTag } from 'react-icons/fa';
import { animated } from 'react-spring';

const AnimatedFlex = animated(Flex);

const TaskCard = ({ task, updateTaskStatus, editClickHandler, values }) => {
  const cardBg = useColorModeValue('#f0f0f0', '#222838');
  const completedColor = useColorModeValue(
    'rgb(128, 128, 128)',
    'rgb(88,88,88'
  );
  const completedStyle = {
    textDecoration: 'line-through',
    textDecorationThickness: '3px',
    color: completedColor,
  };

  if (!task)
    return (
      <Skeleton>
        <div style={{ height: '5rem' }}></div>
      </Skeleton>
    );
  return (
    <AnimatedFlex
      cursor="pointer"
      flex="1"
      h="5rem"
      width="100%"
      p="0"
      bg={cardBg}
      borderRadius={6}
      align="center"
      justify="space-between"
      style={values}
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
          <Flex flex="1" mt="1" ml={'2'} mb="1" justifyContent="flex-start">
            <Flex ml={'1'} align="center" flex="1" w="100%">
              {task.tags[0] && (
                <Flex align="center">
                  <Icon mr="2" as={FaTag} />
                  {task.tags.map((tag) => (
                    <Tag size="sm" mr="1" colorScheme="blue" key={tag.value}>
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
                    style={task.completed ? completedStyle : undefined}
                    userSelect="none"
                    fontWeight="bold"
                    color="blue.300"
                  >
                    Due:
                  </Text>
                  <Text
                    style={task.completed ? completedStyle : undefined}
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
    </AnimatedFlex>
  );
};

export default TaskCard;
