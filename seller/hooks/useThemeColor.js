import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(props, colorName) {
  const theme = useColorScheme() || 'light';
  const colorFromProps = props[theme];

  return colorFromProps || Colors[theme][colorName];
}
