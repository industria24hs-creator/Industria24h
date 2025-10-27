
import React from 'react';

export const StudioIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 16.5C15.5 17.3284 14.8284 18 14 18H10C9.17157 18 8.5 17.3284 8.5 16.5V13.5H10V15.5H14V11.5H11.5C10.6716 11.5 10 10.8284 10 10V7.5C10 6.67157 10.6716 6 11.5 6H14C14.8284 6 15.5 6.67157 15.5 7.5V10.5H14V8.5H11.5V10.5H15.5V16.5Z" fill="url(#grad1)"/>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#bef264', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: '#a3e635', stopOpacity:1}} />
            </linearGradient>
        </defs>
    </svg>
);


export const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);