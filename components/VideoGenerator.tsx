
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import { UploadIcon } from './icons';

type AspectRatio = '16:9' | '9:16';

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [image, setImage] = useState<{ file: File, url: string } | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume key selection is successful to unblock the UI immediately.
            setApiKeySelected(true);
        } else {
            setError("API key selection utility is not available.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError('File size must be less than 4MB.');
                return;
            }
            setImage({ file, url: URL.createObjectURL(file) });
            setGeneratedVideo(null);
            setError(null);
        }
    };
    
    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => e.preventDefault(), []);
    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError('File size must be less than 4MB.');
                return;
            }
            setImage({ file, url: URL.createObjectURL(file) });
            setGeneratedVideo(null);
            setError(null);
        }
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim() || !image) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedVideo(null);
        
        try {
            const base64Data = await fileToBase64(image.file);
            const mimeType = image.file.type;
            const videoUrl = await generateVideo(prompt, { data: base64Data, mimeType }, aspectRatio, setLoadingMessage);
            setGeneratedVideo(videoUrl);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            // If API key is the issue, prompt user to select again.
            if (errorMessage.includes("API key is invalid")) {
                setApiKeySelected(false);
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    if (!apiKeySelected) {
        return (
            <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-4">API Key Required for Video Generation</h2>
                <p className="text-gray-400 mb-2">Video generation with VEO requires a Google AI Studio API key.</p>
                <p className="text-gray-400 mb-6">Please select your key to continue. For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">Google AI billing docs</a>.</p>
                <button onClick={handleSelectKey} className="bg-lime-400 text-black font-bold py-3 px-6 rounded-md hover:bg-lime-500 transition-colors duration-300">
                    Select API Key
                </button>
                 {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-200">Video Generation from Image</h2>
            <p className="text-center text-gray-400">Upload a starting image, describe the video you want, and choose an aspect ratio.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full aspect-video bg-black border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image.url} alt="Starting Frame" className="w-full h-full object-contain" />
                    ) : (
                         <label htmlFor="file-upload-video" onDragOver={handleDragOver} onDrop={handleDrop} className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <UploadIcon/>
                            <span>Upload Starting Image</span>
                             <span className="text-xs text-gray-500 mt-1">Click or Drag & Drop</span>
                         </label>
                    )}
                    <input id="file-upload-video" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                </div>
                <div className="w-full aspect-video bg-black border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {isLoading && <Spinner message={loadingMessage}/>}
                    {!isLoading && generatedVideo && (
                        <video src={generatedVideo} controls autoPlay loop className="w-full h-full object-contain animate-fade-in" />
                    )}
                    {!isLoading && !generatedVideo && (
                        <p className="text-gray-500">Your generated video will appear here</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                <div className="flex space-x-2 rounded-md bg-zinc-800 p-1">
                    <button onClick={() => setAspectRatio('16:9')} className={`w-full py-2 rounded ${aspectRatio === '16:9' ? 'bg-lime-400 text-black font-semibold' : 'hover:bg-zinc-700'} transition-colors`}>Landscape (16:9)</button>
                    <button onClick={() => setAspectRatio('9:16')} className={`w-full py-2 rounded ${aspectRatio === '9:16' ? 'bg-lime-400 text-black font-semibold' : 'hover:bg-zinc-700'} transition-colors`}>Portrait (9:16)</button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A neon hologram of a cat driving at top speed"
                    className="flex-grow bg-zinc-800 border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    disabled={isLoading || !image}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !image}
                    className="bg-lime-400 text-black font-bold py-3 px-6 rounded-md hover:bg-lime-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
            </div>
            {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
    );
};

export default VideoGenerator;