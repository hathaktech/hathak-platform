'use client';

import { useState } from 'react';
import { 
  Layout, 
  ShoppingCart, 
  Users, 
  Star, 
  Zap,
  ArrowRight,
  Check,
  Download,
  Eye,
  X
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  components: any[];
  preview: string;
}

const templates: Template[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Modern landing page with hero section and features',
    category: 'Marketing',
    thumbnail: '/templates/landing.jpg',
    preview: '/templates/landing-preview.jpg',
    components: [
      {
        id: 1,
        type: 'hero-section',
        label: 'Hero Section',
        props: {
          title: 'Welcome to HatHak',
          subtitle: 'Your trusted e-commerce platform for global shopping',
          buttonText: 'Get Started'
        },
        styles: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 2,
        type: 'feature-grid',
        label: 'Features',
        props: {
          features: [
            { title: 'Global Shipping', description: 'Ship to anywhere in the world' },
            { title: 'Secure Payments', description: 'Safe and encrypted transactions' },
            { title: '24/7 Support', description: 'Round-the-clock customer service' }
          ]
        },
        styles: {
          padding: '60px 20px',
          backgroundColor: '#f8fafc'
        }
      }
    ]
  },
  {
    id: 'ecommerce-home',
    name: 'E-commerce Home',
    description: 'Complete e-commerce homepage with products and categories',
    category: 'E-commerce',
    thumbnail: '/templates/ecommerce.jpg',
    preview: '/templates/ecommerce-preview.jpg',
    components: [
      {
        id: 1,
        type: 'hero-section',
        label: 'Hero Banner',
        props: {
          title: 'Shop the Latest Trends',
          subtitle: 'Discover amazing products at unbeatable prices',
          buttonText: 'Shop Now'
        },
        styles: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          padding: '100px 20px',
          textAlign: 'center'
        }
      },
      {
        id: 2,
        type: 'feature-grid',
        label: 'Product Categories',
        props: {
          features: [
            { title: 'Electronics', description: 'Latest gadgets and devices' },
            { title: 'Fashion', description: 'Trendy clothing and accessories' },
            { title: 'Home & Garden', description: 'Everything for your home' }
          ]
        },
        styles: {
          padding: '80px 20px',
          backgroundColor: 'white'
        }
      }
    ]
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Professional portfolio showcase',
    category: 'Portfolio',
    thumbnail: '/templates/portfolio.jpg',
    preview: '/templates/portfolio-preview.jpg',
    components: [
      {
        id: 1,
        type: 'hero-section',
        label: 'Hero Section',
        props: {
          title: 'John Doe',
          subtitle: 'Creative Designer & Developer',
          buttonText: 'View My Work'
        },
        styles: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '120px 20px',
          textAlign: 'center'
        }
      }
    ]
  },
  {
    id: 'blog-home',
    name: 'Blog Homepage',
    description: 'Clean blog layout with featured posts',
    category: 'Blog',
    thumbnail: '/templates/blog.jpg',
    preview: '/templates/blog-preview.jpg',
    components: [
      {
        id: 1,
        type: 'hero-section',
        label: 'Blog Header',
        props: {
          title: 'My Blog',
          subtitle: 'Thoughts, ideas, and insights',
          buttonText: 'Read More'
        },
        styles: {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '80px 20px',
          textAlign: 'center'
        }
      }
    ]
  }
];

interface TemplatesProps {
  onApplyTemplate: (components: any[]) => void;
}

export default function Templates({ onApplyTemplate }: TemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleApplyTemplate = (template: Template) => {
    onApplyTemplate(template.components);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Templates</h2>
        <p className="text-sm text-gray-500 mt-1">Choose a pre-built template to get started</p>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Template Thumbnail */}
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Layout className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="p-1.5 bg-white bg-opacity-20 rounded text-white hover:bg-opacity-30 transition-colors"
                    title="Preview template"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleApplyTemplate(template)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use Template
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Layout className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Template Preview</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleApplyTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Use This Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
