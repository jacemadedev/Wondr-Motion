import React from 'react';

interface VideoControlsProps {
  durationInFrames: number;
  setDurationInFrames: (duration: number) => void;
  fps: number;
  setFps: (fps: number) => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  durationInFrames,
  setDurationInFrames,
  fps,
  setFps,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (frames)
        </label>
        <input
          type="number"
          id="duration"
          value={durationInFrames}
          onChange={(e) => setDurationInFrames(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="fps" className="block text-sm font-medium text-gray-700">
          FPS
        </label>
        <input
          type="number"
          id="fps"
          value={fps}
          onChange={(e) => setFps(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  );
};