import React, { useEffect } from 'react';
import WelcomeSection from './WelcomeSection';
import WhatIsItSection from './WhatIsItSection';

const HomePage = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                    }
                });
            },
            { threshold: 0.2 }
        );

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => observer.observe(el));

        return () => {
            animatedElements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <div>
            <WelcomeSection />
            <WhatIsItSection />
        </div>
    );
};

export default HomePage;

// welcome
//
// what is it
//
// graphs
//
// how it works and whats inside
//
// what will be added(current disadvantages)