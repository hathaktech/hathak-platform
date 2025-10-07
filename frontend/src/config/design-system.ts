/**
 * HatHak Platform Design System Configuration
 * Compact Design Standards - Based on cart page reference
 * 
 * This configuration file centralizes all design decisions and provides
 * a single source of truth for the platform's compact design system.
 */

import { designTokens } from './design-tokens';
import { componentClasses } from './component-classes';

export interface DesignSystemConfig {
  name: string;
  version: string;
  description: string;
  baseFontSize: string;
  compactMode: boolean;
  tokens: typeof designTokens;
  classes: typeof componentClasses;
}

export const designSystemConfig: DesignSystemConfig = {
  name: 'HatHak Compact Design System',
  version: '1.0.0',
  description: 'Compact design system optimized for space efficiency and consistent user experience across the HatHak platform',
  baseFontSize: '14px', // Base font size for compact design
  compactMode: true,    // Enable compact mode by default
  
  tokens: designTokens,
  classes: componentClasses,
};

// Design system utilities
export class DesignSystem {
  private config: DesignSystemConfig;

  constructor(config: DesignSystemConfig = designSystemConfig) {
    this.config = config;
  }

  /**
   * Get a design token value
   */
  getToken(category: keyof typeof designTokens, key: string): string {
    const categoryTokens = this.config.tokens[category] as any;
    return categoryTokens[key] || '';
  }

  /**
   * Get a component class
   */
  getClass(component: keyof typeof componentClasses, variant: string): string {
    const componentClass = this.config.classes[component] as any;
    return componentClass[variant] || '';
  }

  /**
   * Combine multiple classes
   */
  combineClasses(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
  }

  /**
   * Get spacing value
   */
  getSpacing(level: 'container' | 'section' | 'subsection' | 'item'): string {
    return this.getToken('spacing', level);
  }

  /**
   * Get typography class
   */
  getTypography(type: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'label' | 'description'): string {
    return this.getToken('typography', type);
  }

  /**
   * Get icon size class
   */
  getIconSize(size: 'large' | 'medium' | 'small' | 'tiny'): string {
    return this.getToken('icons', size);
  }

  /**
   * Get padding class
   */
  getPadding(type: 'container' | 'card' | 'button' | 'form', size: 'large' | 'medium' | 'small'): string {
    return this.getToken('padding', `${type}.${size}`);
  }

  /**
   * Get margin class
   */
  getMargin(type: 'vertical' | 'horizontal', size: 'large' | 'medium' | 'small' | 'tiny'): string {
    return this.getToken('margin', `${type}.${size}`);
  }

  /**
   * Check if compact mode is enabled
   */
  isCompactMode(): boolean {
    return this.config.compactMode;
  }

  /**
   * Get the design system configuration
   */
  getConfig(): DesignSystemConfig {
    return this.config;
  }
}

// Create a default instance
export const designSystem = new DesignSystem();

// Export commonly used utilities
export const {
  getToken,
  getClass,
  combineClasses,
  getSpacing,
  getTypography,
  getIconSize,
  getPadding,
  getMargin,
  isCompactMode,
  getConfig,
} = designSystem;

// Design system constants
export const DESIGN_SYSTEM_CONSTANTS = {
  // Breakpoints (matching Tailwind's default)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Color palette (matching the platform's theme)
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: {
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
  },

  // Animation durations
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Border radius values
  borderRadius: {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadow values
  shadows: {
    none: 'none',
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const;

export default designSystem;
