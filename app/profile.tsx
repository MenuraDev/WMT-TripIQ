import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const updated = await userAPI.updateProfile({ name: name.trim(), phone: phone.trim() || undefined });
      updateUser(updated);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          ) : (
            <Text style={styles.value}>{user.phone || 'Not added'}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={18} color={Colors.primary} />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#44efad' },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: Colors.primary },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: '700', color: Colors.textDark },
  email: { fontSize: 14, color: Colors.textLight, marginTop: 4 },
  section: { backgroundColor: '#44efad', marginTop: 12, padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16, color: Colors.textDark },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: Colors.textLight, marginBottom: 4 },
  value: { fontSize: 16, color: Colors.textDark },
  input: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: 12, fontSize: 16 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f5e9', padding: 14, borderRadius: 12, marginBottom: 12 },
  editText: { color: Colors.primary, fontWeight: '600', marginLeft: 8 },
  cancelBtn: { flex: 1, backgroundColor: '#f1f1f1', padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelText: { color: '#666', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: Colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, backgroundColor: '#fee2e2' },
  logoutText: { color: '#ef4444', fontWeight: '600', marginLeft: 8 },
});