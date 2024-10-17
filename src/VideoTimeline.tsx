import React from 'react';
import { Player } from '@remotion/player';

interface VideoTimelineProps {
  durationInFrames: number;
  playerRef: React.RefObject<Player>;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  durationInFrames,
  playerRef,
  currentFrame,
  setCurrentFrame,
}) => {
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const frame = Math.floor(percentage * durationInFrames);
    playerRef.current?.seekTo(frame);
    setCurrentFrame(frame);
  };

  return (
    <div className="space-y-2">
      <div
        className="h-8 bg-gray-200 rounded-full cursor-pointer relative"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{
            width: `${(currentFrame / durationInFrames) * 100}%`,
          }}
        />
      </div>
      <div className="text-sm text-gray-600">
        Frame: {currentFrame} / {durationInFrames}
      </div>
    </div>
  );
};