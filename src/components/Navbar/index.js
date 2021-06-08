import {
    Nav,
    NavbarContainer,
    NavLogo,
    MobileIcon,
    NavMenu,
    NavItem,
    NavLinks,
    NavButton,
    NavButtonLink,
    WalletInfo
} from './NavbarElements';
import { ConnectButton } from '../connectButton';

import {
    useWallet
} from '../../contexts/wallet';
const Navbar = ({ toggle }) => {

    const { connected, wallet, connection } = useWallet();

    return (
        <div>

            <Nav>
                <NavbarContainer>
                    <NavLogo to="/" className="header-name" style={{ fontSize: 50 }}>
                        {/* <img src={bublLogo} style={{ maxWidth: 120 }} /> */}
                        bubl
                    </NavLogo>
                    {/* <MobileIcon onClick={toggle}>
                        <FaBars />
                    </MobileIcon> */}
                    <NavMenu className="nav-menu">
                        <NavItem>
                            <NavLinks to="browse">browse</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="host">host</NavLinks>
                        </NavItem>
                        <NavItem>
                            <NavLinks to="mytickets">my tickets</NavLinks>
                        </NavItem>
                    </NavMenu>
                    {/* <WalletInfo>
                        {connected ? wallet.lamports : '0 SOL'}
                    </WalletInfo> */}
                    <NavButton>
                        <ConnectButton key="button1" />
                    </NavButton>
                </NavbarContainer>
            </Nav>
        </div>
    )
};

export default Navbar;
