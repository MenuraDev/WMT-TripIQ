import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

export default function Header({ onSearchPress, onNotificationPress }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.logo}>SurangaTours</Text>
          <Text style={styles.tagline}>Discover Beautiful Sri Lanka</Text>
        </View>

        <View style={styles.rightSection}>
          {user ? (
            <View style={styles.authButtons}>
              <TouchableOpacity 
                onPress={() => router.push('/my-trips' as any)}
                style={styles.authButton}
              >
                <Text style={styles.authButtonText}>My Trips</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.push('/profile' as any)}
                style={styles.authButton}
              >
                <Text style={styles.authButtonText}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={logout}
                style={[styles.authButton, { backgroundColor: '#fee2e2' }]}
              >
                <Text style={[styles.authButtonText, { color: '#ef4444' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              onPress={() => router.push('/auth/login' as any)}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}

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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  authButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginRight: Spacing.sm,
  },
  authButton: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  authButtonText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: '#2E7D32',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontFamily: Fonts.heading,
    fontWeight: '600',
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