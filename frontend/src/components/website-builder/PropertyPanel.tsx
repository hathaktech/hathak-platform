'use client';

import { useState } from 'react';
import { 
  Type, 
  Palette, 
  Layout, 
  Settings, 
  Eye, 
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Square,
  Circle,
  Triangle,
  Zap
} from 'lucide-react';

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdateComponent: (id: number, updates: any) => void;
}

export default function PropertyPanel({ selectedComponent, onUpdateComponent }: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState('content');

  if (!selectedComponent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No Component Selected</p>
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (property: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      styles: {
        ...selectedComponent.styles,
        [property]: value
      }
    });
  };

  const handlePropChange = (property: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [property]: value
      }
    });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'animation', label: 'Animation', icon: Zap },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ];

  const renderContentTab = () => {
    switch (selectedComponent.type) {
      case 'text':
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={selectedComponent.props.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            {selectedComponent.type === 'heading' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading Level
                </label>
                <select
                  value={selectedComponent.props.level || 2}
                  onChange={(e) => handlePropChange('level', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                  <option value={4}>H4</option>
                  <option value={5}>H5</option>
                  <option value={6}>H6</option>
                </select>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={selectedComponent.props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <select
                value={selectedComponent.props.variant || 'primary'}
                onChange={(e) => handlePropChange('variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={selectedComponent.props.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                value={selectedComponent.props.alt || ''}
                onChange={(e) => handlePropChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the image"
              />
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Title
              </label>
              <input
                type="text"
                value={selectedComponent.props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Content
              </label>
              <textarea
                value={selectedComponent.props.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <Settings className="w-8 h-8 mx-auto mb-2" />
            <p>No content properties available for this component</p>
          </div>
        );
    }
  };

  const renderStyleTab = () => (
    <div className="space-y-4">
      {/* Typography */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Typography</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Size</label>
            <input
              type="text"
              value={selectedComponent.styles?.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="16px"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
            <select
              value={selectedComponent.styles?.fontWeight || ''}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Light</option>
              <option value="bolder">Bolder</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Align</label>
            <div className="flex space-x-1">
              <button
                onClick={() => handleStyleChange('textAlign', 'left')}
                className={`p-1 rounded ${selectedComponent.styles?.textAlign === 'left' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStyleChange('textAlign', 'center')}
                className={`p-1 rounded ${selectedComponent.styles?.textAlign === 'center' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStyleChange('textAlign', 'right')}
                className={`p-1 rounded ${selectedComponent.styles?.textAlign === 'right' ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
            <input
              type="color"
              value={selectedComponent.styles?.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-full h-8 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Background Color</label>
            <input
              type="color"
              value={selectedComponent.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-full h-8 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Spacing</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Padding</label>
            <input
              type="text"
              value={selectedComponent.styles?.padding || ''}
              onChange={(e) => handleStyleChange('padding', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="16px"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Margin</label>
            <input
              type="text"
              value={selectedComponent.styles?.margin || ''}
              onChange={(e) => handleStyleChange('margin', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="8px"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensions</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Width</label>
            <input
              type="text"
              value={selectedComponent.styles?.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="100%"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Height</label>
            <input
              type="text"
              value={selectedComponent.styles?.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="auto"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Border</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
            <input
              type="text"
              value={selectedComponent.styles?.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="4px"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Width</label>
            <input
              type="text"
              value={selectedComponent.styles?.borderWidth || ''}
              onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="1px"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnimationTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Transitions</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Transition Duration</label>
            <input
              type="text"
              value={selectedComponent.styles?.transitionDuration || ''}
              onChange={(e) => handleStyleChange('transitionDuration', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0.3s"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Transition Property</label>
            <select
              value={selectedComponent.styles?.transitionProperty || ''}
              onChange={(e) => handleStyleChange('transitionProperty', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="all">All</option>
              <option value="opacity">Opacity</option>
              <option value="transform">Transform</option>
              <option value="background-color">Background Color</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Hover Effects</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Hover Transform</label>
            <select
              value={selectedComponent.styles?.hoverTransform || ''}
              onChange={(e) => handleStyleChange('hoverTransform', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">None</option>
              <option value="scale(1.05)">Scale Up</option>
              <option value="scale(0.95)">Scale Down</option>
              <option value="translateY(-5px)">Move Up</option>
              <option value="rotate(5deg)">Rotate</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CSS Classes
        </label>
        <input
          type="text"
          value={selectedComponent.props?.className || ''}
          onChange={(e) => handlePropChange('className', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="custom-class another-class"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom CSS
        </label>
        <textarea
          value={selectedComponent.props?.customCSS || ''}
          onChange={(e) => handlePropChange('customCSS', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="/* Custom CSS styles */"
        />
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Properties</h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedComponent.label || selectedComponent.type}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'style' && renderStyleTab()}
        {activeTab === 'layout' && renderLayoutTab()}
        {activeTab === 'animation' && renderAnimationTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
      </div>
    </div>
  );
}
