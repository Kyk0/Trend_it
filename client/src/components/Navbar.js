import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md fixed w-full z-50">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-coral-500">
                    Trendit
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-coral-400 transition duration-200">Home</Link>
                    <Link to="/about" className="hover:text-coral-400 transition duration-200">About</Link>
                    <Link to="/contact" className="hover:text-coral-400 transition duration-200">Contact</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;