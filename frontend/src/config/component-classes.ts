/**
 * Component Class Configurations
 * Pre-configured class combinations for consistent compact design
 * 
 * This file provides ready-to-use class combinations that follow
 * the compact design standards established by the cart page reference.
 */

import { designTokens, componentConfigs } from './design-tokens';

export const componentClasses = {
  // Layout Classes
  layout: {
    mainContainer: `${designTokens.spacing.container} max-w-7xl mx-auto`,
    sectionContainer: `${designTokens.spacing.section}`,
    subsectionContainer: `${designTokens.spacing.subsection}`,
    itemContainer: `${designTokens.spacing.item}`,
  },

  // Header Classes
  header: {
    container: `${designTokens.spacing.container} text-center`,
    title: `${componentConfigs.header.title} font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent`,
    description: `${componentConfigs.header.description} text-neutral-700 max-w-3xl mx-auto ${componentConfigs.header.descriptionMargin}`,
    spacing: componentConfigs.header.spacing,
  },

  // Button Classes
  button: {
    primary: `${componentConfigs.button.primary} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium`,
    secondary: `${componentConfigs.button.secondary} bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium`,
    success: `${componentConfigs.button.primary} bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium`,
    danger: `${componentConfigs.button.primary} bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium`,
    ghost: `${componentConfigs.button.secondary} bg-transparent text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`,
    icon: `${componentConfigs.button.icon} text-gray-600 hover:bg-gray-50 rounded-lg transition-colors`,
    iconSmall: 'p-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors',
  },

  // Card Classes
  card: {
    base: `${componentConfigs.card.padding} bg-white rounded-xl border border-gray-200 shadow-lg`,
    hover: `${componentConfigs.card.padding} bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200`,
    gradient: `${componentConfigs.card.padding} bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl`,
    title: `${componentConfigs.card.title} font-semibold text-gray-900`,
    description: `${componentConfigs.card.description} text-gray-600`,
    spacing: componentConfigs.card.spacing,
  },

  // Form Classes
  form: {
    container: `${componentConfigs.form.spacing}`,
    label: `${componentConfigs.form.label} font-medium text-gray-700`,
    input: `${componentConfigs.form.input} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
    select: `${componentConfigs.form.input} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
    textarea: `${componentConfigs.form.input} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
    error: 'border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:ring-green-500',
  },

  // Search and Filter Classes
  searchFilter: {
    container: `flex flex-col lg:flex-row ${componentConfigs.searchFilter.gap}`,
    searchInput: `flex-1 relative`,
    searchIcon: `absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${componentConfigs.searchFilter.icon}`,
    input: `w-full ${componentConfigs.searchFilter.input} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
    select: `${componentConfigs.searchFilter.select} border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
    button: `flex items-center ${componentConfigs.searchFilter.button} border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`,
    filterIcon: `${componentConfigs.searchFilter.icon} mr-1`,
  },

  // Tab Navigation Classes
  tabs: {
    container: 'bg-white rounded-xl border border-gray-200 p-1',
    tabList: 'flex space-x-1',
    tab: `flex-1 flex items-center justify-center ${designTokens.tabs.padding} rounded-lg transition-colors ${designTokens.tabs.text}`,
    tabActive: 'bg-blue-600 text-white',
    tabInactive: 'text-gray-600 hover:bg-gray-100',
    tabIcon: `${designTokens.tabs.icon} ${designTokens.tabs.iconMargin}`,
  },

  // Stats Card Classes
  statsCard: {
    container: `bg-white rounded-lg border border-gray-200 ${componentConfigs.statsCard.padding}`,
    grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${componentConfigs.statsCard.gap}`,
    iconContainer: `${componentConfigs.statsCard.iconContainer} bg-blue-100 rounded-lg flex items-center justify-center ${componentConfigs.statsCard.iconMargin}`,
    icon: `${componentConfigs.statsCard.icon} text-blue-600`,
    label: `${componentConfigs.statsCard.label} text-gray-600`,
    value: `${componentConfigs.statsCard.value} font-bold text-gray-900`,
  },

  // Badge Classes
  badge: {
    base: `inline-flex items-center ${designTokens.badges.padding} rounded-full ${designTokens.badges.text} font-medium`,
    success: 'text-green-700 bg-green-100',
    warning: 'text-yellow-700 bg-yellow-100',
    error: 'text-red-700 bg-red-100',
    info: 'text-blue-700 bg-blue-100',
    gray: 'text-gray-700 bg-gray-100',
    icon: `${designTokens.badges.icon} ${designTokens.badges.icon === 'w-3 h-3' ? 'mr-1' : 'mr-1'}`,
  },

  // Table Classes
  table: {
    container: 'bg-white rounded-xl border border-gray-200 overflow-hidden',
    table: 'w-full',
    header: `bg-gray-50 border-b border-gray-200`,
    headerCell: `${designTokens.table.header.padding} text-left ${designTokens.table.header.text} font-medium text-gray-500 uppercase tracking-wider`,
    body: 'bg-white divide-y divide-gray-200',
    bodyRow: 'hover:bg-gray-50',
    bodyCell: `${designTokens.table.body.padding} ${designTokens.table.body.text} text-gray-900`,
  },

  // Empty State Classes
  emptyState: {
    container: `text-center ${designTokens.emptyState.padding}`,
    iconContainer: `${designTokens.emptyState.iconContainer} bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3`,
    icon: `${designTokens.emptyState.icon} text-blue-500`,
    title: `${designTokens.emptyState.title} font-semibold text-gray-900 mb-2`,
    description: `${designTokens.emptyState.description} text-gray-600 mb-3`,
    button: `${designTokens.emptyState.button} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`,
  },

  // Quick Actions Classes
  quickActions: {
    container: `bg-gray-50 rounded-xl ${designTokens.padding.container.medium}`,
    title: `${designTokens.typography.h2} font-semibold text-gray-900 mb-3`,
    grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${designTokens.spacing.grid.medium}`,
    button: `flex items-center ${designTokens.padding.card.medium} bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all`,
    icon: `${designTokens.icons.medium} text-blue-500 ${designTokens.margin.horizontal.medium}`,
    text: `${designTokens.typography.body} font-medium text-gray-700`,
  },

  // Icon Classes
  icon: {
    large: designTokens.icons.large,
    medium: designTokens.icons.medium,
    small: designTokens.icons.small,
    tiny: designTokens.icons.tiny,
    container: {
      large: designTokens.icons.container.large,
      medium: designTokens.icons.container.medium,
      small: designTokens.icons.container.small,
    }
  },

  // Spacing Classes
  spacing: {
    container: designTokens.spacing.container,
    section: designTokens.spacing.section,
    subsection: designTokens.spacing.subsection,
    item: designTokens.spacing.item,
    grid: designTokens.spacing.grid,
    element: designTokens.spacing.element,
  },

  // Margin Classes
  margin: {
    vertical: designTokens.margin.vertical,
    horizontal: designTokens.margin.horizontal,
  },

  // Padding Classes
  padding: {
    container: designTokens.padding.container,
    card: designTokens.padding.card,
    button: designTokens.padding.button,
    form: designTokens.padding.form,
  },
} as const;

// Utility function to combine classes
export const combineClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Utility function to get component classes
export const getComponentClass = (component: keyof typeof componentClasses, variant: string): string => {
  const componentClass = componentClasses[component] as any;
  return componentClass[variant] || '';
};

export default componentClasses;
