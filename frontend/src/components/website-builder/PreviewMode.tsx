'use client';

import { X, Smartphone, Tablet, Monitor, RotateCcw } from 'lucide-react';

interface PreviewModeProps {
  components: any[];
  currentDevice: string;
  onExit: () => void;
}

export default function PreviewMode({ components, currentDevice, onExit }: PreviewModeProps) {
  const getDeviceStyles = () => {
    switch (currentDevice) {
      case 'mobile':
        return { 
          maxWidth: '375px', 
          margin: '0 auto',
          minHeight: '667px',
          border: '8px solid #333',
          borderRadius: '20px',
          overflow: 'hidden'
        };
      case 'tablet':
        return { 
          maxWidth: '768px', 
          margin: '0 auto',
          minHeight: '1024px',
          border: '8px solid #333',
          borderRadius: '12px',
          overflow: 'hidden'
        };
      default:
        return { 
          maxWidth: '100%',
          minHeight: '100vh'
        };
    }
  };

  const renderComponent = (component: any) => {
    const componentStyle = {
      ...component.styles,
      position: 'relative'
    };

    switch (component.type) {
      case 'text':
        return (
          <p style={componentStyle}>
            {component.props.content || 'New Text'}
          </p>
        );
      
      case 'heading':
        const HeadingTag = `h${component.props.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={componentStyle}>
            {component.props.content || 'New Heading'}
          </HeadingTag>
        );
      
      case 'button':
        return (
          <button 
            style={componentStyle}
            onClick={() => console.log('Button clicked')}
          >
            {component.props.text || 'Click Me'}
          </button>
        );
      
      case 'image':
        return (
          <img
            src={component.props.src || '/placeholder.jpg'}
            alt={component.props.alt || 'Image'}
            style={componentStyle}
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        );
      
      case 'container':
        return (
          <div style={componentStyle}>
            {component.props.children?.map((child: any, index: number) => (
              <div key={index} className="p-2 border-2 border-dashed border-gray-300 rounded mb-2">
                <p className="text-gray-500 text-center text-sm">Container Item {index + 1}</p>
              </div>
            ))}
          </div>
        );
      
      case 'card':
        return (
          <div style={componentStyle}>
            <h3 className="font-semibold mb-2">{component.props.title}</h3>
            <p className="text-gray-600">{component.props.content}</p>
          </div>
        );
      
      case 'hero-section':
        return (
          <div style={componentStyle} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{component.props.title}</h1>
            <p className="text-xl mb-6">{component.props.subtitle}</p>
            <button 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={() => console.log('Hero CTA clicked')}
            >
              {component.props.buttonText}
            </button>
          </div>
        );
      
      case 'feature-grid':
        return (
          <div style={componentStyle} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.props.features?.map((feature: any, index: number) => (
              <div key={index} className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div style={componentStyle} className="p-4 border-2 border-dashed border-gray-300 rounded text-center">
            <p className="text-gray-500">{component.label || 'Component'}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Preview Mode</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button className={`p-2 rounded ${currentDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}>
                  <Smartphone className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded ${currentDevice === 'tablet' ? 'bg-white shadow-sm' : ''}`}>
                  <Tablet className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded ${currentDevice === 'desktop' ? 'bg-white shadow-sm' : ''}`}>
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExit}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow-sm" style={getDeviceStyles()}>
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium mb-2">No Components</p>
                <p className="text-sm">Add some components to see the preview</p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {components.map((component, index) => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

