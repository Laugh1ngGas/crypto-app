import logo from '../../assets/logo.png'
import { navItems } from '../../constants'
import { Menu, X } from 'lucide-react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navabr = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const toggleNavbar = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    }

    return (
        <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
            <div className="container px-4 mx-auto relative text-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center flex-shrink-0">
                        <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
                        <span className="text-xl tracking-tight">Crypto App</span>
                    </div>
                    <ul className="hidden lg:flex ml-14 space-x-12">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <a href={item.href}>{item.label}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="hidden lg:flex justify-center space-x-8 items-center">
                        <Link to="/form" className="py-2 px-3 border rounded-md">Sign In</Link>
                        <Link to="/form" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">Sign Up</Link>  
                    </div>
                    <div className="lg:hidden md:flex flex-col justify-end">
                        <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X/> : <Menu/>}</button>
                    </div>
                </div>
                {mobileDrawerOpen && 
                <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hedden">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index} className="py-4"><a href={item.href}>{item.label}</a></li>)
                        )}
                    </ul>
                    <div className="flex space-x-6 mt-4">
                        <Link to={"/form"} className="py-2 px-3 border rounded-md">Sign In</Link>
                        <Link to={"/form"} className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">Sign Up</Link>
                    </div>
                </div>
                }
            </div>
        </nav>
    );
};

export default Navabr;