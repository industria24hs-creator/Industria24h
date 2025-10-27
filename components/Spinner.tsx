import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="w-12 h-12 border-4 border-t-lime-400 border-zinc-700 rounded-full animate-spin"></div>
      {message && <p className="mt-4 text-gray-300 animate-text-pulse">{message}</p>}
    </div>
  );
};

export default Spinner;