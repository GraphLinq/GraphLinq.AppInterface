import React from 'react'
import { Box, VStack, Icon, Link, Button, Text, Image, Divider, Flex } from '@chakra-ui/react';
import { NavLink, Route } from 'react-router-dom';
import routes from '../routes/sidebar'
import * as Icons from 'react-icons/hi'
import GLQLogo from "../assets/logo.svg"
import { ContractCard } from './ContractBalance/ContractCard';

interface SidebarProps {

}

const IconSidebar = ({ icon, ...props }: any) => {
    const iconName = (Icons as any)[icon]
    return <Icon as={iconName} {...props} />
}

export const Sidebar: React.FC<SidebarProps> = ({ }) => {
    return (
        <aside id="a">
            <div className="lo">
               <Image src={GLQLogo}/>
            </div>
            <ContractCard />
            <nav id="n">
                <ul>
                    {routes.map((route: any) => (
                        <li>
                            <Link
                                as={NavLink}
                                exact
                                to={route.path}
                                _activeLink={{className:'active'}}
                            >
                                <Route path={route.path} exact={route.exact}></Route>
                                <IconSidebar icon={route.icon} w={4} h={4} />
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}