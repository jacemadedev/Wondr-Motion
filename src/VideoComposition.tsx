import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Screenshot, Keyframe } from './App';

interface VideoCompositionProps {
  screenshots: Screenshot[];
}

const interpolateKeyframes = (keyframes: Keyframe[], frame: number) => {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0].value;

  const sortedKeyframes = [...keyframes].sort((a, b) => a.frame - b.frame);
  const lastKeyframe = sortedKeyframes[sortedKeyframes.length - 1];

  if (frame >= lastKeyframe.frame) return lastKeyframe.value;

  const nextKeyframeIndex = sortedKeyframes.findIndex(kf => kf.frame > frame);
  const prevKeyframe = sortedKeyframes[nextKeyframeIndex - 1];
  const nextKeyframe = sortedKeyframes[nextKeyframeIndex];

  return interpolate(
    frame,
    [prevKeyframe.frame, nextKeyframe.frame],
    [prevKeyframe.value, nextKeyframe.value]
  );
};

export const VideoComposition: React.FC<VideoCompositionProps> = ({ screenshots }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-gray-800 flex items-center justify-center">
      <div className="text-white text-4xl font-bold">
        Frame: {frame} / {durationInFrames}
      </div>
      <div className="text-white text-2xl mt-4">
        Time: {(frame / fps).toFixed(2)}s / {(durationInFrames / fps).toFixed(2)}s
      </div>
      {screenshots.filter(s => s.visible).map((screenshot) => {
        const x = interpolateKeyframes(screenshot.position.x, frame);
        const y = interpolateKeyframes(screenshot.position.y, frame);
        const z = interpolateKeyframes(screenshot.position.z, frame);
        const rotateX = interpolateKeyframes(screenshot.rotation.x, frame);
        const rotateY = interpolateKeyframes(screenshot.rotation.y, frame);
        const rotateZ = interpolateKeyframes(screenshot.rotation.z, frame);
        const scale = interpolateKeyframes(screenshot.scale, frame);

        return (
          <img
            key={screenshot.id}
            src={screenshot.url}
            alt="Screenshot"
            style={{
              position: 'absolute',
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};