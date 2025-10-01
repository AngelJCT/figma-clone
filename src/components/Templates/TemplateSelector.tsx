'use client';

import { useState } from 'react';
import { Template } from '@/types';
import { DESKTOP_TEMPLATES, TABLET_TEMPLATES, MOBILE_TEMPLATES } from '@/constants';
import { useCanvasStore } from '@/store/useCanvasStore';
import { generateId } from '@/utils';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateSelector({ isOpen, onClose }: TemplateSelectorProps) {
  const [activeTab, setActiveTab] = useState<'desktop' | 'tablet' | 'mobile' | 'custom'>('mobile');
  const [customWidth, setCustomWidth] = useState('1920');
  const [customHeight, setCustomHeight] = useState('1080');
  const [customName, setCustomName] = useState('Custom Artboard');
  const addArtboard = useCanvasStore((state) => state.addArtboard);
  const artboards = useCanvasStore((state) => state.artboards);

  if (!isOpen) return null;

  const handleSelectTemplate = (template: Template) => {
    const offset = artboards.length * 50;
    addArtboard({
      id: generateId(),
      name: template.name,
      templateId: template.id,
      position: { x: 50 + offset, y: 50 + offset },
      width: template.width,
      height: template.height,
      backgroundColor: '#ffffff',
      elements: [],
    });
    onClose();
  };

  const handleCreateCustom = () => {
    const width = parseInt(customWidth) || 1920;
    const height = parseInt(customHeight) || 1080;
    const offset = artboards.length * 50;

    addArtboard({
      id: generateId(),
      name: customName,
      templateId: 'custom',
      position: { x: 50 + offset, y: 50 + offset },
      width,
      height,
      backgroundColor: '#ffffff',
      elements: [],
    });
    onClose();
  };

  const renderTemplateCard = (template: Template) => (
    <button
      key={template.id}
      onClick={() => handleSelectTemplate(template)}
      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors text-left"
    >
      <div className="aspect-[3/4] bg-gray-800 rounded mb-3 flex items-center justify-center border border-gray-600">
        <div
          className="bg-white"
          style={{
            width: `${Math.min(80, (template.width / template.height) * 60)}px`,
            height: `${Math.min(80, (template.height / template.width) * 60)}px`,
          }}
        />
      </div>
      <div className="text-sm font-medium text-white mb-1">{template.name}</div>
      <div className="text-xs text-gray-400">
        {template.width} × {template.height}
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create New Artboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'mobile'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setActiveTab('tablet')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'tablet'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tablet
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'desktop'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'custom'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Custom Size
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'mobile' && (
            <div className="grid grid-cols-3 gap-4">
              {MOBILE_TEMPLATES.map(renderTemplateCard)}
            </div>
          )}

          {activeTab === 'tablet' && (
            <div className="grid grid-cols-3 gap-4">
              {TABLET_TEMPLATES.map(renderTemplateCard)}
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="grid grid-cols-3 gap-4">
              {DESKTOP_TEMPLATES.map(renderTemplateCard)}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="max-w-md">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Artboard Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="My Custom Artboard"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateCustom}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                Create Custom Artboard
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
