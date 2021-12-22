import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Icon,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { BsPrinter, BsTag, BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { animated } from 'react-spring';

const AnimatedLinkBox = animated(LinkBox);

const Note = ({ values, note, deleteNote, handlePrintClick }) => {
  const cardBg = useColorModeValue('#f0f0f0', '#222838');
  const tagIconColor = useColorModeValue('blue.500', 'blue.300');
  if (!note)
    return (
      <Skeleton>
        <div style={{ height: '5rem' }}></div>
      </Skeleton>
    );

  return (
    <AnimatedLinkBox style={values}>
      <Box
        boxShadow="md"
        bg={cardBg}
        pl="3"
        pt="1"
        pb="3"
        mb="3"
        marginInline="4"
        borderRadius="6"
      >
        <Flex mb="2" align="center" justify="space-between">
          <Text fontFamily="Inter" fontSize={['1rem', '1.2rem']}>
            <LinkOverlay as={Link} to={`/notes/view/${note.id}`}>
              {note.title !== '' ? note.title : 'Untitled Note'}
            </LinkOverlay>
          </Text>
          <Menu>
            <MenuButton
              mr="2"
              variant="ghost"
              as={IconButton}
              icon={<BsThreeDotsVertical />}
            />
            <MenuList minW="max-content">
              <MenuItem as={Link} to={`/notes/${note.id}`} icon={<EditIcon />}>
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
            <Icon mr="2" fontSize="1.2rem" color={tagIconColor} as={BsTag} />
          </Flex>
          <Flex align="flex-start" justify="flex-start" flexWrap="wrap">
            {note.tags.map((tag) => (
              <Tag colorScheme="blue" mr="2">
                <TagLabel>{tag.label}</TagLabel>
              </Tag>
            ))}
          </Flex>
        </Flex>
      </Box>
    </AnimatedLinkBox>
  );
};

export default Note;
