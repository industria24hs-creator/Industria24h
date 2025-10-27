
import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import { UploadIcon } from './icons';

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string } | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError('File size must be less than 4MB.');
                return;
            }
            setOriginalImage({ file, url: URL.createObjectURL(file) });
            setEditedImage(null);
            setError(null);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
             if (file.size > 4 * 1024 * 1024) {
                setError('File size must be less than 4MB.');
                return;
            }
            setOriginalImage({ file, url: URL.createObjectURL(file) });
            setEditedImage(null);
            setError(null);
        }
    }, []);

    const handleEdit = async () => {
        if (!prompt.trim() || !originalImage) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const base64Data = await fileToBase64(originalImage.file);
            const mimeType = originalImage.file.type;
            const imageUrl = await editImage(prompt, { data: base64Data, mimeType });
            setEditedImage(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-200">Image Editor</h2>
            <p className="text-center text-gray-400">Upload an image and describe the changes you want to make.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full aspect-square bg-black border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {originalImage ? (
                        <img src={originalImage.url} alt="Original" className="w-full h-full object-contain" />
                    ) : (
                         <label htmlFor="file-upload-edit" onDragOver={handleDragOver} onDrop={handleDrop} className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-zinc-800 transition-colors">
                            <UploadIcon/>
                            <span>Upload an Image</span>
                            <span className="text-xs text-gray-500 mt-1">Click or Drag & Drop</span>
                         </label>
                    )}
                     <input id="file-upload-edit" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                </div>
                 <div className="w-full aspect-square bg-black border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {isLoading && <Spinner message="Editing your image..."/>}
                    {!isLoading && editedImage && (
                        <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                    )}
                    {!isLoading && !editedImage && (
                        <p className="text-gray-500">Your edited image will appear here</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Add a retro filter, make it black and white"
                    className="flex-grow bg-zinc-800 border border-zinc-700 text-white rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    disabled={isLoading || !originalImage}
                />
                <button
                    onClick={handleEdit}
                    disabled={isLoading || !originalImage}
                    className="bg-lime-400 text-black font-bold py-3 px-6 rounded-md hover:bg-lime-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isLoading ? 'Editing...' : 'Edit Image'}
                </button>
            </div>
            {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
    );
};

export default ImageEditor;