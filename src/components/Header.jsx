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
import { Link, Navigate, useNavigate } from 'react-router-dom';
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

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Container
        d="flex"
        position="relative"
        maxW={['100vw', '100vw', '800px']}
        alignItems="center"
        justifyContent={`${user ? 'space-between' : 'flex-end'}`}
      >
        {user && (
          <LinkBox>
            <Heading fontFamily="Inter" pl="4" pt="2" fontSize="1.4rem" as="h1">
              <LinkOverlay as={Link} to="/">
                Notes App
              </LinkOverlay>
            </Heading>
          </LinkBox>
        )}
        <Flex align="center" pr="4" pt="2">
          <Tooltip
            placement="start"
            label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            <IconButton
              mr="2"
              size="md"
              variant="ghost"
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            />
          </Tooltip>
          {user && (
            <Tooltip label="Logout">
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  signOut(auth);
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </Tooltip>
          )}
        </Flex>
      </Container>
    </>
  );
};

export default Header;
