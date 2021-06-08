import styled from 'styled-components';

export const CardsContainer = styled.div`
    height: 800px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    /* background: #fff;
        background: linear-gradient(217deg, #c1427b, orange 100.71%),
            linear-gradient(127deg, orange, pink 90.71%); */
    @media screen and (max-width: 768px) {
        height: 1300px;
    }
`

export const CardsWrapper = styled.div`
    max-width: 100%;
    height: 500px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    grid-gap: 16px;
    padding: 15px;

    @media screen and (max-width: 1000px) {
        grid-template-columns: 1fr 1fr;
    }
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 0 20px;
    }
`

export const CardsRectangle = styled.div`
    background: #F3F3F3;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 25px;
    height: 375px;
    width: 270px;
    padding: 25px;
    margin: 30px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: all 0.2s ease-in-out;
    border: 2px solid #595959;
    &:hover {
        transform: scale(1.06);
        transition: all 0.1s ease-in-out;
        cursor: pointer;
    }
`

export const CardsIcon = styled.img`
    height: 45%;
    margin-bottom: 5px;
`

export const CardsH1 = styled.h1`
    font-size: 2.5rem;
    color: #000;
    margin-bottom: 30px;

    @media screen and (max-width: 480px) {
        font-size: 2rem;
    }
`

export const CardsH2 = styled.h2`
    font-size: 1.35rem;
    margin-bottom: 10px;
`

export const CardsP = styled.p`
    font-size: 1.1rem;
    text-align: center;
    padding: 5px;
`

