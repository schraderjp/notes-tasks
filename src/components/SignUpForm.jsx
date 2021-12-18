import React, { useState } from 'react';
import { useFormik } from 'formik';
import { auth, db } from '../../firebase';
import * as Yup from 'yup';
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Flex,
  Button,
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters.'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

const SignUpForm = () => {
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
      confirmPassword: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      try {
        const User = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        let user = User.user;
        let email = user.email;
        let userTags = [];
        await setDoc(doc(db, 'users', user.uid), {
          email,
          userTags,
        });
      } catch (error) {
        console.log(error.message);
      }
    },
  });
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
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={touched.password && errors.password}
          id="password"
          mb="2"
          mt="2"
        >
          <FormLabel>Password:</FormLabel>
          <Input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="confirmPassword"
          mb="2"
          mt="2"
          isInvalid={touched.confirmPassword && errors.confirmPassword}
        >
          <FormLabel>Confirm Password:</FormLabel>
          <Input
            type="password"
            name="confirmPassword"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>
        <Flex align="center" justify="center">
          <Button
            disabled={!(isValid && dirty)}
            type="submit"
            colorScheme="blue"
            mt="4"
            textAlign="center"
            loadingText="Signing Up"
          >
            Sign Up
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default SignUpForm;
