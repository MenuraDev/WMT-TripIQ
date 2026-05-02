import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/home/Header';
import HeroBanner from '@/components/home/HeroBanner';
import ServiceCards from '@/components/home/ServiceCards';
import FeaturedItineraries from '@/components/home/FeaturedItineraries';
import PopularDestinations from '@/components/home/PopularDestinations';
import ReviewsSection from '@/components/home/ReviewsSection';
import CTASection from '@/components/home/CTASection';
import { featuredItineraries, popularDestinations, reviews, serviceCards } from '@/components/home/mockData';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleExplorePress = () => {
    console.log('Explore pressed');
  };

  const handleServicePress = (service: any) => {
    console.log('Service pressed:', service.title);
  };

  const handleItineraryPress = (itinerary: any) => {
    console.log('Itinerary pressed:', itinerary.title);
  };

  const handleDestinationPress = (destination: any) => {
    console.log('Destination pressed:', destination.name);
  };

  const handleReviewPress = (review: any) => {
    console.log('Review pressed:', review.userName);
  };

  const handleBookTripPress = () => {
    console.log('Book Trip pressed');
  };

  const handleContactPress = () => {
    console.log('Contact pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          onSearchPress={handleSearchPress}
          onNotificationPress={handleNotificationPress}
        />

        <HeroBanner onExplorePress={handleExplorePress} />

        <ServiceCards
          services={serviceCards}
          onServicePress={handleServicePress}
        />

        <FeaturedItineraries
          itineraries={featuredItineraries}
          onItineraryPress={handleItineraryPress}
        />

        <PopularDestinations
          destinations={popularDestinations}
          onDestinationPress={handleDestinationPress}
        />

        <ReviewsSection
          reviews={reviews}
          onReviewPress={handleReviewPress}
        />

        <CTASection
          onBookTripPress={handleBookTripPress}
          onContactPress={handleContactPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});