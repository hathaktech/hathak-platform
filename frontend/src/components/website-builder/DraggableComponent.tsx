'use client';

import { useDrag } from 'react-dnd';
import { 
  Trash2, 
  Copy, 
  Move, 
  ChevronUp,
  ChevronDown,
  GripVertical,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  MoreVertical,
  Resize
} from 'lucide-react';

interface DraggableComponentProps {
  component: any;
  isSelected: boolean;
  isHovered: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  style: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function DraggableComponent({
  component,
  isSelected,
  isHovered,
  isLocked,
  onSelect,
  onUpdate,
  onDelete,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  style,
  onMouseEnter,
  onMouseLeave
}: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-component',
    item: { id: component.id, type: 'canvas-component' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isLocked,
  }));

  const handleToggleVisibility = () => {
    onUpdate({ visible: !component.visible });
  };

  return (
    <div
      ref={drag}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : style.opacity,
      }}
      className={`group relative ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
        isHovered ? 'bg-blue-50' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Component Controls */}
      {(isSelected || isHovered) && (
        <div className="absolute -left-12 top-0 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete component"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Duplicate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Duplicate component"
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Lock/Unlock */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className={`p-1.5 rounded transition-colors ${
              isLocked 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
            title={isLocked ? 'Unlock component' : 'Lock component'}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>

          {/* Visibility Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleVisibility();
            }}
            className={`p-1.5 rounded transition-colors ${
              component.visible 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-400 text-white hover:bg-gray-500'
            }`}
            title={component.visible ? 'Hide component' : 'Show component'}
          >
            {component.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>

          {/* Move Up */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            title="Move up"
          >
            <ChevronUp className="w-3 h-3" />
          </button>

          {/* Move Down */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            title="Move down"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Component Content */}
      <div className="p-2">
        {renderComponentContent(component)}
      </div>

      {/* Drag Handle */}
      {isSelected && (
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Resize Handles */}
      {isSelected && !isLocked && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner resize handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize pointer-events-auto"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize pointer-events-auto"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize pointer-events-auto"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize pointer-events-auto"></div>
          
          {/* Edge resize handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize pointer-events-auto"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize pointer-events-auto"></div>
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize pointer-events-auto"></div>
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize pointer-events-auto"></div>
        </div>
      )}

      {/* Component Label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {component.label || component.type}
        </div>
      )}
    </div>
  );
}

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
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==';
          }}
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

