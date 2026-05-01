import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, Fonts, BorderRadius, Shadows } from '@/constants/theme';
import { ServiceCard } from '@/types';

interface ServiceCardsProps {
  services: ServiceCard[];
  onServicePress?: (service: ServiceCard) => void;
}

export default function ServiceCards({ services, onServicePress }: ServiceCardsProps) {
  const getIconName = (icon: string) => {
    switch (icon) {
      case 'map':
        return 'map-outline';
      case 'car':
        return 'car-outline';
      case 'star':
        return 'star-outline';
      default:
        return 'apps-outline';
    }
  };

  return (
    <View style={styles.container}>
      {services.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={styles.card}
          onPress={() => onServicePress?.(service)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={getIconName(service.icon)}
              size={32}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.description}>{service.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: 4,
    alignItems: 'center',
    ...Shadows.card,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bodyBold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.body,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});