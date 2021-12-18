import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalOverlay,
  Input,
  InputGroup,
  ModalHeader,
  IconButton,
  ModalFooter,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase';
import { CheckIcon } from '@chakra-ui/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const ManageTags = ({ onClose, isOpen }) => {
  const [user, authLoading] = useAuthState(auth);
  const [tagList, loading, error] = useDocumentData(doc(db, 'users', user.uid));
  const [notes, loadingNotes, notesError] = useCollection(
    collection(db, 'users', user.uid, 'notes')
  );

  const navigate = useNavigate();
  const [tagInputValue, setTagInputValue] = useState('');
  const addNewTag = async () => {
    const { label, value } = createOption(tagInputValue);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        userTags: arrayUnion({ label: label, value: value }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteTag = async (value) => {
    try {
      let filteredTags = tagList.userTags.filter((tag) => {
        if (tag.value !== value) {
          return tag;
        }
      });
      await updateDoc(doc(db, 'users', user.uid), {
        userTags: filteredTags,
      });
      notes.docs.forEach(async (doc) => {
        let filteredTags = doc.data().tags.filter((tag) => {
          if (tag.value !== value) {
            return tag;
          }
        });
        const ref = doc.ref;
        await updateDoc(ref, {
          tags: filteredTags,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!user && authLoading)
    return (
      <Flex align="center" justify="center" height="100%">
        <Spinner />
      </Flex>
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent marginInline={2}>
        <ModalHeader marginInline={2}>Manage Tags</ModalHeader>
        <ModalCloseButton />
        <ModalBody marginInline={2}>
          <InputGroup mb="2">
            <Input
              borderEndRadius={0}
              placeholder="Add New Tag"
              value={tagInputValue}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && tagInputValue !== '') {
                  addNewTag();
                  setTagInputValue('');
                }
              }}
              onChange={(e) => setTagInputValue(e.target.value)}
            />
            <IconButton
              onClick={() => {
                addNewTag();
                setTagInputValue('');
              }}
              borderStartRadius={0}
              icon={<CheckIcon />}
            />
          </InputGroup>

          {!loading &&
            tagList &&
            tagList.userTags.map((item) => (
              <Tag
                size="md"
                key={item.value}
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
                m="1"
              >
                <TagLabel>{item.label}</TagLabel>

                <TagCloseButton onClick={() => handleDeleteTag(item.value)} />
              </Tag>
            ))}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ManageTags;
