import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, Fonts, BorderRadius, Shadows } from '@/constants/theme';
import { Itinerary } from '@/types';

interface FeaturedItinerariesProps {
  itineraries: Itinerary[];
  onItineraryPress?: (itinerary: Itinerary) => void;
}

export default function FeaturedItineraries({ itineraries, onItineraryPress }: FeaturedItinerariesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Itineraries</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {itineraries.map((itinerary) => (
          <TouchableOpacity
            key={itinerary.id}
            style={styles.card}
            onPress={() => onItineraryPress?.(itinerary)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: itinerary.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{itinerary.rating}</Text>
            </View>

            <View style={styles.content}>
              <Text style={styles.destination} numberOfLines={1}>{itinerary.destination}</Text>
              <Text style={styles.titleText} numberOfLines={2}>{itinerary.title}</Text>

              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color={Colors.textLight} />
                  <Text style={styles.detailText}>{itinerary.duration}</Text>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.priceLabel}>From LKR</Text>
                <Text style={styles.price}>LKR {itinerary.price.toLocaleString()}</Text>
              </View>
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
    width: 280,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: Spacing.md,
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: 140,
  },
  ratingBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    ...Shadows.small,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
    marginLeft: 4,
  },
  content: {
    padding: Spacing.md,
  },
  destination: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.textLight,
  },
  price: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.primary,
    fontWeight: '700',
  },
});