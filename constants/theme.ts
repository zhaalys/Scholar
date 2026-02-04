/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0054A3"; // SMK Taruna Bhakti Blue
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#003366", // Deep Blue
    background: "#F5F9FF", // Very light blue background for better contrast
    tint: tintColorLight,
    icon: "#0054A3", // Blue icons
    tabIconDefault: "#8DA4C4", // Lighter blue for inactive
    tabIconSelected: tintColorLight,
    cardBackground: "#FFFFFF", // White cards
    primary: "#0054A3",
    onPrimary: "#FFFFFF",
  },
  dark: {
    // Force light/brand theme even in dark mode
    text: "#003366", // Deep Blue
    background: "#F5F9FF", // Very light blue background
    tint: tintColorLight,
    icon: "#0054A3",
    tabIconDefault: "#8DA4C4",
    tabIconSelected: tintColorLight,
    cardBackground: "#FFFFFF", // White cards
    primary: "#0054A3",
    onPrimary: "#FFFFFF",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
