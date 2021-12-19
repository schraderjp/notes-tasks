import React, { forwardRef } from 'react';
import styled from 'styled-components';
import '../print.css';

const StyledDiv = styled.div`
  max-width: 8in;
  color: #000;
  background: #fff;
  & h1 {
    font-size: 2rem;
    font-weight: bold;
    padding: 0.25rem 0;
  }

  & h2 {
    font-size: 1.6rem;
    font-weight: 700;
    padding: 0.25rem 0;
  }

  & h3 {
    font-size: 1.3rem;
    font-weight: 600;
    padding: 0.25rem 0;
  }

  & code {
    background: rgb(187, 187, 187);
    padding: 0.25rem;
  }

  & blockquote {
    border-left: 4px solid rgb(107, 136, 187);
    background: rgb(220, 236, 248);
    padding: 0.25rem 0.5rem;
    margin-left: 0.75rem;
  }

  & pre {
    background-color: rgb(219, 219, 219);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    margin: 0.25rem;
  }

  & pre code {
    background: inherit;
    padding: 0;
  }

  & table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
  }
  & table td,
  & table th {
    border: 2px solid #ced4da;
    box-sizing: border-box;
    min-width: 1em;
    padding: 3px 5px;
    position: relative;
    vertical-align: top;
  }
  & table td > *,
  & table th > * {
    margin-bottom: 0;
  }
  & table th {
    background-color: #f1f3f5;
    font-weight: bold;
    text-align: left;
  }
  & table .selectedCell:after {
    background: rgba(200, 200, 255, 0.4);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }
  & table .column-resize-handle {
    background-color: #adf;
    bottom: -2px;
    position: absolute;
    right: -2px;
    pointer-events: none;
    top: 0;
    width: 4px;
  }
  & table p {
    margin: 0;
  }
`;

const PrintComponent = forwardRef((props, ref) => {
  return <StyledDiv ref={ref}></StyledDiv>;
});

export default PrintComponent;
