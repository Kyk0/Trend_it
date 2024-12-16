import React from 'react';

const WhatIsItSection = () => {
    return (
        <div className="h-screen w-full bg-background-secondary flex items-center">
            <div className="flex flex-wrap md:flex-nowrap max-w-6xl mx-auto px-8 gap-x-12">
                <div className="w-full md:w-1/2 flex justify-center items-center opacity-0 animate-on-scroll">
                    <img
                        src="/Screenshot%202024-12-16%20at%2003.05.16.png"
                        alt="Graph Example"
                        className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                <div className="w-full md:w-1/2 text-left md:pl-12 opacity-0 animate-on-scroll">
                    <h2 className="text-4xl font-extrabold text-text-primary mb-8">
                        How It Works
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed">
                        The application works with a predefined dataset and selects a random data instance for analysis. It then identifies another instance with a similar trend over the same time frame, comparing different metrics across different regions. For example, it might find similarities between GDP in one region and employment trends in another.
                    </p>
                    <p className="text-lg text-text-secondary leading-relaxed mt-4">
                        More details about the algorithm used for trend searching can be found on the <a href="https://github.com/Kyk0/Trend_it" target="_blank" rel="noopener noreferrer" className="text-trend-accent underline decoration-0">GitHub repository</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WhatIsItSection;