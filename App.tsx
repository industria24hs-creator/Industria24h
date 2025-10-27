
import React, { useState } from 'react';
import { AppTab } from './types';
import Header from './components/Header';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import VideoGenerator from './components/VideoGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.GENERATE_IMAGE);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.GENERATE_IMAGE:
        return <ImageGenerator />;
      case AppTab.EDIT_IMAGE:
        return <ImageEditor />;
      case AppTab.GENERATE_VIDEO:
        return <VideoGenerator />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-4 md:p-8">
            {renderContent()}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-600 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;