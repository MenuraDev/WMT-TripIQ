// ============================================
// TripIQ - My Trips Screen (User Dashboard - CRUD)
// ============================================

import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { bookingAPI, tripAPI } from '@/services/api';
import { Booking, Trip } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MyTripsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableTrips, setAvailableTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'book'>('my');

  const loadData = async () => {
    try {
      const [myBookings, allTrips] = await Promise.all([
        bookingAPI.getMyBookings(),
        tripAPI.getAllTrips(),
      ]);
      setBookings(myBookings);
      setAvailableTrips(allTrips);
    } catch (error: any) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load trips. Please check your connection.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleBookTrip = async (trip: Trip) => {
    Alert.alert(
      'Book Trip',
      `Book "${trip.title}" for LKR ${trip.price.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: async () => {
            try {
              await bookingAPI.createBooking({
                tripId: trip._id,
                numberOfTravelers: 1,
              });
              Alert.alert('Success', 'Trip booked successfully!');
              loadData();
              setActiveTab('my');
            } catch (error: any) {
              Alert.alert('Booking Failed', error.response?.data?.message || 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingAPI.cancelBooking(booking._id);
              Alert.alert('Cancelled', 'Booking cancelled successfully.');
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking.');
            }
          },
        },
      ]
    );
  };

  const renderMyBooking = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.tripTitle} numberOfLines={1}>
          {item.trip?.title || 'Trip'}
        </Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.destination}>{item.trip?.destination}</Text>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textLight} />
          <Text style={styles.detailText}>
            {new Date(item.bookingDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={14} color={Colors.textLight} />
          <Text style={styles.detailText}>{item.numberOfTravelers} travelers</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={14} color={Colors.textLight} />
          <Text style={styles.priceText}>LKR {item.totalPrice.toLocaleString()}</Text>
        </View>
      </View>

      {item.status === 'pending' || item.status === 'confirmed' ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderAvailableTrip = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => handleBookTrip(item)}>
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.destination}>{item.destination}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      <View style={styles.tripRight}>
        <Text style={styles.price}>LKR {item.price.toLocaleString()}</Text>
        <TouchableOpacity style={styles.bookButton} onPress={() => handleBookTrip(item)}>
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            My Bookings ({bookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'book' && styles.activeTab]}
          onPress={() => setActiveTab('book')}
        >
          <Text style={[styles.tabText, activeTab === 'book' && styles.activeTabText]}>
            Book New Trip
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'my' ? (
        bookings.length > 0 ? (
          <FlatList
            data={bookings}
            renderItem={renderMyBooking}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={60} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>Start exploring and book your first trip!</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => setActiveTab('book')}
            >
              <Text style={styles.exploreButtonText}>Explore Trips</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <FlatList
          data={availableTrips}
          renderItem={renderAvailableTrip}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'confirmed':
      return { backgroundColor: '#d1fae5' };
    case 'pending':
      return { backgroundColor: '#fef3c7' };
    case 'cancelled':
      return { backgroundColor: '#fee2e2' };
    case 'completed':
      return { backgroundColor: '#dbeafe' };
    default:
      return { backgroundColor: '#4ef0cd'};
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textLight,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#4ef0cd',
    padding: 4,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: Spacing.md,
  },
  bookingCard: {
    backgroundColor: '#4ef0cd',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tripTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.heading,
    fontWeight: '600',
    color: Colors.textDark,
  },
  destination: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  bookingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
  },
  priceText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4ef0cd',
    fontSize: FontSizes.sm,
    fontFamily: Fonts.heading,
    fontWeight: '600',
  },
  tripCard: {
    backgroundColor: '#4ef0cd',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.card,
  },
  tripInfo: {
    flex: 1,
  },
  duration: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginTop: 2,
  },
  tripRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    fontWeight: '700',
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontFamily: Fonts.heading,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    fontWeight: '600',
  },
});
