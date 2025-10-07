/**
 * Design Tokens for HatHak Platform
 * Compact Design System - Based on cart page reference
 * 
 * These tokens define the compact sizing standards used throughout the platform
 * to ensure consistent, space-efficient design across all components.
 */

export const designTokens = {
  // Spacing Scale (based on compact design)
  spacing: {
    // Layout spacing
    container: 'space-y-4',           // Main container spacing (was space-y-6)
    section: 'space-y-3',             // Section spacing (was space-y-4)
    subsection: 'space-y-2',          // Subsection spacing (was space-y-3)
    item: 'space-y-1',                // Item spacing (was space-y-2)
    
    // Grid gaps
    grid: {
      large: 'gap-4',                 // Large grid gap (was gap-6)
      medium: 'gap-3',                // Medium grid gap (was gap-4)
      small: 'gap-2',                 // Small grid gap (was gap-3)
    },
    
    // Element spacing
    element: {
      large: 'space-x-3',             // Large horizontal spacing (was space-x-4)
      medium: 'space-x-2',            // Medium horizontal spacing (was space-x-3)
      small: 'space-x-1',             // Small horizontal spacing (was space-x-2)
    }
  },

  // Typography Scale
  typography: {
    // Headings
    h1: 'text-xl lg:text-2xl',        // Main title (was text-2xl)
    h2: 'text-sm',                    // Section title (was text-lg)
    h3: 'text-xs',                    // Subsection title (was text-sm)
    h4: 'text-xs',                    // Component title (was text-sm)
    
    // Body text
    body: 'text-xs',                  // Body text (was text-sm)
    small: 'text-xs',                 // Small text (was text-sm)
    label: 'text-xs',                 // Form labels (was text-sm)
    description: 'text-xs',           // Descriptions (was text-gray-600)
    
    // Special cases
    balance: 'text-lg',               // Balance amounts (was text-2xl)
    price: 'text-lg',                 // Price display (was text-2xl)
    stats: 'text-lg',                 // Stats values (was text-xl)
  },

  // Icon Sizes
  icons: {
    large: 'w-6 h-6',                 // Large icons (was w-8 h-8)
    medium: 'w-4 h-4',                // Medium icons (was w-5 h-5)
    small: 'w-3 h-3',                 // Small icons (was w-4 h-4)
    tiny: 'w-3 h-3',                  // Tiny icons (was w-4 h-4)
    
    // Container sizes
    container: {
      large: 'w-8 h-8',               // Large icon containers (was w-10 h-10)
      medium: 'w-6 h-6',              // Medium icon containers (was w-8 h-8)
      small: 'w-5 h-5',               // Small icon containers (was w-6 h-6)
    }
  },

  // Padding Scale
  padding: {
    // Container padding
    container: {
      large: 'p-4',                   // Large container padding (was p-8)
      medium: 'p-3',                  // Medium container padding (was p-6)
      small: 'p-2',                   // Small container padding (was p-4)
    },
    
    // Card padding
    card: {
      large: 'p-3',                   // Large card padding (was p-6)
      medium: 'p-3',                  // Medium card padding (was p-4)
      small: 'p-2',                   // Small card padding (was p-3)
    },
    
    // Button padding
    button: {
      large: 'px-3 py-2',             // Large button padding (was px-6 py-3)
      medium: 'px-3 py-2',            // Medium button padding (was px-4 py-2)
      small: 'px-2 py-1',             // Small button padding (was px-3 py-1)
      icon: 'p-1.5',                  // Icon button padding (was p-2)
    },
    
    // Form padding
    form: {
      input: 'px-3 py-2',             // Input padding (was px-4 py-2)
      select: 'px-3 py-2',            // Select padding (was px-4 py-2)
      textarea: 'px-3 py-2',          // Textarea padding (was px-4 py-2)
    }
  },

  // Margin Scale
  margin: {
    // Vertical margins
    vertical: {
      large: 'mb-3',                  // Large vertical margin (was mb-6)
      medium: 'mb-2',                 // Medium vertical margin (was mb-4)
      small: 'mb-1',                  // Small vertical margin (was mb-2)
      tiny: 'mt-0.5',                 // Tiny margin (was mt-1)
    },
    
    // Horizontal margins
    horizontal: {
      large: 'mr-3',                  // Large horizontal margin (was mr-4)
      medium: 'mr-2',                 // Medium horizontal margin (was mr-3)
      small: 'mr-1',                  // Small horizontal margin (was mr-2)
    }
  },

  // Border Radius
  borderRadius: {
    large: 'rounded-xl',              // Large border radius (was rounded-2xl)
    medium: 'rounded-lg',             // Medium border radius (was rounded-xl)
    small: 'rounded-lg',              // Small border radius (was rounded-lg)
  },

  // Badge Sizes
  badges: {
    padding: 'px-2 py-0.5',           // Badge padding (was px-2.5 py-0.5)
    text: 'text-xs',                  // Badge text size (was text-xs)
    icon: 'w-3 h-3',                  // Badge icon size (was w-3 h-3)
  },

  // Table Sizes
  table: {
    header: {
      padding: 'px-3 py-2',           // Header cell padding (was px-6 py-3)
      text: 'text-xs',                // Header text size (was text-xs)
    },
    body: {
      padding: 'px-3 py-3',           // Body cell padding (was px-6 py-4)
      text: 'text-xs',                // Body text size (was text-sm)
    }
  },

  // Empty State Sizes
  emptyState: {
    padding: 'py-6',                  // Empty state padding (was py-12)
    iconContainer: 'w-16 h-16',       // Icon container (was w-24 h-24)
    icon: 'w-8 h-8',                  // Icon size (was w-12 h-12)
    title: 'text-sm',                 // Title size (was text-xl)
    description: 'text-xs',           // Description size (was text-gray-600)
    button: 'px-3 py-2 text-xs',      // Button size (was px-6 py-2)
  },

  // Tab Navigation
  tabs: {
    padding: 'px-3 py-2',             // Tab padding (was px-4 py-2)
    text: 'text-xs',                  // Tab text (was default)
    icon: 'w-3 h-3',                  // Tab icon (was w-4 h-4)
    iconMargin: 'mr-1',               // Tab icon margin (was mr-2)
  },

  // Status Icons
  statusIcons: {
    size: 'w-4 h-4',                  // Status icon size (was w-5 h-5)
    margin: 'mr-1',                   // Status icon margin (was mr-1)
  }
} as const;

// Component-specific configurations
export const componentConfigs = {
  // Header configurations
  header: {
    title: 'text-xl lg:text-2xl',
    description: 'text-xs',
    descriptionMargin: 'mt-0.5',
    spacing: 'space-y-2'
  },

  // Button configurations
  button: {
    primary: 'px-3 py-2 text-xs',
    secondary: 'px-3 py-2 text-xs',
    icon: 'p-1.5',
    iconSize: 'w-3 h-3',
    iconMargin: 'mr-1'
  },

  // Card configurations
  card: {
    padding: 'p-3',
    title: 'text-sm',
    description: 'text-xs',
    spacing: 'space-y-2'
  },

  // Form configurations
  form: {
    label: 'text-xs',
    input: 'px-3 py-2 text-xs',
    spacing: 'space-y-3'
  },

  // Search and filter configurations
  searchFilter: {
    gap: 'gap-3',
    icon: 'w-4 h-4',
    input: 'pl-9 pr-3 py-2 text-xs',
    select: 'px-3 py-2 text-xs',
    button: 'px-3 py-2 text-xs'
  },

  // Stats card configurations
  statsCard: {
    padding: 'p-3',
    gap: 'gap-3',
    iconContainer: 'w-8 h-8',
    iconMargin: 'mr-2',
    icon: 'w-4 h-4',
    label: 'text-xs',
    value: 'text-lg'
  }
} as const;

// Utility function to get design tokens
export const getDesignToken = (category: keyof typeof designTokens, key: string): string => {
  const categoryTokens = designTokens[category] as any;
  return categoryTokens[key] || '';
};

// Utility function to get component config
export const getComponentConfig = (component: keyof typeof componentConfigs, key: string): string => {
  const componentConfig = componentConfigs[component] as any;
  return componentConfig[key] || '';
};

export default designTokens;
