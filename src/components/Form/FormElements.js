import styled from 'styled-components';

export const FormContainer = styled.div`
    height: 850px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-image: linear-gradient(to top right, #c1427b, ); */
    /* background: linear-gradient(217deg, #c1427b, orange 100.71%),
            linear-gradient(127deg, orange, pink 90.71%); */
    opacity: 100%;
    @media screen and (max-width: 768px) {
        height: 1300px;
    }
`

export const FormWrapper = styled.div`
    max-width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 16px;
    padding: 0 50px;

    @media screen and (max-width: 1000px) {
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 0 20px;
    }

`

export const FormShape = styled.div`
    background: #fff;
    display: flex;
    flex-direction: column;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    justify-content: flex-start;
    /* align-items: center; */
    border-radius: 40px;
    height: 700px;
    width: 900px;
    padding: 50px;
    margin: 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: all 0.2s ease-in-out;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 12px;
    justify-content: space-between;

    @media screen and (max-width: 900px) {
        width: 100%;
        font-family: arial,sans-serif;
    }

`

export const FormIcon = styled.img`
    height: 160px;
    width: 160px;
    margin-bottom: 10px;
`

export const FormH1 = styled.h1`
    font-size: 2.8rem;
    color: ${({ dark }) => (dark ? '#fff' : '#000')};
    margin-bottom: 30px;
    text-align: center;
    font-family: poppins, sans-serif;
    font-weight: 700;
    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`

export const FormH2 = styled.h2`
    font-size: 1.9rem;
    margin-bottom: 10px;
    font-family: poppins, sans-serif;
    font-weight: 700;
`

export const FormLabel = styled.label`
    font-size: 1.35rem;
    font-weight: bold;
    clear: both;
    display: flex;
    margin-top: 24px;
    margin-bottom: 6px;
    font-family: poppins, sans-serif;
    font-weight: 600;
`

export const ReviewLabel = styled.label`
    font-size: 1.15rem;
    font-weight: bold;
    display: flex;
    margin-top: 0px;
    margin-bottom: 0px;
    font-family: poppins, sans-serif;
    font-weight: 600;
    padding: 0px;
    display: inline-block;
`

export const EventType = styled.button`
    border-radius: 50px;
    background: #fff;
    white-space: nowrap;
    margin: 20px;
    padding: 28px 96px;
    color: #000;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    font-family: poppins, sans-serif;
    outline: none;
    border: 0.5px solid #c7c7c7;
    cursor: pointer; 

    &:hover {
        border: 2px solid black;
    }
    &:focus {
        border: 2px solid black;
    }
    @media screen and (max-width: 900px) {     
        margin: 5px;
        padding: 14px 48px;
    }
`

export const EventTypeContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
        grid-gap: 0px;
    align-items: center;
    /* padding: 15px; */

    @media screen and (max-width: 900px) {
        width: 100%;
        grid-template-columns: 1fr;

    }

`

export const FormP = styled.p`
    font-size: 1rem;
    text-align: center;
`

export const SmallInput = styled.input`
    text-align: left;
    font-size: 1.25rem;
    font-family: poppins, sans-serif;
    /* margin-right: 15px; */
    /* float: right; */
    width: 100%;
    height: 8%;
    border-radius: 20px;
    padding: 15px;
    display: flex;
    border: 1.5px solid #D9D8D8;
    background: #fff;
    outline: none;
`

export const LargeInput = styled.textarea`
    text-align: left;
    font-size: 1.25rem;
    font-family: poppins, sans-serif;
    /* margin-right: 15px; */
    /* float: right; */
    width: 100%;
    height: 30%;
    border-radius: 20px;
    padding: 15px;
    display: flex;
    border: 1.5px solid #D9D8D8;
    background: #fff;
    outline: none;
`

export const NavButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`

export const PrevButton = styled.button`
    border-radius: 50px;
    background: #000;
    white-space: nowrap;
    margin: 8px;
    padding: 14px 48px;
    color: #fff;
    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    font-family: poppins, sans-serif;
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: right;
    align-items: right;
    transition: all 0.2s ease-in-out;

    &:hover {
        transition: all 0.1s ease-in-out;
        background: #e4488e;
        color: #000;
    }
`

export const NextButton = styled.button`
    border-radius: 50px;
    background: #000;
    white-space: nowrap;
    margin: 8px;
    padding: 14px 48px;
    color: #fff;
    font-size: ${({ fontBig }) => (fontBig ? '20px' : '16px')};
    font-family: poppins, sans-serif;
    outline: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: right;
    align-items: right;
    transition: all 0.2s ease-in-out;

    &:hover {
        transition: all 0.1s ease-in-out;
        background: #fb9735;
        color: #000;
    }
`


export const TicketSupplyContainer = styled.div`
    position: center;
    justify-content: center;
`

export const TicketInput = styled.input`
    text-align: center;
    font-size: 4rem;
    font-family: poppins, sans-serif;
    width: 20%;
    height: 35%;
    border-radius: 0px;
    margin: 5%;
    border: 1.5px solid #D9D8D8;
    background: #fff;
    /* outline: none; */
    border: none;
`

export const CalendarContainer = styled.div`
    align-self: center;    
    font-family: poppins, sans-serif;
    background: white;
    border: 1px solid #a0a096;
`

export const ImageUpload = styled.input`
    font-size: 30px;
    align-self: center;
    font-family: poppins, sans-serif;
`