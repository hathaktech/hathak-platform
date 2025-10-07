/**
 * useDesignSystem Hook
 * 
 * React hook that provides easy access to the design system
 * configuration and utilities within components.
 */

import { useMemo } from 'react';
import { designSystem, DesignSystem } from '../config/design-system';

export interface UseDesignSystemReturn {
  // Core utilities
  getToken: (category: string, key: string) => string;
  getClass: (component: string, variant: string) => string;
  combineClasses: (...classes: (string | undefined)[]) => string;
  
  // Specific utilities
  getSpacing: (level: 'container' | 'section' | 'subsection' | 'item') => string;
  getTypography: (type: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'label' | 'description') => string;
  getIconSize: (size: 'large' | 'medium' | 'small' | 'tiny') => string;
  getPadding: (type: 'container' | 'card' | 'button' | 'form', size: 'large' | 'medium' | 'small') => string;
  getMargin: (type: 'vertical' | 'horizontal', size: 'large' | 'medium' | 'small' | 'tiny') => string;
  
  // Configuration
  isCompactMode: () => boolean;
  getConfig: () => any;
  
  // Design system instance
  ds: DesignSystem;
}

/**
 * Hook to access the design system
 */
export const useDesignSystem = (): UseDesignSystemReturn => {
  return useMemo(() => ({
    getToken: designSystem.getToken.bind(designSystem),
    getClass: designSystem.getClass.bind(designSystem),
    combineClasses: designSystem.combineClasses.bind(designSystem),
    getSpacing: designSystem.getSpacing.bind(designSystem),
    getTypography: designSystem.getTypography.bind(designSystem),
    getIconSize: designSystem.getIconSize.bind(designSystem),
    getPadding: designSystem.getPadding.bind(designSystem),
    getMargin: designSystem.getMargin.bind(designSystem),
    isCompactMode: designSystem.isCompactMode.bind(designSystem),
    getConfig: designSystem.getConfig.bind(designSystem),
    ds: designSystem,
  }), []);
};

/**
 * Hook for getting common component classes
 */
export const useComponentClasses = () => {
  const ds = useDesignSystem();
  
  return useMemo(() => ({
    // Layout classes
    mainContainer: ds.combineClasses(
      ds.getSpacing('container'),
      'max-w-7xl mx-auto'
    ),
    
    // Header classes
    headerTitle: ds.combineClasses(
      ds.getTypography('h1'),
      'font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent'
    ),
    headerDescription: ds.combineClasses(
      ds.getTypography('description'),
      'text-neutral-700 max-w-3xl mx-auto mt-0.5'
    ),
    
    // Button classes
    primaryButton: ds.combineClasses(
      ds.getPadding('button', 'medium'),
      'bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium',
      ds.getTypography('body')
    ),
    secondaryButton: ds.combineClasses(
      ds.getPadding('button', 'medium'),
      'bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium',
      ds.getTypography('body')
    ),
    
    // Card classes
    card: ds.combineClasses(
      ds.getPadding('card', 'medium'),
      'bg-white rounded-xl border border-gray-200 shadow-lg'
    ),
    cardTitle: ds.combineClasses(
      ds.getTypography('h2'),
      'font-semibold text-gray-900'
    ),
    cardDescription: ds.combineClasses(
      ds.getTypography('description'),
      'text-gray-600'
    ),
    
    // Form classes
    formLabel: ds.combineClasses(
      ds.getTypography('label'),
      'font-medium text-gray-700'
    ),
    formInput: ds.combineClasses(
      ds.getPadding('form', 'medium'),
      'border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      ds.getTypography('body')
    ),
    
    // Icon classes
    iconButton: ds.combineClasses(
      'p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors'
    ),
    
    // Badge classes
    statusBadge: (status: string) => {
      const baseClasses = ds.combineClasses(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        ds.getIconSize('small'),
        'mr-1'
      );
      
      const statusColors = {
        active: 'text-green-700 bg-green-100',
        pending: 'text-yellow-700 bg-yellow-100',
        completed: 'text-green-700 bg-green-100',
        failed: 'text-red-700 bg-red-100',
        cancelled: 'text-gray-700 bg-gray-100',
      };
      
      return ds.combineClasses(baseClasses, statusColors[status as keyof typeof statusColors] || statusColors.cancelled);
    },
  }), [ds]);
};

export default useDesignSystem;
