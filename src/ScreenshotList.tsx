import React from 'react';
import { Screenshot } from './App';
import { Eye, EyeOff } from 'lucide-react';

interface ScreenshotListProps {
  screenshots: Screenshot[];
  updateScreenshot: (id: string, updates: Partial<Screenshot>) => void;
  toggleVisibility: (id: string) => void;
  currentFrame: number;
}

export const ScreenshotList: React.FC<ScreenshotListProps> = ({
  screenshots,
  updateScreenshot,
  toggleVisibility,
  currentFrame,
}) => {
  return (
    <div className="space-y-6 mt-4">
      {screenshots.map((screenshot) => (
        <div key={screenshot.id} className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Screenshot {screenshot.id}</h3>
            <button
              onClick={() => toggleVisibility(screenshot.id)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              {screenshot.visible ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div className="relative w-full h-48 mb-4 bg-gray-200 rounded overflow-hidden">
            <img
              src={screenshot.url}
              alt="Screenshot Preview"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `
                  translate(-50%, -50%)
                  translate3d(${screenshot.position.x[0]?.value || 0}px, ${screenshot.position.y[0]?.value || 0}px, ${screenshot.position.z[0]?.value || 0}px)
                  rotateX(${screenshot.rotation.x[0]?.value || 0}deg)
                  rotateY(${screenshot.rotation.y[0]?.value || 0}deg)
                  rotateZ(${screenshot.rotation.z[0]?.value || 0}deg)
                  scale(${screenshot.scale[0]?.value || 1})
                `,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};