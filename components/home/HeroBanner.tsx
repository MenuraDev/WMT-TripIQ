import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Colors, Spacing, FontSizes, Fonts, BorderRadius, Shadows } from '@/constants/theme';

interface HeroBannerProps {
  onExplorePress?: () => void;
}

export default function HeroBanner({ onExplorePress }: HeroBannerProps) {
  return (
    <TouchableOpacity onPress={onExplorePress} activeOpacity={0.9} style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=800' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title}>Discover Beautiful Sri Lanka</Text>
          <Text style={styles.subtitle}>
            Explore ancient cities, pristine beaches, and lush mountains with curated itineraries
          </Text>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Explore Itineraries</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    height: 220,
    ...Shadows.card,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 107, 46, 0.6)',
  },
  content: {
    position: 'relative',
    padding: Spacing.lg,
    maxWidth: '85%',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.heading,
    color: Colors.white,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: Colors.white,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.primary,
    fontWeight: '600',
  },
});