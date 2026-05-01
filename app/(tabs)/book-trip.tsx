import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export default function BookTripScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Book Your Trip - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 18,
    color: Colors.textLight,
  },
});