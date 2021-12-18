import styled from "styled-components";
import { FaCheck } from "react-icons/fa";

const CheckboxDiv = styled.div`
  position: relative;
  width: 1rem;
  height: 1rem;
`

const OuterCheckboxDiv = styled.div`
  display: flex;
  position: relative;
  margin: 0.4rem;
  align-items: center;
`

const CheckboxLabel = styled.label.attrs(props => ({
  id: props.id,
}))`
  margin: 0 0 0 0.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  height: 1rem;
`

const CheckboxInput = styled.input.attrs(props => ({

  type: 'checkbox',
  id: props.id,
  
}))`
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;

  &:focus-visible::before {
      outline: 3px solid rgba(1, 140, 253, 0.6);
    }

  &::before {
    content: "";
    box-sizing: border-box;
    width: 1rem;
    height: 1rem;
    border: 1px solid #4b4b4b;
    position: absolute;
    border-radius: 3px;
    top: 0;
    left: 0;
    transition: background-color 0.25s;
    background-color: #fff;

  }
  &:checked::before {
      background-color: #468de9;
      content: "";
      width: 100%;
      display: inline-block;
      height: 100%;
      border: 1px solid #468de9;
      border-radius: 3px;
      position: absolute;
      transition: background-color 0.25s, border-color 0.25s;
      box-sizing: border-box;
  }

  & ~ svg {
    opacity: 0;
    color: white;
    transition: opacity 0.25s;
  }

  &:checked ~ svg {
    opacity: 1;
    color: white;
    transition: opacity 0.25s;
  }
`
  const Checkbox = ({id, label}) => {
    return (
      <OuterCheckboxDiv>
      <CheckboxDiv>
        <CheckboxInput id={id} />
        <FaCheck style={{fontSize: '.7rem', position: 'absolute', top: '0.17rem', left: '.17rem', pointerEvents: 'none'}} />
        
        </CheckboxDiv>
        <CheckboxLabel htmlFor={id}>
          {label}
        </CheckboxLabel>
        </OuterCheckboxDiv>
    )
  }

export default Checkbox;