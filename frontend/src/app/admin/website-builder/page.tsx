'use client';

import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Download, 
  Upload,
  Settings,
  Palette,
  Type,
  Layout,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

// Import builder components
import ComponentLibrary from '@/components/website-builder/ComponentLibrary';
import Canvas from '@/components/website-builder/Canvas';
import PropertyPanel from '@/components/website-builder/PropertyPanel';
import PreviewMode from '@/components/website-builder/PreviewMode';
import ResponsiveControls from '@/components/website-builder/ResponsiveControls';
import Templates from '@/components/website-builder/Templates';

interface WebsiteBuilderProps {}

export default function WebsiteBuilderPage() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentDevice, setCurrentDevice] = useState('desktop');
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('components');

  const addComponent = useCallback((component) => {
    const newComponents = [...components, { ...component, id: Date.now() }];
    setComponents(newComponents);
    updateHistory(newComponents);
  }, [components]);

  const applyTemplate = useCallback((templateComponents) => {
    const newComponents = templateComponents.map((comp, index) => ({
      ...comp,
      id: Date.now() + index,
      zIndex: index
    }));
    setComponents(newComponents);
    updateHistory(newComponents);
  }, []);

  const updateComponent = useCallback((id, updates) => {
    const newComponents = components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    );
    setComponents(newComponents);
    updateHistory(newComponents);
  }, [components]);

  const deleteComponent = useCallback((id) => {
    const newComponents = components.filter(comp => comp.id !== id);
    setComponents(newComponents);
    updateHistory(newComponents);
  }, [components]);

  const updateHistory = (newComponents) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents([...history[historyIndex + 1]]);
    }
  };

  const saveDesign = () => {
    // Save design to backend
    console.log('Saving design:', components);
    // TODO: Implement save functionality
  };

  const exportDesign = () => {
    const dataStr = JSON.stringify(components, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'website-design.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importDesign = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedComponents = JSON.parse(e.target.result);
          setComponents(importedComponents);
          updateHistory(importedComponents);
        } catch (error) {
          console.error('Error importing design:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (isPreviewMode) {
    return (
      <PreviewMode 
        components={components}
        currentDevice={currentDevice}
        onExit={() => setIsPreviewMode(false)}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Website Builder</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ResponsiveControls 
                currentDevice={currentDevice}
                onDeviceChange={setCurrentDevice}
              />
              
              <button
                onClick={() => setIsPreviewMode(true)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              
              <button
                onClick={saveDesign}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportDesign}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                
                <label className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importDesign}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Library Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('components')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'components'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Components
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'templates'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Templates
                </button>
              </div>
            </div>
            {activeTab === 'components' ? (
              <ComponentLibrary />
            ) : (
              <Templates onApplyTemplate={applyTemplate} />
            )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <Canvas
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              currentDevice={currentDevice}
            />
          </div>

          {/* Property Panel */}
          <div className="w-80 bg-white border-l border-gray-200">
            <PropertyPanel
              selectedComponent={selectedComponent}
              onUpdateComponent={updateComponent}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
