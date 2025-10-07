/**
 * Design System Configuration - Main Export
 * 
 * This file provides a single entry point for all design system
 * configurations and utilities.
 */

// Core configuration files
export { designTokens, componentConfigs } from './design-tokens';
export { componentClasses, combineClasses, getComponentClass } from './component-classes';
export { 
  designSystemConfig, 
  DesignSystem, 
  designSystem,
  getToken,
  getClass,
  combineClasses as dsCombineClasses,
  getSpacing,
  getTypography,
  getIconSize,
  getPadding,
  getMargin,
  isCompactMode,
  getConfig,
  DESIGN_SYSTEM_CONSTANTS
} from './design-system';

// React hooks
export { useDesignSystem, useComponentClasses } from '../hooks/useDesignSystem';

// Tailwind configuration
export { 
  compactConfig, 
  extendTailwindConfig, 
  createCompactTailwindConfig 
} from './tailwind-compact-config';

// Re-export commonly used utilities for convenience
export const ds = {
  // Design system instance
  instance: designSystem,
  
  // Quick access to common patterns
  layout: {
    mainContainer: 'space-y-4 max-w-7xl mx-auto',
    section: 'space-y-3',
    subsection: 'space-y-2',
    item: 'space-y-1',
  },
  
  typography: {
    h1: 'text-xl lg:text-2xl',
    h2: 'text-sm',
    h3: 'text-xs',
    body: 'text-xs',
    description: 'text-xs',
  },
  
  spacing: {
    container: 'space-y-4',
    section: 'space-y-3',
    subsection: 'space-y-2',
    item: 'space-y-1',
  },
  
  icons: {
    large: 'w-6 h-6',
    medium: 'w-4 h-4',
    small: 'w-3 h-3',
    tiny: 'w-3 h-3',
  },
  
  padding: {
    container: 'p-3',
    card: 'p-3',
    button: 'px-3 py-2',
    form: 'px-3 py-2',
  },
  
  // Quick class combinations
  classes: {
    // Headers
    pageTitle: 'text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent',
    sectionTitle: 'text-sm font-semibold text-gray-900',
    cardTitle: 'text-sm font-semibold text-gray-900',
    
    // Buttons
    primaryButton: 'px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium',
    secondaryButton: 'px-3 py-2 text-xs bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium',
    iconButton: 'p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors',
    
    // Cards
    card: 'p-3 bg-white rounded-xl border border-gray-200 shadow-lg',
    cardHover: 'p-3 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200',
    
    // Forms
    formLabel: 'text-xs font-medium text-gray-700',
    formInput: 'px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    
    // Badges
    statusBadge: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
    statusActive: 'text-green-700 bg-green-100',
    statusPending: 'text-yellow-700 bg-yellow-100',
    statusCompleted: 'text-green-700 bg-green-100',
    statusFailed: 'text-red-700 bg-red-100',
    
    // Tables
    tableContainer: 'bg-white rounded-xl border border-gray-200 overflow-hidden',
    tableHeader: 'px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    tableCell: 'px-3 py-3 text-xs text-gray-900',
    
    // Empty states
    emptyState: 'text-center py-6',
    emptyStateIcon: 'w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3',
    emptyStateTitle: 'text-sm font-semibold text-gray-900 mb-2',
    emptyStateDescription: 'text-xs text-gray-600 mb-3',
    emptyStateButton: 'px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
  }
};

// Default export for convenience
export default {
  tokens: designTokens,
  classes: componentClasses,
  system: designSystem,
  ds,
  constants: DESIGN_SYSTEM_CONSTANTS,
};
