import styled from 'styled-components';
import { Link as LinkScroll } from 'react-scroll';

export const Button = styled(LinkScroll)`
    border-radius: 50px;
    background: #000;
    white-space: nowrap;
    margin: 8px;
    padding: 14px 48px;
    color: #fff;
    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease-in-out;

    &:hover {
        transition: all 0.1s ease-in-out;
        background: orange;
        color: #000;
    }
`