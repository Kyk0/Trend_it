import React from 'react';

const WelcomeSection = () => {
    return (
        <div className="h-screen w-full bg-background-main flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary mb-4 opacity-0 animate-on-scroll">
                    Welcome to <span className="text-trend-accent">Trend It</span>
                </h1>
                <p className="text-lg md:text-2xl text-text-secondary opacity-0 animate-on-scroll">
                    Explore diverse metrics to uncover trends within a shared timeframe.
                </p>
                <div className="flex justify-center gap-4 mt-6 opacity-0 animate-on-scroll">
                    <button className="px-8 py-3 bg-button-primary text-text-primary rounded-lg font-semibold hover:bg-button-hover">
                        Get Started
                    </button>
                    <button className="px-8 py-3 bg-background-secondary text-text-primary rounded-lg font-semibold hover:bg-gray-700">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;