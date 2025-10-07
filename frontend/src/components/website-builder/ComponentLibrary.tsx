'use client';

import { useDrag } from 'react-dnd';
import { 
  Layout, 
  Type, 
  Image, 
  MousePointer, 
  ShoppingCart, 
  User, 
  Search,
  Menu,
  Star,
  Heart,
  Globe,
  MapPin,
  DollarSign,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  Mail,
  Phone,
  Clock,
  Truck,
  Shield,
  Award,
  Zap,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  FileText,
  Settings,
  Palette,
  Code,
  Database,
  Cloud,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Play,
  Link,
  Square,
  Circle,
  Quote,
  Upload,
  Loader
} from 'lucide-react';

const COMPONENT_TYPES = {
  LAYOUT: 'layout',
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  FORM: 'form',
  NAVIGATION: 'navigation',
  CARD: 'card',
  ICON: 'icon',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  CONTAINER: 'container',
  GRID: 'grid',
  FLEX: 'flex'
};

const ComponentItem = ({ type, icon: Icon, label, description, category }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, label, description },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 m-2 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ComponentCategory = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200">
      {title}
    </h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default function ComponentLibrary() {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {/* Layout Components */}
      <ComponentCategory title="Layout">
        <ComponentItem
          type={COMPONENT_TYPES.CONTAINER}
          icon={Layout}
          label="Container"
          description="Flexible container for content"
        />
        <ComponentItem
          type={COMPONENT_TYPES.GRID}
          icon={BarChart3}
          label="Grid"
          description="Responsive grid layout"
        />
        <ComponentItem
          type={COMPONENT_TYPES.FLEX}
          icon={Activity}
          label="Flexbox"
          description="Flexible box layout"
        />
        <ComponentItem
          type={COMPONENT_TYPES.DIVIDER}
          icon={Minus}
          label="Divider"
          description="Horizontal or vertical divider"
        />
        <ComponentItem
          type={COMPONENT_TYPES.SPACER}
          icon={Plus}
          label="Spacer"
          description="Add vertical or horizontal space"
        />
      </ComponentCategory>

      {/* Text Components */}
      <ComponentCategory title="Text & Typography">
        <ComponentItem
          type={COMPONENT_TYPES.TEXT}
          icon={Type}
          label="Text"
          description="Paragraph, heading, or label"
        />
        <ComponentItem
          type="heading"
          icon={Type}
          label="Heading"
          description="H1, H2, H3, H4, H5, H6"
        />
        <ComponentItem
          type="paragraph"
          icon={FileText}
          label="Paragraph"
          description="Body text content"
        />
        <ComponentItem
          type="quote"
          icon={Quote}
          label="Quote"
          description="Blockquote or testimonial"
        />
      </ComponentCategory>

      {/* Media Components */}
      <ComponentCategory title="Media">
        <ComponentItem
          type={COMPONENT_TYPES.IMAGE}
          icon={Image}
          label="Image"
          description="Photo, logo, or graphic"
        />
        <ComponentItem
          type="video"
          icon={Play}
          label="Video"
          description="Embedded video player"
        />
        <ComponentItem
          type="gallery"
          icon={Image}
          label="Gallery"
          description="Image carousel or grid"
        />
      </ComponentCategory>

      {/* Interactive Components */}
      <ComponentCategory title="Interactive">
        <ComponentItem
          type={COMPONENT_TYPES.BUTTON}
          icon={MousePointer}
          label="Button"
          description="Clickable button element"
        />
        <ComponentItem
          type="link"
          icon={Link}
          label="Link"
          description="Text or image link"
        />
        <ComponentItem
          type="dropdown"
          icon={ChevronDown}
          label="Dropdown"
          description="Select dropdown menu"
        />
        <ComponentItem
          type="modal"
          icon={Square}
          label="Modal"
          description="Popup dialog window"
        />
        <ComponentItem
          type="tabs"
          icon={Layout}
          label="Tabs"
          description="Tabbed content interface"
        />
        <ComponentItem
          type="accordion"
          icon={ChevronRight}
          label="Accordion"
          description="Collapsible content sections"
        />
      </ComponentCategory>

      {/* Form Components */}
      <ComponentCategory title="Forms">
        <ComponentItem
          type="input"
          icon={Type}
          label="Input"
          description="Text input field"
        />
        <ComponentItem
          type="textarea"
          icon={FileText}
          label="Textarea"
          description="Multi-line text input"
        />
        <ComponentItem
          type="select"
          icon={ChevronDown}
          label="Select"
          description="Dropdown selection"
        />
        <ComponentItem
          type="checkbox"
          icon={Check}
          label="Checkbox"
          description="Checkbox input"
        />
        <ComponentItem
          type="radio"
          icon={Circle}
          label="Radio"
          description="Radio button input"
        />
        <ComponentItem
          type="file"
          icon={Upload}
          label="File Upload"
          description="File input field"
        />
        <ComponentItem
          type="date"
          icon={Calendar}
          label="Date Picker"
          description="Date selection input"
        />
      </ComponentCategory>

      {/* Navigation Components */}
      <ComponentCategory title="Navigation">
        <ComponentItem
          type={COMPONENT_TYPES.NAVIGATION}
          icon={Menu}
          label="Navigation"
          description="Main navigation menu"
        />
        <ComponentItem
          type="breadcrumb"
          icon={ChevronRight}
          label="Breadcrumb"
          description="Navigation breadcrumb trail"
        />
        <ComponentItem
          type="pagination"
          icon={ChevronLeft}
          label="Pagination"
          description="Page navigation controls"
        />
        <ComponentItem
          type="sidebar"
          icon={Layout}
          label="Sidebar"
          description="Side navigation panel"
        />
      </ComponentCategory>

      {/* E-commerce Components */}
      <ComponentCategory title="E-commerce">
        <ComponentItem
          type="product-card"
          icon={ShoppingCart}
          label="Product Card"
          description="Product display card"
        />
        <ComponentItem
          type="price"
          icon={DollarSign}
          label="Price"
          description="Price display component"
        />
        <ComponentItem
          type="rating"
          icon={Star}
          label="Rating"
          description="Star rating display"
        />
        <ComponentItem
          type="add-to-cart"
          icon={ShoppingCart}
          label="Add to Cart"
          description="Add to cart button"
        />
        <ComponentItem
          type="wishlist"
          icon={Heart}
          label="Wishlist"
          description="Wishlist button"
        />
        <ComponentItem
          type="cart-icon"
          icon={ShoppingCart}
          label="Cart Icon"
          description="Shopping cart icon with count"
        />
      </ComponentCategory>

      {/* UI Components */}
      <ComponentCategory title="UI Elements">
        <ComponentItem
          type={COMPONENT_TYPES.CARD}
          icon={Square}
          label="Card"
          description="Content card container"
        />
        <ComponentItem
          type="badge"
          icon={Award}
          label="Badge"
          description="Status or category badge"
        />
        <ComponentItem
          type="alert"
          icon={AlertCircle}
          label="Alert"
          description="Notification or alert message"
        />
        <ComponentItem
          type="tooltip"
          icon={Info}
          label="Tooltip"
          description="Hover information tooltip"
        />
        <ComponentItem
          type="progress"
          icon={Activity}
          label="Progress Bar"
          description="Progress indicator"
        />
        <ComponentItem
          type="loading"
          icon={Loader}
          label="Loading"
          description="Loading spinner or skeleton"
        />
      </ComponentCategory>

      {/* Icons */}
      <ComponentCategory title="Icons">
        <ComponentItem
          type={COMPONENT_TYPES.ICON}
          icon={Star}
          label="Icon"
          description="Single icon element"
        />
        <ComponentItem
          type="icon-text"
          icon={Type}
          label="Icon + Text"
          description="Icon with text label"
        />
        <ComponentItem
          type="social-icons"
          icon={Users}
          label="Social Icons"
          description="Social media icon links"
        />
      </ComponentCategory>

      {/* HatHak Specific Components */}
      <ComponentCategory title="HatHak Platform">
        <ComponentItem
          type="hero-section"
          icon={Zap}
          label="Hero Section"
          description="Main banner with CTA"
        />
        <ComponentItem
          type="feature-grid"
          icon={Target}
          label="Feature Grid"
          description="Features showcase grid"
        />
        <ComponentItem
          type="testimonial"
          icon={Quote}
          label="Testimonial"
          description="Customer testimonial card"
        />
        <ComponentItem
          type="stats"
          icon={TrendingUp}
          label="Stats"
          description="Statistics counter"
        />
        <ComponentItem
          type="cta-section"
          icon={MousePointer}
          label="Call to Action"
          description="Action-oriented section"
        />
        <ComponentItem
          type="footer"
          icon={Layout}
          label="Footer"
          description="Site footer with links"
        />
      </ComponentCategory>
    </div>
  );
}
