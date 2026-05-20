import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200' }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.3)', 'rgba(15, 23, 42, 0.7)', 'rgba(15, 23, 42, 0.95)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <Animated.View style={[styles.header, { transform: [{ scale: logoScale }] }]}>
          <LinearGradient
            colors={Colors.gradient.primary}
            style={styles.logoContainer}
          >
            <Ionicons name="home" size={40} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.logoText}>DarCom</Text>
          <Text style={styles.tagline}>Your Home, Your Future</Text>
        </Animated.View>

        <View style={styles.features}>
          <Animated.View 
            style={[
              styles.featureCard, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(147, 51, 234, 0.2)', 'rgba(192, 38, 211, 0.1)']}
              style={styles.featureGradient}
            >
              <View style={styles.featureIconContainer}>
                <Ionicons name="search" size={28} color="#c084fc" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Smart Search</Text>
                <Text style={styles.featureDescription}>Find properties across Algeria with advanced filters</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureCard, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(34, 211, 238, 0.2)', 'rgba(6, 182, 212, 0.1)']}
              style={styles.featureGradient}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(34, 211, 238, 0.2)' }]}>
                <Ionicons name="shield-checkmark" size={28} color="#22d3ee" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Verified Listings</Text>
                <Text style={styles.featureDescription}>All properties verified by trusted agents</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View 
            style={[
              styles.featureCard, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.1)']}
              style={styles.featureGradient}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="chatbubbles" size={28} color="#10b981" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Direct Contact</Text>
                <Text style={styles.featureDescription}>Message agents and schedule visits instantly</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View 
          style={[
            styles.buttonContainer, 
            { 
              opacity: fadeAnim,
              paddingBottom: insets.bottom + 10,
            }
          ]}
        >
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/signup')}
            variant="primary"
            size="lg"
            gradient
            fullWidth
            icon="arrow-forward"
            iconPosition="right"
          />
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Text 
              style={styles.loginLink}
              onPress={() => router.push('/(auth)/login')}
            >
              Sign In
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    marginVertical: 32,
  },
  featureCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#c084fc',
  },
});