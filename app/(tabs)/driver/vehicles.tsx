import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { Vehicle, vehicleAPI } from '@/services/vehicleAPI';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverVehiclesScreen() {
  const { token } = useDriverAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [condition, setCondition] = useState('Good');

  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await vehicleAPI.getDriverVehicles(token);
      setVehicles(data.vehicles || []);
    } catch (error: any) {
      console.error('Failed to load vehicles:', error);
      Alert.alert('Error', error.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!type || !capacity || !pricePerKm) {
      Alert.alert('Validation', 'Please fill in all vehicle details.');
      return;
    }

    if (!token) return;

    try {
      setSubmitting(true);
      const newVehicleData: Vehicle = {
        type,
        capacity: parseInt(capacity, 10),
        pricePerKm: parseFloat(pricePerKm),
        condition,
      };

      const data = await vehicleAPI.addVehicle(newVehicleData, token);
      
      // Update list
      setVehicles([data.vehicle, ...vehicles]);
      
      // Reset form and close modal
      setType('');
      setCapacity('');
      setPricePerKm('');
      setCondition('Good');
      setModalVisible(false);
      
      Alert.alert('Success', 'Vehicle added successfully!');
    } catch (error: any) {
      console.error('Failed to add vehicle:', error);
      Alert.alert('Error', error.message || 'Failed to add vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const renderVehicleCard = (vehicle: Vehicle, index: number) => (
    <View key={vehicle._id || index} style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleTitleRow}>
          <Ionicons name="car" size={24} color={Colors.primary} />
          <Text style={styles.vehicleType}>{vehicle.type}</Text>
        </View>
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{vehicle.condition}</Text>
        </View>
      </View>

      <View style={styles.vehicleDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="people" size={18} color={Colors.textLight} />
          <Text style={styles.detailText}>{vehicle.capacity} Seats</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash" size={18} color={Colors.textLight} />
          <Text style={styles.detailText}>${vehicle.pricePerKm} / km</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {vehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={64} color={Colors.grayLight} />
              <Text style={styles.emptyText}>No vehicles added yet.</Text>
              <Text style={styles.emptySubText}>Tap the + button to add your first vehicle.</Text>
            </View>
          ) : (
            vehicles.map((v, i) => renderVehicleCard(v, i))
          )}
        </ScrollView>
      )}

      {/* Add Vehicle Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Vehicle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sedan, SUV, Minivan"
                  value={type}
                  onChangeText={setType}
                  placeholderTextColor={Colors.grayLight}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                  <Text style={styles.label}>Capacity (Seats)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 4"
                    value={capacity}
                    onChangeText={setCapacity}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.grayLight}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                  <Text style={styles.label}>Price per km ($)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 1.5"
                    value={pricePerKm}
                    onChangeText={setPricePerKm}
                    keyboardType="decimal-pad"
                    placeholderTextColor={Colors.grayLight}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Condition</Text>
                <View style={styles.pillContainer}>
                  {conditions.map((cond) => (
                    <TouchableOpacity
                      key={cond}
                      style={[
                        styles.conditionPill,
                        condition === cond && styles.conditionPillActive
                      ]}
                      onPress={() => setCondition(cond)}
                    >
                      <Text style={[
                        styles.conditionPillText,
                        condition === cond && styles.conditionPillTextActive
                      ]}>
                        {cond}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
                onPress={handleAddVehicle}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Add Vehicle</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.textLight,
    marginTop: Spacing.md,
  },
  emptySubText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.gray,
    marginTop: Spacing.xs,
  },
  vehicleCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleType: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    marginLeft: Spacing.sm,
  },
  conditionBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  conditionText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bodyMedium,
    color: Colors.primary,
  },
  vehicleDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    paddingTop: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xl,
  },
  detailText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.body,
    color: Colors.textDark,
    marginLeft: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: Colors.textDark,
  },
  row: {
    flexDirection: 'row',
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  conditionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    backgroundColor: Colors.white,
    marginBottom: Spacing.xs,
  },
  conditionPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  conditionPillText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.textDark,
  },
  conditionPillTextActive: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
  },
});
