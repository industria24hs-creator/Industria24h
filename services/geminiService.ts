
import { GoogleGenAI, Modality } from "@google/genai";

// FIX: Removed the conflicting global type declaration for `window.aistudio`.
// This resolves the error about subsequent declarations. The type is assumed
// to be declared globally elsewhere in the project.
export const generateImage = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key not found. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("Image generation failed or returned no images.");
};


export const editImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key not found. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imagePart = {
        inlineData: {
            data: image.data,
            mimeType: image.mimeType,
        },
    };
    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
    }
    throw new Error("Image editing failed or returned no image data.");
};


export const generateVideo = async (
    prompt: string,
    image: { data: string; mimeType: string },
    aspectRatio: '16:9' | '9:16',
    onProgress: (message: string) => void
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key not found. Please check your key selection.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    onProgress("Starting video generation... This can take a few minutes.");
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: image.data,
            mimeType: image.mimeType,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    });

    onProgress("Video generation in progress... Polling for results.");

    let pollCount = 0;
    const progressMessages = [
        "Analyzing the prompt and image...",
        "Storyboarding the scene...",
        "Rendering initial frames...",
        "Applying visual effects...",
        "Finalizing the video render...",
        "Almost there, preparing the video file..."
    ];

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        onProgress(progressMessages[pollCount % progressMessages.length]);
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch(e) {
            if(e instanceof Error && e.message.includes("Requested entity was not found.")){
                 throw new Error("API key is invalid. Please select a valid API key and try again.");
            }
            throw e; // re-throw other errors
        }
        pollCount++;
    }

    onProgress("Video generation complete! Fetching video...");

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation succeeded, but no download link was found.");
    }
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch video file: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};