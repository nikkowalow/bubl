import virgil from '../../images/virgil.jpg';
import {
    CardsContainer,
    CardsH1,
    CardsWrapper,
    CardsRectangle,
    CardsIcon,
    CardsH2,
    CardsP
} from './CardsElements';

const Cards = () => {
    return (
        <CardsContainer id="Cards">
            <CardsH1>showcase</CardsH1>
            <CardsWrapper>
                <CardsRectangle>
                    <CardsIcon src={virgil} />
                    <CardsH2>first ticket</CardsH2>
                    <CardsP>
                        lorem ipsm asdfjasdkf asoif jasdfj as dfai
                    </CardsP>
                </CardsRectangle>
                <CardsRectangle>
                    <CardsIcon src={virgil} />
                    <CardsH2>second ticket</CardsH2>
                    <CardsP>
                        lorem ipsm asdfu2344934uc 2sazfjaskdfjaskdfjasld
                    </CardsP>
                </CardsRectangle>
                <CardsRectangle>
                    <CardsIcon src={virgil} />
                    <CardsH2>third Expenses</CardsH2>
                    <CardsP>
                        lorem ipssaddf ai34 0340 t034t0-34 kt 03 0t4k3askdfjasld
                    </CardsP>
                </CardsRectangle>
            </CardsWrapper>
        </CardsContainer>
    )
}

export default Cards;
