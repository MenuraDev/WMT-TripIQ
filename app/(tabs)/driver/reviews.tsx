import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { apiService } from '@/services/api';
import { Review } from '@/types';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const driverId = 'driver-1';

export default function DriverReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDriverReviews(driverId);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Driver Reviews</Text>
        {loading ? (
          <Text style={styles.message}>Loading reviews...</Text>
        ) : reviews.length === 0 ? (
          <Text style={styles.message}>No reviews yet.</Text>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.userName}</Text>
                <Text style={styles.reviewRating}>{review.rating.toFixed(1)} ★</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  reviewAuthor: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
  },
  reviewRating: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.primary,
  },
  reviewComment: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    fontFamily: Fonts.body,
    marginBottom: Spacing.sm,
  },
  reviewDate: {
    fontSize: FontSizes.xs,
    color: Colors.gray,
    fontFamily: Fonts.body,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});