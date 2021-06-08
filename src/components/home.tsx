
import React, { useState } from 'react';
import LandingPageSection from '../components/LandingPage';
import InfoSection from '../components/InfoSection';
import { homeObjOne, homeObjTwo } from '../components/InfoSection/Data';
import Cards from '../components/Cards';

const Home = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            <LandingPageSection />
            {/* <InfoSection {...homeObjOne} />
            <Cards />
            <InfoSection {...homeObjTwo} /> */}
        </div >
    )
}

export default Home
