import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto w-full">
            {[...Array(3)].map((_, index) => ( // Render 3 skeleton cards
                <div key={index} className="skeleton-card">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line medium mt-2"></div>
                        </div>
                        <div className="skeleton-line w-20 h-6 rounded-full"></div>
                    </div>
                    <div className="skeleton-line long"></div>
                    <div className="skeleton-line full"></div>
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line medium mt-4 ml-auto"></div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;