import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, Fonts, BorderRadius, Shadows } from '@/constants/theme';
import { Review } from '@/types';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewPress?: (review: Review) => void;
}

export default function ReviewsSection({ reviews, onReviewPress }: ReviewsSectionProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color={i < rating ? '#FFD700' : Colors.gray}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What Travelers Say</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {reviews.map((review) => (
          <TouchableOpacity
            key={review.id}
            style={styles.card}
            onPress={() => onReviewPress?.(review)}
            activeOpacity={0.8}
          >
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>{renderStars(review.rating)}</View>
              {review.destination && (
                <Text style={styles.destination}>{review.destination}</Text>
              )}
            </View>

            <Text style={styles.comment} numberOfLines={4}>{review.comment}</Text>

            <View style={styles.footer}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{review.userName.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{review.userName}</Text>
                  <Text style={styles.date}>{review.date}</Text>
                </View>
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
    width: 300,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    ...Shadows.card,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stars: {
    flexDirection: 'row',
  },
  destination: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  comment: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    paddingTop: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.primary,
    fontWeight: '700',
  },
  userName: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
  },
  date: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginTop: 2,
  },
});