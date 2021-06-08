
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <div>
            <Navbar toggle={toggle} />
        </div >
    )
}

