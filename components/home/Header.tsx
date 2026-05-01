import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, Fonts, Shadows, BorderRadius } from '@/constants/theme';

interface HeaderProps {
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

export default function Header({ onSearchPress, onNotificationPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.logo}>SurangaTours</Text>
          <Text style={styles.tagline}>Discover Beautiful Sri Lanka</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={onSearchPress} style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <Text style={styles.searchPlaceholder}>Where do you want to go?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logo: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    fontWeight: '700',
  },
  tagline: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginTop: 2,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Shadows.small,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: Colors.textLight,
  },
});