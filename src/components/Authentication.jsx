import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Heading,
} from '@chakra-ui/react';
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, authLoading, authError] = useAuthState(auth);
  const [formType, setFormType] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const openLogInForm = () => {
    setFormType('log-in');
    setModalTitle('Log In');
    onOpen();
  };
  const openSignUpForm = () => {
    setFormType('sign-up');
    setModalTitle('Sign Up');
    onOpen();
  };

  useEffect(() => {
    if (user) navigate('/notes');
  }, [user]);

  if (!user && authLoading)
    return (
      <Flex align="center" justify="center" height="100%">
        <Spinner />
      </Flex>
    );

  return (
    <>
      <Flex align="center" justify="center" height="100%" flexFlow="column">
        <Heading fontFamily="Inter" pb="3" as="h1" fontSize="2.5rem">
          Notes and Tasks
        </Heading>
        <Button size="lg" onClick={openSignUpForm} colorScheme="blue" m="3">
          Sign Up
        </Button>
        <Button
          size="lg"
          onClick={openLogInForm}
          variant="outline"
          colorScheme="blue"
          m="3"
        >
          Log In
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader align="center" textAlign="center" justify="center">
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formType === 'log-in' && <LogInForm />}
            {formType === 'sign-up' && <SignUpForm />}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Authentication;
