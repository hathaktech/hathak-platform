# HatHak Platform Design System

## Overview

The HatHak Platform Design System is a comprehensive, compact design system that ensures consistent spacing, typography, and component sizing across the entire platform. It's based on the compact sizing standards established by the cart page reference.

## Key Principles

1. **Compact Design**: Optimized for space efficiency while maintaining readability
2. **Consistency**: All components follow the same sizing standards
3. **Scalability**: Easy to maintain and extend across the platform
4. **Developer Experience**: Simple APIs for common design patterns

## Quick Start

### Using the Design System Hook

```tsx
import { useDesignSystem } from '@/hooks/useDesignSystem';

function MyComponent() {
  const ds = useDesignSystem();
  
  return (
    <div className={ds.getSpacing('container')}>
      <h1 className={ds.getTypography('h1')}>
        My Title
      </h1>
      <p className={ds.getTypography('description')}>
        My description text
      </p>
    </div>
  );
}
```

### Using Pre-configured Classes

```tsx
import { componentClasses } from '@/config/component-classes';

function MyComponent() {
  return (
    <div className={componentClasses.layout.mainContainer}>
      <h1 className={componentClasses.header.title}>
        My Title
      </h1>
      <button className={componentClasses.button.primary}>
        Click Me
      </button>
    </div>
  );
}
```

## Design Tokens

### Spacing

The design system uses a consistent spacing scale:

```typescript
// Layout spacing
container: 'space-y-4'    // Main container spacing
section: 'space-y-3'      // Section spacing
subsection: 'space-y-2'   // Subsection spacing
item: 'space-y-1'         // Item spacing

// Grid gaps
grid: {
  large: 'gap-4',         // Large grid gap
  medium: 'gap-3',        // Medium grid gap
  small: 'gap-2',         // Small grid gap
}
```

### Typography

Consistent typography scale for all text elements:

```typescript
typography: {
  h1: 'text-xl lg:text-2xl',    // Main titles
  h2: 'text-sm',                // Section titles
  h3: 'text-xs',                // Subsection titles
  body: 'text-xs',              // Body text
  small: 'text-xs',             // Small text
  label: 'text-xs',             // Form labels
  description: 'text-xs',       // Descriptions
}
```

### Icons

Standardized icon sizes:

```typescript
icons: {
  large: 'w-6 h-6',       // Large icons
  medium: 'w-4 h-4',      // Medium icons
  small: 'w-3 h-3',       // Small icons
  tiny: 'w-3 h-3',        // Tiny icons
}
```

### Padding & Margins

Consistent padding and margin scales:

```typescript
padding: {
  container: {
    large: 'p-4',         // Large container padding
    medium: 'p-3',        // Medium container padding
    small: 'p-2',         // Small container padding
  },
  button: {
    large: 'px-3 py-2',   // Large button padding
    medium: 'px-3 py-2',  // Medium button padding
    small: 'px-2 py-1',   // Small button padding
  }
}
```

## Component Patterns

### Headers

```tsx
import { componentClasses } from '@/config/component-classes';

function PageHeader({ title, description }) {
  return (
    <div className={componentClasses.header.container}>
      <h1 className={componentClasses.header.title}>
        {title}
      </h1>
      <p className={componentClasses.header.description}>
        {description}
      </p>
    </div>
  );
}
```

### Cards

```tsx
function InfoCard({ title, description, icon: Icon }) {
  return (
    <div className={componentClasses.card.base}>
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className={componentClasses.card.title}>
          {title}
        </h3>
      </div>
      <p className={componentClasses.card.description}>
        {description}
      </p>
    </div>
  );
}
```

### Buttons

```tsx
function ActionButton({ children, variant = 'primary', icon: Icon, ...props }) {
  const baseClasses = componentClasses.button[variant];
  const iconClasses = Icon ? 'flex items-center' : '';
  
  return (
    <button className={`${baseClasses} ${iconClasses}`} {...props}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </button>
  );
}
```

### Forms

```tsx
function FormField({ label, type = 'text', ...props }) {
  return (
    <div className="space-y-2">
      <label className={componentClasses.form.label}>
        {label}
      </label>
      <input
        type={type}
        className={componentClasses.form.input}
        {...props}
      />
    </div>
  );
}
```

### Tables

```tsx
function DataTable({ headers, data }) {
  return (
    <div className={componentClasses.table.container}>
      <table className={componentClasses.table.table}>
        <thead className={componentClasses.table.header}>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={componentClasses.table.headerCell}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={componentClasses.table.body}>
          {data.map((row, index) => (
            <tr key={index} className={componentClasses.table.bodyRow}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={componentClasses.table.bodyCell}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Empty States

```tsx
function EmptyState({ title, description, action, icon: Icon }) {
  return (
    <div className={componentClasses.emptyState.container}>
      <div className={componentClasses.emptyState.iconContainer}>
        <Icon className={componentClasses.emptyState.icon} />
      </div>
      <h3 className={componentClasses.emptyState.title}>
        {title}
      </h3>
      <p className={componentClasses.emptyState.description}>
        {description}
      </p>
      {action && (
        <button className={componentClasses.emptyState.button}>
          {action}
        </button>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ✅ Good
const ds = useDesignSystem();
<div className={ds.getSpacing('container')}>

// ❌ Bad
<div className="space-y-4">
```

### 2. Use Pre-configured Classes

Use component classes for common patterns:

```tsx
// ✅ Good
<button className={componentClasses.button.primary}>

// ❌ Bad
<button className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
```

### 3. Maintain Consistency

Follow the established patterns for similar components:

```tsx
// ✅ Good - Consistent with other cards
<div className="p-3 bg-white rounded-xl border border-gray-200 shadow-lg">
  <h3 className="text-sm font-semibold text-gray-900 mb-2">Title</h3>
  <p className="text-xs text-gray-600">Description</p>
</div>
```

### 4. Use Semantic Naming

Use semantic names that describe the purpose:

```tsx
// ✅ Good
<button className={componentClasses.button.primary}>

// ❌ Bad
<button className="px-3 py-2 text-xs bg-blue-600">
```

## Migration Guide

### From Hardcoded Classes

If you have existing components with hardcoded classes, migrate them to use the design system:

```tsx
// Before
<div className="space-y-6">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-lg text-gray-600">Description</p>
</div>

// After
<div className={ds.getSpacing('container')}>
  <h1 className={ds.getTypography('h1')}>Title</h1>
  <p className={ds.getTypography('description')}>Description</p>
</div>
```

### From Large Components

If you have components with large spacing, update them to use compact sizing:

```tsx
// Before
<div className="space-y-8 p-8">
  <h1 className="text-4xl">Title</h1>
  <p className="text-xl">Description</p>
</div>

// After
<div className="space-y-4 p-3">
  <h1 className="text-xl lg:text-2xl">Title</h1>
  <p className="text-xs">Description</p>
</div>
```

## Configuration

### Tailwind Configuration

To use the compact design system with Tailwind CSS, extend your configuration:

```javascript
// tailwind.config.js
import { extendTailwindConfig } from '@/config/tailwind-compact-config';

export default extendTailwindConfig({
  // Your existing config
});
```

### Customizing the Design System

You can customize the design system by modifying the configuration files:

```typescript
// src/config/design-tokens.ts
export const designTokens = {
  spacing: {
    container: 'space-y-3', // Customize spacing
  },
  // ... other tokens
};
```

## Examples

### Complete Page Example

```tsx
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { componentClasses } from '@/config/component-classes';

function MyPage() {
  const ds = useDesignSystem();
  
  return (
    <div className={componentClasses.layout.mainContainer}>
      {/* Header */}
      <div className={componentClasses.header.container}>
        <h1 className={componentClasses.header.title}>
          My Page Title
        </h1>
        <p className={componentClasses.header.description}>
          Page description goes here
        </p>
      </div>
      
      {/* Content */}
      <div className={ds.getSpacing('section')}>
        <div className={componentClasses.card.base}>
          <h2 className={componentClasses.card.title}>
            Card Title
          </h2>
          <p className={componentClasses.card.description}>
            Card description
          </p>
          <button className={componentClasses.button.primary}>
            Action
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Support

For questions or issues with the design system, please refer to:

1. This documentation
2. The design tokens file: `src/config/design-tokens.ts`
3. The component classes file: `src/config/component-classes.ts`
4. The design system configuration: `src/config/design-system.ts`

## Version History

- **v1.0.0**: Initial compact design system based on cart page reference
