import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { apiService } from '@/services/api';
import { Booking, DriverProfile } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const driverId = 'driver-1';

export default function DriverDashboardScreen() {
  const navigation = useNavigation<any>();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAvailabilityUpdating, setIsAvailabilityUpdating] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTrip, setActiveTrip] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DriverProfile | null>(null);

  useEffect(() => {
    loadDriverProfile();
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const bookingsData = await apiService.getDriverBookings(driverId);
      setBookings(bookingsData);
      setActiveTrip(bookingsData.find(b => ['accepted', 'in_progress'].includes(b.status)) || null);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadDriverProfile = async () => {
    try {
      const profileData = await apiService.getDriverProfile(driverId);
      setProfile(profileData);
      setIsAvailable(profileData.available);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const toggleAvailability = async (value: boolean) => {
    const previousValue = isAvailable;
    setIsAvailable(value);
    setIsAvailabilityUpdating(true);

    try {
      await apiService.updateDriverAvailability(driverId, value);
    } catch (error) {
      console.error('Error updating availability:', error);
      setIsAvailable(previousValue);
      Alert.alert('Error', 'Failed to update availability');
    } finally {
      setIsAvailabilityUpdating(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject') => {
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      await apiService.updateBookingStatus(bookingId, status);
      await loadDashboardData();
      Alert.alert('Success', `Booking ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      Alert.alert('Error', `Failed to ${action} booking`);
    }
  };

  const handleTripAction = async (action: 'start' | 'complete') => {
    if (!activeTrip) return;

    try {
      const status = action === 'start' ? 'in_progress' : 'completed';
      await apiService.updateBookingStatus(activeTrip.id, status);
      await loadDashboardData();
      Alert.alert('Success', `Trip ${action === 'start' ? 'started' : 'completed'} successfully`);
    } catch (error) {
      console.error(`Error ${action}ing trip:`, error);
      Alert.alert('Error', `Failed to ${action} trip`);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedTrips = bookings.filter(b => b.status === 'completed').length;
  const totalAssigned = bookings.length;
  const driverName = profile?.name ?? 'John Doe';

  const renderBookingCard = (booking: Booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle}>
          {booking.pickupLocation} → {booking.destination}
        </Text>
        <Text style={styles.bookingDate}>{booking.date}</Text>
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.bookingPrice}>${booking.price}</Text>
        <Text style={[styles.bookingStatus, { color: getStatusColor(booking.status) }]}>
          {booking.status.toUpperCase()}
        </Text>
      </View>

      {booking.status === 'pending' && (
        <View style={styles.bookingActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleBookingAction(booking.id, 'accept')}
          >
            <Ionicons name="checkmark" size={16} color={Colors.white} />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleBookingAction(booking.id, 'reject')}
          >
            <Ionicons name="close" size={16} color={Colors.white} />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.secondary;
      case 'accepted':
        return Colors.primary;
      case 'rejected':
        return '#ff4444';
      case 'in_progress':
        return '#ff8800';
      case 'completed':
        return '#00aa00';
      default:
        return Colors.textLight;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.overviewCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcomeText}>Welcome back, {driverName}!</Text>
              <Text style={styles.subTitle}>Your driver dashboard is ready.</Text>
            </View>
            <View style={[styles.availabilityPill, isAvailable ? styles.availabilityPillOnline : styles.availabilityPillOffline]}>
              <Text style={styles.availabilityPillText}>
                {isAvailable ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          <View style={styles.availabilityContainer}>
            <View>
              <Text style={styles.availabilityLabel}>Available for rides</Text>
              <Text style={styles.availabilityHint}>Toggle to receive booking requests.</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: Colors.grayLight, true: Colors.primary }}
              thumbColor={Colors.white}
              disabled={isAvailabilityUpdating}
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={18} color={Colors.primary} style={styles.statIcon} />
              <Text style={styles.statNumber}>{totalAssigned}</Text>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={18} color={Colors.primary} style={styles.statIcon} />
              <Text style={styles.statNumber}>{pendingBookings.length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-done" size={18} color={Colors.primary} style={styles.statIcon} />
              <Text style={styles.statNumber}>{completedTrips}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickNavRow}>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('my-trips')}>
            <View style={styles.quickNavIconWrapper}>
              <Ionicons name="list" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickNavText}>My Trips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('profile')}>
            <View style={styles.quickNavIconWrapper}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickNavText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => navigation.navigate('reviews')}>
            <View style={styles.quickNavIconWrapper}>
              <Ionicons name="star" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.quickNavText}>Reviews</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Trip</Text>
          {activeTrip ? (
            <View style={styles.activeTripCard}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripRoute} numberOfLines={2}>
                  {activeTrip.pickupLocation} → {activeTrip.destination}
                </Text>
                <View style={[styles.statusBadge, activeTrip.status === 'in_progress' ? styles.statusInProgress : activeTrip.status === 'accepted' ? styles.statusAccepted : styles.statusCompleted]}>
                  <Text style={styles.statusBadgeText}>{activeTrip.status.replace('_', ' ').toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.tripDate}>{activeTrip.date}</Text>
              <Text style={styles.tripPrice}>${activeTrip.price}</Text>

              <View style={styles.tripActions}>
                {activeTrip.status === 'accepted' && (
                  <TouchableOpacity style={[styles.tripActionButton, styles.startButton]} onPress={() => handleTripAction('start')}>
                    <Ionicons name="play" size={16} color={Colors.white} />
                    <Text style={styles.tripActionText}>Start Trip</Text>
                  </TouchableOpacity>
                )}
                {activeTrip.status === 'in_progress' && (
                  <TouchableOpacity style={[styles.tripActionButton, styles.completeButton]} onPress={() => handleTripAction('complete')}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                    <Text style={styles.tripActionText}>Complete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No active trip yet</Text>
              <Text style={styles.emptySubtitle}>Once a customer books and you accept the request, the active trip will appear here.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incoming Booking Requests</Text>
          {pendingBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No pending requests</Text>
              <Text style={styles.emptySubtitle}>New bookings will appear here after customers complete the booking flow.</Text>
            </View>
          ) : (
            pendingBookings.map(renderBookingCard)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  overviewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  welcomeText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  subTitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    lineHeight: 22,
  },
  availabilityPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  availabilityPillOnline: {
    backgroundColor: Colors.primary,
  },
  availabilityPillOffline: {
    backgroundColor: Colors.grayLight,
  },
  availabilityPillText: {
    color: Colors.white,
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSizes.sm,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  availabilityLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyMedium,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  availabilityHint: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: Spacing.xs,
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
  },
  quickNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  quickNavItem: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  quickNavIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  quickNavText: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.textDark,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },
  activeTripCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.card,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tripRoute: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
    flex: 1,
    marginRight: Spacing.sm,
  },
  tripDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  tripPrice: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusAccepted: {
    backgroundColor: Colors.secondary,
  },
  statusInProgress: {
    backgroundColor: '#ff8800',
  },
  statusCompleted: {
    backgroundColor: '#00aa00',
  },
  statusBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bodyMedium,
  },
  tripActions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
  tripActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  startButton: {
    backgroundColor: Colors.primary,
  },
  completeButton: {
    backgroundColor: Colors.secondary,
  },
  tripActionText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    marginLeft: Spacing.xs,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.card,
  },
  emptyTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    lineHeight: 20,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  bookingHeader: {
    marginBottom: Spacing.sm,
  },
  bookingTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  bookingDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textLight,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bookingPrice: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bodyBold,
    color: Colors.primary,
  },
  bookingStatus: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  acceptButton: {
    backgroundColor: Colors.primary,
  },
  rejectButton: {
    backgroundColor: '#ff4444',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    marginLeft: Spacing.xs,
  },
});