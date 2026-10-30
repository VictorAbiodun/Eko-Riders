import type { Config } from 'tailwindcss'

/**
 * Eko Riders — Lagos transport palette
 * Soft danfo yellow + structural black. Warm cream neutrals.
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        white: '#FCFAEE', // Warm, sun-bleached cream to replace pure white
        brand: {
          DEFAULT: '#D99F16',
          50: '#FDF8EA',
          100: '#FBF0D5',
          200: '#F5DEAA',
          300: '#EFCB80',
          400: '#E9B855',
          500: '#D99F16',
          600: '#B88510',
          700: '#91680A',
          800: '#6B4D06',
          900: '#463203',
        },
        accent: {
          DEFAULT: '#59788E',
          50: '#F1F4F6',
          100: '#E3EAF0',
          200: '#C7D4DF',
          300: '#ABBFCE',
          400: '#8FA9BD',
          500: '#59788E',
          600: '#486073',
          700: '#364957',
          800: '#25313A',
          900: '#131A1E',
        },
        ink: {
          DEFAULT: '#1E1C1A',
          50: '#F5F5F4',
          100: '#EAE9E8',
          200: '#CFCBCA',
          300: '#B4AFAC',
          400: '#98918D',
          500: '#7C746F',
          600: '#5D5753',
          700: '#3F3937',
          800: '#1E1C1A',
          900: '#100E0D',
        },
        neutral: {
          50: '#FFFAF0',
          100: '#FFF8E7',
          200: '#F0EBE0',
          300: '#D9D4C8',
          400: '#A8A196',
          500: '#78716C',
          600: '#5C564E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        status: {
          pending: {
            DEFAULT: '#525252',
            bg: '#F7F7F7',
            border: '#E8E8E8',
          },
          info: {
            DEFAULT: '#59788E',
            bg: '#E3EAF0',
            border: '#C7D4DF',
          },
          success: {
            DEFAULT: '#15803D',
            bg: '#DCFCE7',
            border: '#BBF7D0',
          },
          danger: {
            DEFAULT: '#B91C1C',
            bg: '#FEE2E2',
            border: '#FECACA',
          },
          warning: {
            DEFAULT: '#A16207',
            bg: '#FEF9C3',
            border: '#FDE047',
          },
        },
      },
      fontFamily: {
        heading: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        body: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        data: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        // xs = 12px — badges/meta only, never body copy
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        // sm = 14px — minimum body size
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        // Dominant data sizes
        'data-sm': [
          '0.875rem',
          { lineHeight: '1.25rem', letterSpacing: '0.02em' },
        ],
        'data-md': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.01em' }],
        'data-lg': [
          '1.125rem',
          { lineHeight: '1.5rem', letterSpacing: '0.005em' },
        ],
      },
      minHeight: {
        touch: '2.75rem', // 44px
      },
      minWidth: {
        touch: '2.75rem',
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(10 10 10 / 0.04)',
        DEFAULT: '0 1px 3px 0 rgb(10 10 10 / 0.06)',
        header: '0 1px 0 0 rgb(10 10 10 / 0.12)',
        tab: '0 -1px 0 0 rgb(232 187 24 / 0.3)',
      },
    },
  },
}

export default config
