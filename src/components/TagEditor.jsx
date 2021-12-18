import React from 'react';
import {
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  IconButton,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { db } from '../db';

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const TagEditor = () => {
  const addTag = async (v) => {
    const { label, value } = createOption(v);
    try {
      await db.tags.add({
        label: label,
        value: value,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  function EditableControls() {
    const { isEditing, getSubmitButtonProps } = useEditableControls();

    return isEditing ? (
      <IconButton
        ml="2"
        size="sm"
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
    ) : null;
  }

  return (
    <Editable
      d="flex"
      ml="1"
      mr="2"
      fontSize="sm"
      placeholder="New Tag"
      flex="0 1 auto"
      align="center"
      onSubmit={addTag}
      submitOnBlur={false}
    >
      <EditablePreview />
      <EditableInput />
      <EditableControls />
    </Editable>
  );
};

export default TagEditor;
