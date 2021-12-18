import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsTypeStrikethrough,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsListUl,
  BsBlockquoteLeft,
  BsCode,
  BsListOl,
  BsHr,
  BsListCheck,
  BsTable,
  BsAlignStart,
} from 'react-icons/bs';
import {
  BiAlignJustify,
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiCodeBlock,
} from 'react-icons/bi';
import {
  AiOutlineInsertRowAbove,
  AiOutlineInsertRowBelow,
  AiOutlineInsertRowLeft,
  AiOutlineInsertRowRight,
  AiOutlineDeleteColumn,
  AiOutlineDeleteRow,
  AiOutlineDelete,
} from 'react-icons/ai';
import {
  IconButton,
  Flex,
  useColorModeValue,
  Tooltip,
  Select,
} from '@chakra-ui/react';
const Toolbar = styled(Flex)`
  flex-flow: row wrap;
  border-radius: 6px;
  padding: 0.25rem 0.25rem;
  z-index: 100;
  top: 0;
  bottom: auto;
  position: sticky;
`;

const ToolbarButton = styled(IconButton)`
  background: ${(props) => (props.isActive ? props.theme : '')};
`;

const EditorToolbar = ({ editor }) => {
  const toolbarBg = useColorModeValue('gray.300', 'gray.900');
  const buttonBg = useColorModeValue('gray.300', 'gray.900');
  const toolbarRef = useRef();

  if (!editor) {
    return null;
  }

  return (
    <Toolbar ref={toolbarRef} bg={toolbarBg}>
      <Tooltip label="Select Font">
        <Select
          w="max-content"
          m="0"
          border="none"
          fontSize="0.75rem"
          onChange={(e) =>
            editor.chain().focus().setFontFamily(`${e.target.value}`).run()
          }
          size="sm"
          placeholder="Select Font"
        >
          <option value="Arial">Arial</option>
          <option value="Inter">Inter</option>
          <option value="Roboto Mono">Roboto Mono</option>
          <option value="Times New Roman">Times New Roman</option>
        </Select>
      </Tooltip>
      <Tooltip label="Bold">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<BsTypeBold size={22} />}
        />
      </Tooltip>
      <Tooltip label="Italic">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<BsTypeItalic size={22} />}
        />
      </Tooltip>
      <Tooltip label="Underline">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={<BsTypeUnderline size={22} />}
        />
      </Tooltip>
      <Tooltip label="Strikethrough">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<BsTypeStrikethrough size={22} />}
        />
      </Tooltip>
      <Tooltip label="Align Left">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive('strike')}
          icon={<BiAlignLeft size={22} />}
        />
      </Tooltip>

      <Tooltip label="Align Center">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive('strike')}
          icon={<BiAlignMiddle size={22} />}
        />
      </Tooltip>
      <Tooltip label="Align Right">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive('strike')}
          icon={<BiAlignRight size={22} />}
        />
      </Tooltip>
      <Tooltip label="Align Justify">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive('strike')}
          icon={<BiAlignJustify size={22} />}
        />
      </Tooltip>

      <Tooltip label="Blockquote">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<BsBlockquoteLeft size={22} />}
        />
      </Tooltip>
      <Tooltip label="Unordered List">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<BsListUl size={22} />}
        />
      </Tooltip>
      <Tooltip label="Ordered List">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<BsListOl size={22} />}
        />
      </Tooltip>
      <Tooltip label="Checklist">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={<BsListCheck size={22} />}
        />
      </Tooltip>
      <Tooltip label="Code Block">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={<BiCodeBlock size={22} />}
        />
      </Tooltip>
      <Tooltip label="Inline Code">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<BsCode size={22} />}
        />
      </Tooltip>
      <Tooltip label="Heading 1">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
          icon={<BsTypeH1 size={22} />}
        />
      </Tooltip>
      <Tooltip label="Heading 2">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<BsTypeH2 size={22} />}
        />
      </Tooltip>
      <Tooltip label="Heading 3">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive('heading', { level: 3 })}
          icon={<BsTypeH3 size={22} />}
        />
      </Tooltip>

      <Tooltip label="Horizontal Rule">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<BsHr size={22} />}
        />
      </Tooltip>
      <Tooltip label="Insert Table">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          icon={<BsTable size={22} />}
        />
      </Tooltip>
      <Tooltip label="Add Column Before">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          icon={<AiOutlineInsertRowLeft size={22} />}
        />
      </Tooltip>
      <Tooltip label="Add Column After">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          icon={<AiOutlineInsertRowRight size={22} />}
        />
      </Tooltip>
      <Tooltip label="Delete Column">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          icon={<AiOutlineDeleteColumn size={22} />}
        />
      </Tooltip>
      <Tooltip label="Add Row Before">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          icon={<AiOutlineInsertRowAbove size={22} />}
        />
      </Tooltip>
      <Tooltip label="Add Row After">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          icon={<AiOutlineInsertRowBelow size={22} />}
        />
      </Tooltip>
      <Tooltip label="Delete Row">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().deleteRow().run()}
          icon={<AiOutlineDeleteRow size={22} />}
        />
      </Tooltip>
      <Tooltip label="Delete Table">
        <ToolbarButton
          bg="transparent"
          size="sm"
          onClick={() => editor.chain().focus().deleteTable().run()}
          icon={<AiOutlineDelete size={22} />}
        />
      </Tooltip>
    </Toolbar>
  );
};

export default EditorToolbar;
