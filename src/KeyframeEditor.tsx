import React, { useState, useEffect } from 'react';
import { Screenshot, Keyframe } from './App';

interface KeyframeEditorProps {
  screenshots: Screenshot[];
  updateScreenshot: (id: string, updates: Partial<Screenshot>) => void;
  currentFrame: number;
  durationInFrames: number;
}

export const KeyframeEditor: React.FC<KeyframeEditorProps> = ({
  screenshots,
  updateScreenshot,
  currentFrame,
  durationInFrames,
}) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedSubProperty, setSelectedSubProperty] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProperty === 'position' || selectedProperty === 'rotation') {
      setSelectedSubProperty('x');
    } else {
      setSelectedSubProperty(null);
    }
  }, [selectedProperty]);

  const getKeyframes = (): Keyframe[] => {
    if (!selectedScreenshot || !selectedProperty) return [];
    const screenshot = screenshots.find(s => s.id === selectedScreenshot);
    if (!screenshot) return [];

    if (selectedProperty === 'position' || selectedProperty === 'rotation') {
      return screenshot[selectedProperty][selectedSubProperty as 'x' | 'y' | 'z'] || [];
    } else if (selectedProperty === 'scale') {
      return screenshot.scale || [];
    }
    return [];
  };

  const handleAddKeyframe = () => {
    if (!selectedScreenshot || !selectedProperty) return;
    const screenshot = screenshots.find(s => s.id === selectedScreenshot);
    if (!screenshot) return;

    const keyframes = getKeyframes();
    const newKeyframe: Keyframe = { frame: currentFrame, value: keyframes[keyframes.length - 1]?.value || 0 };
    const updatedKeyframes = [...keyframes, newKeyframe].sort((a, b) => a.frame - b.frame);

    let updates: Partial<Screenshot>;
    if (selectedProperty === 'position' || selectedProperty === 'rotation') {
      updates = {
        [selectedProperty]: {
          ...screenshot[selectedProperty],
          [selectedSubProperty as 'x' | 'y' | 'z']: updatedKeyframes,
        },
      };
    } else {
      updates = { [selectedProperty]: updatedKeyframes };
    }

    updateScreenshot(selectedScreenshot, updates);
  };

  const handleUpdateKeyframe = (index: number, field: 'frame' | 'value', newValue: number) => {
    if (!selectedScreenshot || !selectedProperty) return;
    const keyframes = getKeyframes();
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index] = { ...updatedKeyframes[index], [field]: newValue };

    let updates: Partial<Screenshot>;
    if (selectedProperty === 'position' || selectedProperty === 'rotation') {
      updates = {
        [selectedProperty]: {
          ...screenshots.find(s => s.id === selectedScreenshot)![selectedProperty],
          [selectedSubProperty as 'x' | 'y' | 'z']: updatedKeyframes,
        },
      };
    } else {
      updates = { [selectedProperty]: updatedKeyframes };
    }

    updateScreenshot(selectedScreenshot, updates);
  };

  const handleDeleteKeyframe = (index: number) => {
    if (!selectedScreenshot || !selectedProperty) return;
    const keyframes = getKeyframes();
    const updatedKeyframes = keyframes.filter((_, i) => i !== index);

    let updates: Partial<Screenshot>;
    if (selectedProperty === 'position' || selectedProperty === 'rotation') {
      updates = {
        [selectedProperty]: {
          ...screenshots.find(s => s.id === selectedScreenshot)![selectedProperty],
          [selectedSubProperty as 'x' | 'y' | 'z']: updatedKeyframes,
        },
      };
    } else {
      updates = { [selectedProperty]: updatedKeyframes };
    }

    updateScreenshot(selectedScreenshot, updates);
  };

  const renderKeyframeEditor = () => {
    const keyframes = getKeyframes();

    return (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">
          Keyframes for {selectedProperty} {selectedSubProperty ? `(${selectedSubProperty})` : ''}
        </h4>
        {keyframes.map((keyframe, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              value={keyframe.frame}
              onChange={(e) => handleUpdateKeyframe(index, 'frame', Number(e.target.value))}
              min={0}
              max={durationInFrames}
              className="w-20 px-2 py-1 border rounded"
            />
            <input
              type="range"
              value={keyframe.value}
              onChange={(e) => handleUpdateKeyframe(index, 'value', Number(e.target.value))}
              min={-1000}
              max={1000}
              step={1}
              className="flex-grow"
            />
            <input
              type="number"
              value={keyframe.value}
              onChange={(e) => handleUpdateKeyframe(index, 'value', Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded"
            />
            <button
              onClick={() => handleDeleteKeyframe(index)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={handleAddKeyframe}
          className="px-2 py-1 bg-green-500 text-white rounded"
        >
          Add Keyframe
        </button>
      </div>
    );
  };

  return (
    <div>
      <select
        value={selectedScreenshot || ''}
        onChange={(e) => setSelectedScreenshot(e.target.value)}
        className="w-full px-2 py-1 border rounded mb-2"
      >
        <option value="">Select a screenshot</option>
        {screenshots.map((screenshot) => (
          <option key={screenshot.id} value={screenshot.id}>
            Screenshot {screenshot.id}
          </option>
        ))}
      </select>
      {selectedScreenshot && (
        <select
          value={selectedProperty || ''}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2"
        >
          <option value="">Select a property</option>
          <option value="position">Position</option>
          <option value="rotation">Rotation</option>
          <option value="scale">Scale</option>
        </select>
      )}
      {selectedScreenshot && selectedProperty && (selectedProperty === 'position' || selectedProperty === 'rotation') && (
        <select
          value={selectedSubProperty || ''}
          onChange={(e) => setSelectedSubProperty(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-2"
        >
          <option value="x">X</option>
          <option value="y">Y</option>
          <option value="z">Z</option>
        </select>
      )}
      {selectedScreenshot && selectedProperty && renderKeyframeEditor()}
    </div>
  );
};