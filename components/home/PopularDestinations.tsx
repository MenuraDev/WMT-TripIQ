import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Colors, Spacing, FontSizes, Fonts, BorderRadius, Shadows } from '@/constants/theme';
import { Destination } from '@/types';

interface PopularDestinationsProps {
  destinations: Destination[];
  onDestinationPress?: (destination: Destination) => void;
}

export default function PopularDestinations({ destinations, onDestinationPress }: PopularDestinationsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Sri Lanka</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {destinations.map((destination) => (
          <TouchableOpacity
            key={destination.id}
            style={styles.card}
            onPress={() => onDestinationPress?.(destination)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: destination.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.content}>
              <Text style={styles.name}>{destination.name}</Text>
              <Text style={styles.description} numberOfLines={2}>{destination.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
  },
  card: {
    width: 160,
    height: 200,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: Spacing.md,
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
  },
  name: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    color: Colors.white,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.white,
    lineHeight: 16,
  },
});