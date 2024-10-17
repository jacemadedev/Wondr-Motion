import React, { useState, useCallback, useRef } from 'react';
import { Player } from '@remotion/player';
import { VideoComposition } from './VideoComposition';
import { VideoControls } from './VideoControls';
import { VideoTimeline } from './VideoTimeline';
import { ScreenshotUploader } from './ScreenshotUploader';
import { ScreenshotList } from './ScreenshotList';
import { KeyframeEditor } from './KeyframeEditor';
import { Film, Settings, Image, Play, Undo, Redo } from 'lucide-react';

export interface Keyframe {
  frame: number;
  value: number;
}

export interface Screenshot {
  id: string;
  url: string;
  position: {
    x: Keyframe[];
    y: Keyframe[];
    z: Keyframe[];
  };
  rotation: {
    x: Keyframe[];
    y: Keyframe[];
    z: Keyframe[];
  };
  scale: Keyframe[];
  visible: boolean;
}

function App() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [durationInFrames, setDurationInFrames] = useState(300);
  const [fps, setFps] = useState(30);
  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef<Player>(null);

  const addScreenshot = useCallback((screenshot: Screenshot) => {
    setScreenshots(prev => [...prev, screenshot]);
  }, []);

  const updateScreenshot = useCallback((id: string, updates: Partial<Screenshot>) => {
    setScreenshots(prev =>
      prev.map(screenshot =>
        screenshot.id === id ? { ...screenshot, ...updates } : screenshot
      )
    );
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setScreenshots(prev =>
      prev.map(screenshot =>
        screenshot.id === id ? { ...screenshot, visible: !screenshot.visible } : screenshot
      )
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Film className="mr-2" /> Video Studio
          </h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
              <Settings className="mr-2" /> Settings
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center">
              <Play className="mr-2" /> Export
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Player
              ref={playerRef}
              component={VideoComposition}
              durationInFrames={durationInFrames}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={fps}
              style={{ width: '100%' }}
              controls
              inputProps={{ screenshots }}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Video Controls</h2>
            <VideoControls
              durationInFrames={durationInFrames}
              setDurationInFrames={setDurationInFrames}
              fps={fps}
              setFps={setFps}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>
            <VideoTimeline
              durationInFrames={durationInFrames}
              playerRef={playerRef}
              currentFrame={currentFrame}
              setCurrentFrame={setCurrentFrame}
            />
          </div>
        </div>

        <div className="lg:w-1/3 space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
            <ScreenshotUploader addScreenshot={addScreenshot} />
            <ScreenshotList
              screenshots={screenshots}
              updateScreenshot={updateScreenshot}
              toggleVisibility={toggleVisibility}
              currentFrame={currentFrame}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Keyframe Editor</h2>
            <KeyframeEditor
              screenshots={screenshots}
              updateScreenshot={updateScreenshot}
              currentFrame={currentFrame}
              durationInFrames={durationInFrames}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;