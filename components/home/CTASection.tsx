import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes, Fonts, BorderRadius, Shadows } from '@/constants/theme';

interface CTASectionProps {
  onBookTripPress?: () => void;
  onContactPress?: () => void;
}

export default function CTASection({ onBookTripPress, onContactPress }: CTASectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ready to Start Your Journey?</Text>
        <Text style={styles.subtitle}>
          Let us help you create unforgettable memories in Sri Lanka
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onBookTripPress}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Book Your Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onContactPress}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.primary,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.white,
    fontWeight: '600',
  },
});