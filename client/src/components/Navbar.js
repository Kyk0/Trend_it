import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const handleRefresh = (event) => {
        if (location.pathname === "/") {
            event.preventDefault();
            window.location.reload();
        }
    };

    return (
        <nav className="bg-transparent text-white p-4 fixed w-full z-50">
            <div className="container mx-auto flex items-center justify-start">
                <Link
                    to="/"
                    onClick={handleRefresh}
                    className="text-2xl font-bold text-trend-accent transition duration-200"
                >
                    Trend it
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;