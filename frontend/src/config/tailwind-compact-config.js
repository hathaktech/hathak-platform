/**
 * Tailwind CSS Configuration Extension for Compact Design System
 * 
 * This configuration extends Tailwind CSS with custom values that match
 * our compact design system standards.
 */

const compactConfig = {
  // Custom spacing scale for compact design
  spacing: {
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '7': '1.75rem',     // 28px
    '8': '2rem',        // 32px
    '9': '2.25rem',     // 36px
    '10': '2.5rem',     // 40px
    '11': '2.75rem',    // 44px
    '12': '3rem',       // 48px
    '14': '3.5rem',     // 56px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '28': '7rem',       // 112px
    '32': '8rem',       // 128px
    '36': '9rem',       // 144px
    '40': '10rem',      // 160px
    '44': '11rem',      // 176px
    '48': '12rem',      // 192px
    '52': '13rem',      // 208px
    '56': '14rem',      // 224px
    '60': '15rem',      // 240px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  // Custom font sizes for compact design
  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    'base': ['0.875rem', { lineHeight: '1.25rem' }], // 14px (compact base)
    'lg': ['1rem', { lineHeight: '1.5rem' }],       // 16px
    'xl': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    '2xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
    '3xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
    '4xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '5xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '6xl': ['3rem', { lineHeight: '1' }],           // 48px
    '7xl': ['3.75rem', { lineHeight: '1' }],        // 60px
    '8xl': ['4.5rem', { lineHeight: '1' }],         // 72px
    '9xl': ['6rem', { lineHeight: '1' }],           // 96px
  },

  // Custom padding scale
  padding: {
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '7': '1.75rem',     // 28px
    '8': '2rem',        // 32px
    '9': '2.25rem',     // 36px
    '10': '2.5rem',     // 40px
    '11': '2.75rem',    // 44px
    '12': '3rem',       // 48px
    '14': '3.5rem',     // 56px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '28': '7rem',       // 112px
    '32': '8rem',       // 128px
    '36': '9rem',       // 144px
    '40': '10rem',      // 160px
    '44': '11rem',      // 176px
    '48': '12rem',      // 192px
    '52': '13rem',      // 208px
    '56': '14rem',      // 224px
    '60': '15rem',      // 240px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  // Custom margin scale
  margin: {
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '7': '1.75rem',     // 28px
    '8': '2rem',        // 32px
    '9': '2.25rem',     // 36px
    '10': '2.5rem',     // 40px
    '11': '2.75rem',    // 44px
    '12': '3rem',       // 48px
    '14': '3.5rem',     // 56px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '28': '7rem',       // 112px
    '32': '8rem',       // 128px
    '36': '9rem',       // 144px
    '40': '10rem',      // 160px
    '44': '11rem',      // 176px
    '48': '12rem',      // 192px
    '52': '13rem',      // 208px
    '56': '14rem',      // 224px
    '60': '15rem',      // 240px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  // Custom width and height for icons
  width: {
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '8': '2rem',        // 32px
    '10': '2.5rem',     // 40px
    '12': '3rem',       // 48px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '32': '8rem',       // 128px
    '40': '10rem',      // 160px
    '48': '12rem',      // 192px
    '56': '14rem',      // 224px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  height: {
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '8': '2rem',        // 32px
    '10': '2.5rem',     // 40px
    '12': '3rem',       // 48px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '32': '8rem',       // 128px
    '40': '10rem',      // 160px
    '48': '12rem',      // 192px
    '56': '14rem',      // 224px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  // Custom gap scale
  gap: {
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '7': '1.75rem',     // 28px
    '8': '2rem',        // 32px
    '9': '2.25rem',     // 36px
    '10': '2.5rem',     // 40px
    '11': '2.75rem',    // 44px
    '12': '3rem',       // 48px
    '14': '3.5rem',     // 56px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '28': '7rem',       // 112px
    '32': '8rem',       // 128px
    '36': '9rem',       // 144px
    '40': '10rem',      // 160px
    '44': '11rem',      // 176px
    '48': '12rem',      // 192px
    '52': '13rem',      // 208px
    '56': '14rem',      // 224px
    '60': '15rem',      // 240px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  // Custom border radius
  borderRadius: {
    'none': '0px',
    'sm': '0.125rem',   // 2px
    'DEFAULT': '0.25rem', // 4px
    'md': '0.375rem',   // 6px
    'lg': '0.5rem',     // 8px
    'xl': '0.75rem',    // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    'full': '9999px',
  },

  // Custom box shadow
  boxShadow: {
    'none': 'none',
    'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Custom transition duration
  transitionDuration: {
    '75': '75ms',
    '100': '100ms',
    '150': '150ms',
    '200': '200ms',
    '300': '300ms',
    '500': '500ms',
    '700': '700ms',
    '1000': '1000ms',
  },
};

// Function to merge with existing Tailwind config
export const extendTailwindConfig = (existingConfig = {}) => {
  return {
    ...existingConfig,
    theme: {
      ...existingConfig.theme,
      extend: {
        ...existingConfig.theme?.extend,
        ...compactConfig,
      },
    },
  };
};

// Function to create a complete Tailwind config
export const createCompactTailwindConfig = () => {
  return {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        ...compactConfig,
        colors: {
          // Custom color palette for HatHak platform
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
        },
      },
    },
    plugins: [],
  };
};

export default compactConfig;
