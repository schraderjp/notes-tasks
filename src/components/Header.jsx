import styled from 'styled-components';
import { useColorMode } from '@chakra-ui/react';
import {
  IconButton,
  Center,
  Heading,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  Flex,
  InputGroup,
  LinkBox,
  LinkOverlay,
  Tooltip,
  Text,
  Button,
  Box,
} from '@chakra-ui/react';
import { db } from '../../firebase';
import { SunIcon, MoonIcon, SettingsIcon, CheckIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillTagsFill } from 'react-icons/bs';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import {
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import ManageTags from './ManageTags';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Container
        d="flex"
        position="relative"
        maxW={['100vw', '100vw', '800px']}
        alignItems="center"
        justifyContent="space-between"
      >
        <LinkBox>
          <Heading pl="4" pt="2" fontSize="1.4rem" as="h1">
            <LinkOverlay as={Link} to="/">
              Notes App
            </LinkOverlay>
          </Heading>
        </LinkBox>
        <Flex align="center" pr="4" pt="2">
          {user && (
            <Tooltip label="Manage Tags">
              <IconButton
                size="md"
                variant="ghost"
                onClick={onOpen}
                icon={<BsFillTagsFill />}
              />
            </Tooltip>
          )}
          <Tooltip
            placement="start"
            label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            <IconButton
              size="md"
              variant="ghost"
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            />
          </Tooltip>
          {user && (
            <Tooltip label="Logout">
              <Button
                variant="link"
                colorScheme="blue"
                size="sm"
                onClick={() => signOut(auth)}
              >
                Logout
              </Button>
            </Tooltip>
          )}
        </Flex>
      </Container>
      {user && <ManageTags isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Header;
