//general button reusable component using tailwind
import React from 'react';

export const Button = (props: any) => {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            {...props}
        />
    );
};