import React, { useCallback } from 'react';
import { Screenshot } from './App';
import { Upload } from 'lucide-react';

interface ScreenshotUploaderProps {
  addScreenshot: (screenshot: Screenshot) => void;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({ addScreenshot }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newScreenshot: Screenshot = {
          id: Date.now().toString(),
          url: e.target?.result as string,
          position: { x: [{ frame: 0, value: 0 }], y: [{ frame: 0, value: 0 }], z: [{ frame: 0, value: 0 }] },
          rotation: { x: [{ frame: 0, value: 0 }], y: [{ frame: 0, value: 0 }], z: [{ frame: 0, value: 0 }] },
          scale: [{ frame: 0, value: 1 }],
          visible: true,
        };
        addScreenshot(newScreenshot);
      };
      reader.readAsDataURL(file);
    }
  }, [addScreenshot]);

  return (
    <div className="mt-4">
      <label htmlFor="screenshot-upload" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
        <Upload className="mr-2 h-5 w-5" />
        Upload Screenshot
      </label>
      <input
        id="screenshot-upload"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};