import React from 'react';
import {
    SidebarContainer,
    Icon,
    CloseIcon,
    SidebarWrapper,
    SidebarButton,
    SidebarMenu,
    SidebarLink,
    SidebarRoute,
    SideButtonWrap
} from './SidebarElements';

const Sidebar = ({ isOpen, toggle }) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon />
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="browse" onClick={toggle}>
                        browse
                    </SidebarLink>
                    <SidebarLink to="host" onClick={toggle}>
                        host
                    </SidebarLink>
                    <SidebarLink to="mytickets" onClick={toggle}>
                        my tickets
                    </SidebarLink>
                </SidebarMenu>
                <SideButtonWrap>
                    <SidebarRoute to="/signin">
                        sign in
                    </SidebarRoute>
                </SideButtonWrap>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar;