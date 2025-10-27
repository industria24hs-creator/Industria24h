
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageUrl = await generateImage(prompt);
            setGeneratedImage(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-200">Image Generation</h2>
            <p className="text-center text-gray-400">Describe the image you want to create. Be as descriptive as possible for the best results.</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A majestic lion wearing a crown in a futuristic city"
                    className="flex-grow bg-zinc-800 border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-lime-400 text-black font-bold py-3 px-6 rounded-md hover:bg-lime-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
            
            {error && <p className="text-red-400 text-center">{error}</p>}

            <div className="w-full aspect-square bg-black border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                {isLoading && <Spinner message="Creating your image..."/>}
                {!isLoading && generatedImage && (
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                )}
                 {!isLoading && !generatedImage && (
                    <p className="text-gray-500">Your generated image will appear here</p>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;