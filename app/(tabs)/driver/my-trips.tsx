import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { apiService } from '@/services/api';
import { Booking } from '@/types';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const driverId = 'driver-1';

export default function MyTripsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await apiService.getDriverBookings(driverId);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'active') {
      return ['accepted', 'in_progress'].includes(booking.status);
    }
    return booking.status === 'completed';
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Trips</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.message}>Loading trips...</Text>
        ) : filteredBookings.length === 0 ? (
          <Text style={styles.message}>No {filter} trips available.</Text>
        ) : (
          filteredBookings.map(booking => (
            <View key={booking.id} style={styles.tripCard}>
              <Text style={styles.tripRoute}>{booking.pickupLocation} → {booking.destination}</Text>
              <Text style={styles.tripMeta}>{booking.date} · ${booking.price}</Text>
                  <View style={[styles.statusTag, filter === 'active' ? styles.statusActive : styles.statusCompleted]}>
                <Text style={styles.statusText}>{booking.status.replace('_', ' ').toUpperCase()}</Text>
              </View>
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
  filterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginRight: Spacing.sm,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textDark,
    fontFamily: Fonts.bodyMedium,
  },
  filterTextActive: {
    color: Colors.white,
  },
  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  tripRoute: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  tripMeta: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusActive: {
    backgroundColor: Colors.secondary,
  },
  statusCompleted: {
    backgroundColor: '#00aa00',
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bodyMedium,
    color: Colors.white,
  },
  message: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});