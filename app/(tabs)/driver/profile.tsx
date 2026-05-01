import { BorderRadius, Colors, FontSizes, Fonts, Shadows, Spacing } from '@/constants/theme';
import { apiService } from '@/services/api';
import { DriverProfile } from '@/types';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const driverId = 'driver-1';

export default function DriverProfileScreen() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDriverProfile(driverId);
      setProfile(data);
      setName(data.name);
      setPhone(data.phone);
      setVehicleModel(data.vehicleModel);
      setVehiclePlate(data.vehiclePlate);
    } catch (error) {
      console.error('Error loading driver profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        name,
        phone,
        vehicleModel,
        vehiclePlate,
      };
      await apiService.updateDriverProfile(driverId, updatedProfile);
      setProfile({ ...(profile ?? { id: driverId, available: false, imageUrl: '', name, phone, vehicleModel, vehiclePlate }), ...updatedProfile });
      Alert.alert('Saved', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handlePhotoPress = () => {
    Alert.alert('Photo Upload', 'Change photo UI is available here, backend integration can be added later.');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Driver Profile</Text>

        <View style={styles.profileCard}>
          <TouchableOpacity onPress={handlePhotoPress} style={styles.photoContainer}>
            <Image
              source={{ uri: profile?.imageUrl ?? 'https://via.placeholder.com/120' }}
              style={styles.profilePhoto}
            />
            <Text style={styles.photoText}>Change Photo</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Model</Text>
            <TextInput value={vehicleModel} onChangeText={setVehicleModel} style={styles.input} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Plate</Text>
            <TextInput value={vehiclePlate} onChangeText={setVehiclePlate} style={styles.input} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
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
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    color: Colors.textDark,
    marginBottom: Spacing.lg,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 120,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.grayLight,
  },
  photoText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontFamily: Fonts.bodyMedium,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyMedium,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontFamily: Fonts.body,
    color: Colors.textDark,
  },
  saveButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontFamily: Fonts.bodyMedium,
  },
  loadingText: {
    margin: Spacing.lg,
    fontSize: FontSizes.md,
    color: Colors.textLight,
    textAlign: 'center',
  },
});