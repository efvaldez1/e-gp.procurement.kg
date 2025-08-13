import React from 'react';

const StatsCard = ({ icon, title, value }) => {
    // This component is now smarter. It checks if the icon you passed in
    // has a 'color' prop. If it does, it uses that color. If not, it
    // defaults to a nice blue color from the Tailwind palette.
    const finalIcon = React.cloneElement(icon, {
        className: "w-6 h-6",
        // Use the icon's own color prop if it exists, otherwise default to blue-500
        color: icon.props.color || '#3B82F6' 
    });

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
            <div className="bg-gray-700 p-3 rounded-full">
                {finalIcon}
            </div>
            <div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;