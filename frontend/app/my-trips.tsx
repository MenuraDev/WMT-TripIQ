import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { bookingAPI } from '@/services/api';
import { Booking } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function MyTripsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Edit form states
  const [editDays, setEditDays] = useState(3);
  const [editPeople, setEditPeople] = useState(2);
  const [editStartDate, setEditStartDate] = useState('');
  const [editAreas, setEditAreas] = useState<string[]>([]);

  const loadBookings = async () => {
    try {
      const data = await bookingAPI.getMyBookings();
      // Only show non-cancelled bookings
      const activeBookings = data.filter((b: Booking) => b.status !== 'cancelled');
      setBookings(activeBookings);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  // ==================== HARD DELETE ====================
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Booking",
      "This will permanently delete this booking from the database. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await bookingAPI.deleteBooking(id);
              Alert.alert("Success", "Booking deleted permanently");
              loadBookings();
            } catch (e) {
              Alert.alert("Error", "Failed to delete booking");
            }
          }
        }
      ]
    );
  };

  // ==================== EDIT ====================
  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setEditDays(booking.numberOfDays || 3);
    setEditPeople(booking.numberOfPeople || 2);
    setEditStartDate(booking.startDate || '');
    setEditAreas(booking.selectedAreas || []);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;

    try {
      const updatedData = {
        numberOfDays: editDays,
        numberOfPeople: editPeople,
        startDate: editStartDate,
        selectedAreas: editAreas,
      };

      await bookingAPI.updateBooking(editingBooking._id, updatedData);
      Alert.alert("Success", "Booking updated successfully!");
      setShowEditModal(false);
      loadBookings();
    } catch (error) {
      Alert.alert("Error", "Failed to update booking");
    }
  };

  const toggleArea = (area: string) => {
    if (editAreas.includes(area)) {
      setEditAreas(editAreas.filter(a => a !== area));
    } else {
      setEditAreas([...editAreas, area]);
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {item.selectedAreas?.join(' → ') || 'Trip'}
        </Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.details}>
        {item.numberOfDays} Days • {item.numberOfPeople} People
      </Text>

      <Text style={styles.date}>
        Starts: {new Date(item.startDate).toLocaleDateString('en-GB')}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>LKR {item.totalPrice.toLocaleString()}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="pencil" size={16} color={Colors.primary} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => handleDelete(item._id)}
        >
          <Ionicons name="trash" size={16} color="#ef4444" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="airplane-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No active bookings</Text>
            <TouchableOpacity 
              style={styles.bookNowBtn} 
              onPress={() => router.push('/(tabs)/book-trip')}
            >
              <Text style={styles.bookNowText}>Book Your First Trip</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* ==================== FULL EDIT MODAL ==================== */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Edit Booking</Text>

              {/* Days */}
              <Text style={styles.inputLabel}>Number of Days</Text>
              <View style={styles.daysRow}>
                {[1,2,3,4,5,6,7,8,9].map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayBtn, editDays === day && styles.dayBtnActive]}
                    onPress={() => setEditDays(day)}
                  >
                    <Text style={[styles.dayText, editDays === day && styles.dayTextActive]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* People */}
              <Text style={styles.inputLabel}>Number of People</Text>
              <View style={styles.peopleRow}>
                <TouchableOpacity 
                  style={styles.peopleBtn} 
                  onPress={() => setEditPeople(Math.max(1, editPeople - 1))}
                >
                  <Ionicons name="remove" size={22} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.peopleCount}>{editPeople}</Text>
                <TouchableOpacity 
                  style={styles.peopleBtn} 
                  onPress={() => setEditPeople(Math.min(20, editPeople + 1))}
                >
                  <Ionicons name="add" size={22} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Start Date */}
              <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={editStartDate}
                onChangeText={setEditStartDate}
                placeholder="2026-05-10"
              />

              {/* Areas */}
              <Text style={styles.inputLabel}>Selected Areas</Text>
              <View style={styles.areasContainer}>
                {['Anuradhapura', 'Polonnaruwa', 'Sigiriya', 'Negambo', 'Colombo', 'Puttalama'].map(area => (
                  <TouchableOpacity
                    key={area}
                    style={[styles.areaChip, editAreas.includes(area) && styles.areaChipActive]}
                    onPress={() => toggleArea(area)}
                  >
                    <Text style={[styles.areaText, editAreas.includes(area) && styles.areaTextActive]}>
                      {area}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn} 
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalSaveBtn} 
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getStatusStyle(status: string) {
  if (status === 'confirmed') return { backgroundColor: '#d1fae5' };
  if (status === 'pending') return { backgroundColor: '#fef3c7' };
  return { backgroundColor: '#e5e7eb' };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: Spacing.md },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: BorderRadius.lg, 
    padding: Spacing.lg, 
    marginBottom: Spacing.md,
    ...Shadows.card 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  title: { fontSize: FontSizes.lg, fontWeight: '600', flex: 1, color: Colors.textDark },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  details: { color: Colors.textLight, marginBottom: 4 },
  date: { color: Colors.textLight, fontSize: 14 },
  priceRow: { marginTop: Spacing.sm },
  price: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  buttonRow: { flexDirection: 'row', marginTop: Spacing.md, gap: 10 },
  editButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#e8f5e9', 
    padding: 12, 
    borderRadius: BorderRadius.md 
  },
  editText: { color: Colors.primary, fontWeight: '600', marginLeft: 6 },
  deleteButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fee2e2', 
    padding: 12, 
    borderRadius: BorderRadius.md 
  },
  deleteText: { color: '#ef4444', fontWeight: '600', marginLeft: 6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, color: '#888', marginTop: 16 },
  bookNowBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  bookNowText: { color: '#fff', fontWeight: '600' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '92%', maxHeight: '85%' },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: Colors.textDark },
  inputLabel: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: Colors.textDark, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 8 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  dayBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f1f1' },
  dayBtnActive: { backgroundColor: Colors.primary },
  dayText: { fontSize: 15, color: Colors.textDark },
  dayTextActive: { color: '#fff', fontWeight: '600' },
  peopleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 12 },
  peopleBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f1f1f1', justifyContent: 'center', alignItems: 'center' },
  peopleCount: { fontSize: 26, fontWeight: '700', color: Colors.textDark, minWidth: 50, textAlign: 'center' },
  areasContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  areaChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#f1f1f1' },
  areaChipActive: { backgroundColor: Colors.primary },
  areaText: { fontSize: 14, color: Colors.textDark },
  areaTextActive: { color: '#fff', fontWeight: '600' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalCancelBtn: { flex: 1, backgroundColor: '#f1f1f1', padding: 15, borderRadius: 12, alignItems: 'center' },
  modalCancelText: { fontWeight: '600', color: '#666', fontSize: 16 },
  modalSaveBtn: { flex: 1, backgroundColor: Colors.primary, padding: 15, borderRadius: 12, alignItems: 'center' },
  modalSaveText: { fontWeight: '600', color: '#fff', fontSize: 16 },
});