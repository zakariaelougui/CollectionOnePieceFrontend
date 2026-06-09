import { useThemeStore } from '../store/theme.store';
import { Colors, ThemeColors } from './colors';

export function useAppTheme(): { colors: ThemeColors; isDark: boolean } {
  const theme = useThemeStore((s) => s.theme);
  return {
    colors: Colors[theme],
    isDark: theme === 'dark',
  };
}
