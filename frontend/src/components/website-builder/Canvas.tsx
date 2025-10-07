'use client';

import { useDrop, useDrag } from 'react-dnd';
import { useState, useRef, useEffect, useCallback } from 'react';
import DraggableComponent from './DraggableComponent';
import { 
  Trash2, 
  Copy, 
  Move, 
  Edit3, 
  Eye, 
  EyeOff,
  ChevronUp,
  ChevronDown,
  GripVertical,
  RotateCcw,
  RotateCw,
  Layers,
  Lock,
  Unlock,
  MoreVertical,
  Resize,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

interface CanvasProps {
  components: any[];
  selectedComponent: any;
  onSelectComponent: (component: any) => void;
  onUpdateComponent: (id: number, updates: any) => void;
  onDeleteComponent: (id: number) => void;
  currentDevice: string;
}

export default function Canvas({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  currentDevice
}: CanvasProps) {
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState(null);
  const [showLayers, setShowLayers] = useState(false);
  const [lockedComponents, setLockedComponents] = useState(new Set());

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['component', 'canvas-component'],
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (clientOffset && canvasRect) {
        const relativeY = clientOffset.y - canvasRect.top;
        const insertIndex = Math.floor(relativeY / 50);
        
        if (item.type === 'canvas-component') {
          // Reordering existing component
          const draggedIndex = components.findIndex(comp => comp.id === item.id);
          if (draggedIndex !== -1) {
            const newComponents = [...components];
            const [draggedComponent] = newComponents.splice(draggedIndex, 1);
            newComponents.splice(insertIndex, 0, draggedComponent);
            onUpdateComponent(0, { components: newComponents });
          }
        } else {
          // Adding new component
          const newComponent = {
            id: Date.now(),
            type: item.type,
            label: item.label,
            props: getDefaultProps(item.type),
            position: { x: 0, y: 0 },
            styles: getDefaultStyles(item.type),
            children: [],
            locked: false,
            visible: true,
            zIndex: components.length
          };
          
          const newComponents = [...components];
          newComponents.splice(insertIndex, 0, newComponent);
          onUpdateComponent(0, { components: newComponents });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const canvasRef = useRef<HTMLDivElement>(null);

  const getDefaultProps = (type: string) => {
    const defaults = {
      text: { content: 'New Text', tag: 'p' },
      heading: { content: 'New Heading', level: 2 },
      button: { text: 'Click Me', variant: 'primary' },
      image: { src: '/placeholder.jpg', alt: 'Image' },
      container: { className: '', children: [] },
      card: { title: 'Card Title', content: 'Card content goes here' },
      'hero-section': { 
        title: 'Welcome to HatHak', 
        subtitle: 'Your trusted e-commerce platform',
        buttonText: 'Get Started'
      },
      'feature-grid': { 
        features: [
          { title: 'Feature 1', description: 'Description 1' },
          { title: 'Feature 2', description: 'Description 2' },
          { title: 'Feature 3', description: 'Description 3' }
        ]
      }
    };
    return defaults[type] || {};
  };

  const getDefaultStyles = (type: string) => {
    const defaults = {
      text: { fontSize: '16px', color: '#000000', textAlign: 'left' },
      heading: { fontSize: '24px', color: '#000000', fontWeight: 'bold' },
      button: { 
        backgroundColor: '#3B82F6', 
        color: '#FFFFFF', 
        padding: '8px 16px',
        borderRadius: '4px'
      },
      image: { width: '100%', height: 'auto' },
      container: { padding: '16px', backgroundColor: '#FFFFFF' },
      card: { 
        padding: '16px', 
        backgroundColor: '#FFFFFF', 
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    };
    return defaults[type] || {};
  };

  const renderComponent = (component: any, index: number) => {
    const isSelected = selectedComponent?.id === component.id;
    const isHovered = hoveredComponent === component.id;
    const isLocked = lockedComponents.has(component.id);

    const componentStyle = {
      ...component.styles,
      position: 'relative',
      minHeight: '40px',
      border: isSelected ? '2px solid #3B82F6' : '1px solid transparent',
      borderRadius: '4px',
      cursor: isLocked ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      opacity: component.visible ? 1 : 0.5,
      zIndex: component.zIndex || index
    };

    return (
      <DraggableComponent
        key={component.id}
        component={component}
        isSelected={isSelected}
        isHovered={isHovered}
        isLocked={isLocked}
        onSelect={() => onSelectComponent(component)}
        onUpdate={(updates) => onUpdateComponent(component.id, updates)}
        onDelete={() => onDeleteComponent(component.id)}
        onToggleLock={() => {
          const newLocked = new Set(lockedComponents);
          if (isLocked) {
            newLocked.delete(component.id);
          } else {
            newLocked.add(component.id);
          }
          setLockedComponents(newLocked);
        }}
        onMoveUp={() => {
          const newComponents = [...components];
          if (index > 0) {
            [newComponents[index], newComponents[index - 1]] = [newComponents[index - 1], newComponents[index]];
            onUpdateComponent(0, { components: newComponents });
          }
        }}
        onMoveDown={() => {
          const newComponents = [...components];
          if (index < components.length - 1) {
            [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
            onUpdateComponent(0, { components: newComponents });
          }
        }}
        onDuplicate={() => {
          const newComponent = {
            ...component,
            id: Date.now(),
            zIndex: components.length
          };
          const newComponents = [...components];
          newComponents.splice(index + 1, 0, newComponent);
          onUpdateComponent(0, { components: newComponents });
        }}
        style={componentStyle}
        onMouseEnter={() => setHoveredComponent(component.id)}
        onMouseLeave={() => setHoveredComponent(null)}
      />
    );
  };

  const renderComponentContent = (component: any) => {
    switch (component.type) {
      case 'text':
        return (
          <p style={component.styles}>
            {component.props.content || 'New Text'}
          </p>
        );
      
      case 'heading':
        const HeadingTag = `h${component.props.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={component.styles}>
            {component.props.content || 'New Heading'}
          </HeadingTag>
        );
      
      case 'button':
        return (
          <button style={component.styles}>
            {component.props.text || 'Click Me'}
          </button>
        );
      
      case 'image':
        return (
          <img
            src={component.props.src || '/placeholder.jpg'}
            alt={component.props.alt || 'Image'}
            style={component.styles}
          />
        );
      
      case 'container':
        return (
          <div style={component.styles}>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded">
              <p className="text-gray-500 text-center">Container</p>
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div style={component.styles}>
            <h3 className="font-semibold mb-2">{component.props.title}</h3>
            <p className="text-gray-600">{component.props.content}</p>
          </div>
        );
      
      case 'hero-section':
        return (
          <div style={component.styles} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{component.props.title}</h1>
            <p className="text-xl mb-6">{component.props.subtitle}</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
              {component.props.buttonText}
            </button>
          </div>
        );
      
      case 'feature-grid':
        return (
          <div style={component.styles} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props.features?.map((feature: any, index: number) => (
              <div key={index} className="text-center p-4">
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="p-4 border-2 border-dashed border-gray-300 rounded text-center">
            <p className="text-gray-500">{component.label || 'Component'}</p>
          </div>
        );
    }
  };

  const getDeviceStyles = () => {
    switch (currentDevice) {
      case 'mobile':
        return { maxWidth: '375px', margin: '0 auto' };
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' };
      default:
        return { maxWidth: '100%' };
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Canvas</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLayers(!showLayers)}
              className={`p-2 rounded-md transition-colors ${
                showLayers ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Toggle layers panel"
            >
              <Layers className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">
              {components.length} components
            </span>
            <div className="w-px h-4 bg-gray-300"></div>
            <span className="text-sm text-gray-500 capitalize">
              {currentDevice} view
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="flex gap-4 h-full">
          {/* Main Canvas */}
          <div className="flex-1">
            <div
              ref={drop}
              className={`min-h-full bg-white rounded-lg shadow-sm ${
                isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              style={getDeviceStyles()}
            >
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">+</span>
                    </div>
                    <p className="text-lg font-medium mb-2">Start Building</p>
                    <p className="text-sm">Drag components from the sidebar to get started</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {components.map((component, index) => (
                    <div key={component.id}>
                      {renderComponent(component, index)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Layers Panel */}
          {showLayers && (
            <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Layers</h3>
              </div>
              <div className="p-2 max-h-96 overflow-y-auto">
                {components.map((component, index) => (
                  <div
                    key={component.id}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedComponent?.id === component.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectComponent(component)}
                  >
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {component.label || component.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {component.visible ? 'Visible' : 'Hidden'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateComponent(component.id, { visible: !component.visible });
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {component.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteComponent(component.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
