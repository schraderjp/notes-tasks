import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from '@chakra-ui/react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const LogInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters.'),
});

const LogInForm = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const {
    errors,
    dirty,
    isValid,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LogInSchema,
    onSubmit: (values) => {
      signInWithEmailAndPassword(values.email, values.password);
    },
  });

  useEffect(() => {
    if (user) navigate('/notes');
  }, [user]);

  return (
    <Flex flexFlow="column">
      <form action="submit" onSubmit={handleSubmit}>
        <FormControl
          id="email"
          mb="2"
          mt="2"
          isInvalid={touched.email && errors.email}
        >
          <FormLabel>Email Address:</FormLabel>
          <Input
            onBlur={handleBlur}
            onChange={handleChange}
            name="email"
            type="email"
            name="email"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="password"
          mb="2"
          mt="2"
          isInvalid={touched.password && errors.password}
        >
          <FormLabel>Password:</FormLabel>
          <Input
            onBlur={handleBlur}
            onChange={handleChange}
            name="password"
            type="password"
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <Flex align="center" justify="center">
          <Button
            colorScheme="blue"
            disabled={!(isValid && dirty)}
            mt="4"
            isLoading={loading}
            loadingText="Logging In"
            type="submit"
          >
            Log In
          </Button>
        </Flex>
      </form>
      {user && user.email}
    </Flex>
  );
};

export default LogInForm;
