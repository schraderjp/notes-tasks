import styled from 'styled-components';
import { Image, useColorMode, useColorModeValue } from '@chakra-ui/react';
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
import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom';
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
import { MdLogout } from 'react-icons/md';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const headingColor = useColorModeValue('blue.400', 'blue.300');
  const navigate = useNavigate();
  const [user, authLoading, authErrors] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Container
        d="flex"
        position="relative"
        pt="1"
        height="4rem"
        maxW={['100vw', '100vw', '800px']}
        alignItems="center"
        justifyContent={`${user ? 'space-between' : 'flex-end'}`}
      >
        {user && (
          <LinkBox>
            <LinkOverlay as={Link} to="/">
              <Image width="3rem" src="/favicon.svg" alt="Cartoon notebook" />
            </LinkOverlay>
          </LinkBox>
        )}
        <Flex pt="2">
          <Button
            as={NavLink}
            to="/notes"
            marginInline="2"
            size="md"
            colorScheme="blue"
            variant={({ isActive }) => (isActive ? 'filled' : 'ghost')}
          >
            Notes
          </Button>
          <Button
            variant={({ isActive }) => (isActive ? 'filled' : 'ghost')}
            marginInline="2"
            as={NavLink}
            to="/tasks"
            size="md"
            colorScheme="blue"
          >
            Tasks
          </Button>
        </Flex>
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
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOut(auth);
                  navigate('/');
                }}
                icon={<MdLogout />}
              />
            </Tooltip>
          )}
        </Flex>
      </Container>
    </>
  );
};

export default Header;
