import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../../src/store/auth.store';
import { useThemeStore, ThemeMode } from '../../../src/store/theme.store';
import { useAppTheme } from '../../../src/theme/useAppTheme';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color={colors.accent} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.text }]}>
          <Row label="Email" value={user?.email ?? '—'} colors={colors} />
          <Row label="Username" value={user?.username ?? '—'} colors={colors} last />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.text }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          </View>
          <View style={styles.themeRow}>
            <ThemeOption
              label="Light"
              icon="weather-sunny"
              value="light"
              selected={theme === 'light'}
              colors={colors}
              onPress={() => setTheme('light')}
            />
            <ThemeOption
              label="Dark"
              icon="weather-night"
              value="dark"
              selected={theme === 'dark'}
              colors={colors}
              onPress={() => setTheme('dark')}
            />
          </View>
        </View>

        <Pressable
          style={[styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.dangerBorder }]}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
        </Pressable>
      </View>
    </>
  );
}

type RowColors = ReturnType<typeof useAppTheme>['colors'];

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: RowColors;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.border },
        last && styles.rowLast,
      ]}
    >
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function ThemeOption({
  label,
  icon,
  selected,
  colors,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  value: ThemeMode;
  selected: boolean;
  colors: RowColors;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.themeOption,
        {
          backgroundColor: selected ? colors.accent : colors.surfaceSecondary,
          borderColor: selected ? colors.accent : colors.border,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={selected ? '#fff' : colors.textSecondary}
      />
      <Text style={[styles.themeOptionLabel, { color: selected ? '#fff' : colors.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
