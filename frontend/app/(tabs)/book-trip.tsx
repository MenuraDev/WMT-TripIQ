import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { bookingAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ==================== PREMADE COMBOS ====================
const COMBOS = [
  {
    id: 'combo1',
    name: 'Cultural Triangle',
    areas: ['Anuradhapura', 'Polonnaruwa', 'Sigiriya'],
  },
  {
    id: 'combo2',
    name: 'Western Coast',
    areas: ['Negambo', 'Colombo', 'Puttalama'],
  },
];

const ALL_AREAS = [
  'Anuradhapura', 'Polonnaruwa', 'Sigiriya',
  'Negambo', 'Colombo', 'Puttalama'
];

const PRICE_PER_PERSON_PER_DAY = 5500;

export default function BookTripScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [numberOfDays, setNumberOfDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = numberOfDays * numberOfPeople * PRICE_PER_PERSON_PER_DAY;

  // ==================== IMPROVED AREA SELECTION ====================
  const toggleArea = (area: string, comboId?: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      // 1-3 Days → Only 1 area
      if (numberOfDays <= 3) {
        if (selectedAreas.length >= 1) {
          Alert.alert("Limit Reached", "You can only select 1 area for 3 days or less.");
          return;
        }
        setSelectedAreas([area]);
      } 
      // 4-6 Days → Must be from SAME combo
      else if (numberOfDays <= 6) {
        if (selectedAreas.length >= 2) {
          Alert.alert("Limit Reached", "You can only select 2 areas.");
          return;
        }

        // Check if user already selected from another combo
        const currentCombo = COMBOS.find(c => c.areas.includes(area));
        const otherComboAreas = COMBOS
          .filter(c => c.id !== currentCombo?.id)
          .flatMap(c => c.areas);

        if (selectedAreas.some(a => otherComboAreas.includes(a))) {
          Alert.alert("Error", "Please select both areas from the SAME combo.");
          return;
        }

        setSelectedAreas([...selectedAreas, area]);
      }
    }
  };

  const selectCombo = (combo: any) => {
    setSelectedCombo(combo);
    setSelectedAreas(combo.areas);
  };

  // ==================== CREATE BOOKING ====================
  const handleCreateBooking = async () => {
    if (!user) {
      Alert.alert("Error", "Please login first");
      return;
    }

    if (numberOfDays <= 3 && selectedAreas.length !== 1) {
      Alert.alert("Error", "Please select exactly 1 area");
      return;
    }
    if (numberOfDays > 3 && numberOfDays <= 6 && selectedAreas.length !== 2) {
      Alert.alert("Error", "Please select exactly 2 areas from the same combo");
      return;
    }
    if (numberOfDays > 6 && selectedAreas.length !== 3) {
      Alert.alert("Error", "Please select a full combo (3 areas)");
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        numberOfDays,
        startDate: startDate.toISOString().split('T')[0],
        numberOfPeople,
        selectedAreas,
        comboName: selectedCombo ? selectedCombo.name : null,
        pricePerPersonPerDay: PRICE_PER_PERSON_PER_DAY,
        totalPrice,
      };

      await bookingAPI.createBooking(bookingData);
      
      Alert.alert("Success", "Trip booked successfully!", [
        { text: "OK", onPress: () => router.push('/(tabs)/my-trips' as any) }
      ]);
    } catch (error: any) {
      Alert.alert("Booking Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Your Trip</Text>
        <Text style={styles.subtitle}>Plan your perfect Sri Lanka adventure</Text>
      </View>

      {/* Number of Days */}
      <View style={styles.section}>
        <Text style={styles.label}>Number of Days (Max 9)</Text>
        <View style={styles.daysContainer}>
          {[1,2,3,4,5,6,7,8,9].map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, numberOfDays === day && styles.dayButtonActive]}
              onPress={() => {
                setNumberOfDays(day);
                setSelectedAreas([]);
                setSelectedCombo(null);
              }}
            >
              <Text style={[styles.dayText, numberOfDays === day && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Start Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color={Colors.primary} />
          <Text style={styles.dateText}>
            {startDate.toLocaleDateString('en-GB')}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Number of People */}
      <View style={styles.section}>
        <Text style={styles.label}>Number of People</Text>
        <View style={styles.peopleContainer}>
          <TouchableOpacity 
            style={styles.peopleButton} 
            onPress={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
          >
            <Ionicons name="remove" size={24} color={Colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.peopleCount}>{numberOfPeople}</Text>
          
          <TouchableOpacity 
            style={styles.peopleButton} 
            onPress={() => setNumberOfPeople(Math.min(20, numberOfPeople + 1))}
          >
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Area Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>
          {numberOfDays <= 3 
            ? "Select 1 Area" 
            : numberOfDays <= 6 
              ? "Select 2 Areas from SAME Combo" 
              : "Select Full Combo (3 Areas)"
          }
        </Text>

        {numberOfDays > 6 ? (
          // 7-9 Days → Full Combo
          <View>
            {COMBOS.map(combo => (
              <TouchableOpacity
                key={combo.id}
                style={[
                  styles.comboCard,
                  selectedCombo?.id === combo.id && styles.comboCardActive
                ]}
                onPress={() => selectCombo(combo)}
              >
                <Text style={styles.comboName}>{combo.name}</Text>
                <Text style={styles.comboAreas}>{combo.areas.join(' → ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : numberOfDays > 3 ? (
          // 4-6 Days → 2 Areas from SAME Combo
          <View>
            {COMBOS.map(combo => (
              <View key={combo.id} style={styles.comboSection}>
                <Text style={styles.comboTitle}>{combo.name}</Text>
                <View style={styles.areasRow}>
                  {combo.areas.map(area => (
                    <TouchableOpacity
                      key={area}
                      style={[
                        styles.areaChip,
                        selectedAreas.includes(area) && styles.areaChipActive
                      ]}
                      onPress={() => toggleArea(area, combo.id)}
                    >
                      <Text style={[
                        styles.areaText,
                        selectedAreas.includes(area) && styles.areaTextActive
                      ]}>
                        {area}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          // 1-3 Days → Any 1 Area
          <View style={styles.areasRow}>
            {ALL_AREAS.map(area => (
              <TouchableOpacity
                key={area}
                style={[
                  styles.areaChip,
                  selectedAreas.includes(area) && styles.areaChipActive
                ]}
                onPress={() => toggleArea(area)}
              >
                <Text style={[
                  styles.areaText,
                  selectedAreas.includes(area) && styles.areaTextActive
                ]}>
                  {area}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Price Summary */}
      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>Total Price</Text>
        <Text style={styles.totalPrice}>LKR {totalPrice.toLocaleString()}</Text>
        <Text style={styles.priceBreakdown}>
          {numberOfDays} days × {numberOfPeople} people × LKR {PRICE_PER_PERSON_PER_DAY}
        </Text>
      </View>

      {/* Book Button */}
      <TouchableOpacity 
        style={styles.bookButton} 
        onPress={handleCreateBooking}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.bookButtonText}>Book This Trip</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, backgroundColor: Colors.primary },
  title: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },
  label: { fontSize: 16, fontWeight: '600', color: Colors.textDark, marginBottom: Spacing.sm },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f1f1f1' },
  dayButtonActive: { backgroundColor: Colors.primary },
  dayText: { fontSize: 16, color: Colors.textDark },
  dayTextActive: { color: '#fff', fontWeight: '600' },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#60f8ac', padding: 16, borderRadius: BorderRadius.lg, gap: 12 },
  dateText: { fontSize: 16, color: Colors.textDark },
  peopleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  peopleButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f1f1f1', justifyContent: 'center', alignItems: 'center' },
  peopleCount: { fontSize: 28, fontWeight: '700', color: Colors.textDark, minWidth: 50, textAlign: 'center' },
  comboCard: { backgroundColor: '#60f8ac', padding: 16, borderRadius: BorderRadius.lg, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  comboCardActive: { borderColor: Colors.primary },
  comboName: { fontSize: 18, fontWeight: '600', color: Colors.textDark },
  comboAreas: { color: Colors.textLight, marginTop: 4 },
  comboSection: { marginBottom: 16 },
  comboTitle: { fontSize: 15, fontWeight: '600', color: Colors.primary, marginBottom: 8 },
  areasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  areaChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f1f1f1' },
  areaChipActive: { backgroundColor: Colors.primary },
  areaText: { color: Colors.textDark },
  areaTextActive: { color: '#fff', fontWeight: '600' },
  priceCard: { backgroundColor: '#60f8ac', margin: Spacing.lg, padding: 20, borderRadius: BorderRadius.xl, alignItems: 'center', ...Shadows.card },
  priceLabel: { fontSize: 14, color: Colors.textLight },
  totalPrice: { fontSize: 32, fontWeight: '700', color: Colors.primary, marginVertical: 4 },
  priceBreakdown: { fontSize: 13, color: Colors.textLight, textAlign: 'center' },
  bookButton: { backgroundColor: Colors.primary, marginHorizontal: Spacing.lg, paddingVertical: 16, borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.lg },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});