//make link component using tailwind css
import React from 'react';

export const Link = (props: any) => {
    return (
        <a
            className="text-blue-500 hover:text-blue-800"
            {...props}
        />
    );
};