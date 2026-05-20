import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Pressable,
  Animated,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/types';

type RoleOption = {
  value: User['role'];
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const roles: RoleOption[] = [
  { 
    value: 'buyer', 
    label: 'Buyer', 
    description: 'Looking to buy or rent',
    icon: 'search' 
  },
  { 
    value: 'seller', 
    label: 'Seller', 
    description: 'Listing properties',
    icon: 'home' 
  },
  { 
    value: 'agent', 
    label: 'Agent', 
    description: 'Real estate professional',
    icon: 'briefcase' 
  },
];

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  const { signup, isLoading, authError, clearError, isAuthenticated } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<User['role']>('buyer');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [signupSuccess, setSignupSuccess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep1()) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      setStep(2);
    }
  };

  const handleSignup = async () => {
    const success = await signup(name, email, password, selectedRole);
    if (success) {
      setSignupSuccess(true);
    }
  };

  // Redirect after successful signup
  if (signupSuccess || isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9']}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <Pressable onPress={() => step === 1 ? router.back() : setStep(1)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
              <View style={[styles.stepLine, { backgroundColor: step === 2 ? colors.primary : colors.border }]} />
              <View style={[styles.stepDot, { backgroundColor: step === 2 ? colors.primary : colors.border }]} />
            </View>
          </View>

          {step === 1 ? (
            <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.header}>
                <LinearGradient colors={Colors.gradient.primary} style={styles.iconContainer}>
                  <Ionicons name="person-add" size={32} color="#ffffff" />
                </LinearGradient>
                <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Start your property journey today
                </Text>
              </View>

              <View style={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  icon="person-outline"
                  error={errors.name}
                />

                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="lock-closed-outline"
                  error={errors.password}
                />

                <Button
                  title="Continue"
                  onPress={handleNext}
                  variant="primary"
                  size="lg"
                  gradient
                  fullWidth
                  icon="arrow-forward"
                  iconPosition="right"
                />
              </View>
            </Animated.View>
          ) : (
            <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Choose Your Role</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  How will you use DarCom?
                </Text>
              </View>

              <View style={styles.rolesContainer}>
                {roles.map((role) => (
                  <Pressable
                    key={role.value}
                    onPress={() => setSelectedRole(role.value)}
                    style={[
                      styles.roleCard,
                      { 
                        backgroundColor: colors.card,
                        borderColor: selectedRole === role.value ? colors.primary : colors.border,
                        borderWidth: selectedRole === role.value ? 2 : 1,
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={selectedRole === role.value ? Colors.gradient.primary : [colors.backgroundSecondary, colors.backgroundSecondary]}
                      style={styles.roleIcon}
                    >
                      <Ionicons 
                        name={role.icon} 
                        size={28} 
                        color={selectedRole === role.value ? '#ffffff' : colors.icon} 
                      />
                    </LinearGradient>
                    <View style={styles.roleText}>
                      <Text style={[styles.roleLabel, { color: colors.text }]}>{role.label}</Text>
                      <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
                        {role.description}
                      </Text>
                    </View>
                    {selectedRole === role.value && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </Pressable>
                ))}
              </View>

              {authError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text style={[styles.errorText, { color: colors.error }]}>{authError}</Text>
                </View>
              )}

              <Button
                title="Create Account"
                onPress={handleSignup}
                loading={isLoading}
                variant="primary"
                size="lg"
                gradient
                fullWidth
              />
            </Animated.View>
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Sign In</Text>
            </Pressable>
          </View>

          <Text style={[styles.terms, { color: colors.textSecondary }]}>
            By creating an account, you agree to our{' '}
            <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 44,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  rolesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
    marginLeft: 16,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '700',
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
