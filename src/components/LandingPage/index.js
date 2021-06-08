import { useState } from 'react';
import bublFrontPage2 from '../../images/bublFrontPage2.png';
import { Button } from '../Button/ButtonElements';
import {
    LandingPageContainer,
    LandingPageBg,
    LandingPageContent,
    LandingPageH1,
    LandingPageButtonWrapper,
    ArrowForward,
    ArrowRight
} from './LandingPageElements';

const LandingPageSection = () => {

    const [hover, setHover] = useState(false);
    const onHover = () => {
        setHover(!hover);
    };

    return (
        <LandingPageContainer>
            <LandingPageBg>
                <img src={bublFrontPage2} style={{ width: "100%" }} />
            </LandingPageBg>
            <LandingPageContent>
                <LandingPageButtonWrapper>
                    {/* <Button
                        to="signup"
                        onMouseEnter={onHover}
                        onMouseLeave={onHover}
                        primary="true"
                        dark="true"
                    >
                        Get Started {hover ? <ArrowForward /> : <ArrowRight />}
                    </Button> */}
                </LandingPageButtonWrapper>
            </LandingPageContent>
        </LandingPageContainer>
    )
}

export default LandingPageSection
