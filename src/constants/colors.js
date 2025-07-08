export const COLORS = {
  // Primary brand colors
  PRIMARY: '#CF7F08',
  PRIMARY_LIGHT: '#CF7F081A',
  PRIMARY_DARK: '#A66500',

  // Secondary colors
  SECONDARY: '#2A2A2A',
  SECONDARY_LIGHT: '#545454',
  SECONDARY_DARK: '#1A1A1A',

  // Accent colors
  ACCENT: '#FFB31F',
  ACCENT_LIGHT: '#FFC54D',
  ACCENT_DARK: '#E69B00',

  // Background colors
  BACKGROUND: '#FCFCFD',
  BACKGROUND_SECONDARY: '#F7F8FA',

  // Text colors
  TEXT_PRIMARY: '#2A2A2A',
  TEXT_SECONDARY: '#757575',
  TEXT_DISABLED: '#AFAFAF',
  TEXT_WHITE: '#FFFFFF',

  // Status colors
  SUCCESS: '#27AE60',
  WARNING: '#E2A03F',
  DANGER: '#EA5455',
  INFO: '#00B8D9',

  // Border colors
  BORDER: '#F0F0F0',
  BORDER_DARK: '#E0E0E0',

  // Utility colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',

  // Gray scale
  GRAY_50: '#FAFAFA',
  GRAY_100: '#F5F5F5',
  GRAY_200: '#EEEEEE',
  GRAY_300: '#E0E0E0',
  GRAY_400: '#BDBDBD',
  GRAY_500: '#9E9E9E',
  GRAY_600: '#757575',
  GRAY_700: '#616161',
  GRAY_800: '#424242',
  GRAY_900: '#212121'
}

/**
 * Helper function to get a color with transparency
 * @param {string} color - The hex color code
 * @param {number} opacity - Value between 0 and 1
 * @returns {string} RGBA color string
 */
export const withOpacity = (color, opacity) => {
  if (!color || color.length < 7) return color;

  // Extract RGB values from hex
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default COLORS;
