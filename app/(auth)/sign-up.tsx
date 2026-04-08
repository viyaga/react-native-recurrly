import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useState } from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { usePostHog } from 'posthog-react-native';

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
    const { signUp, isSignedIn } = useAuth();
    const router = useRouter();
    const posthog = usePostHog();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Client-side validation
    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length === 0 || password.length >= 8;
    const formValid = emailAddress.length > 0 && password.length >= 8 && emailValid;

    const handleSubmit = async () => {
        if (!formValid) return;

        setLoading(true);
        setError(null);

        const result = await signUp(emailAddress, password);

        if (result.error) {
            setError(result.error);
            posthog.capture('user_sign_up_failed', {
                error_message: result.error,
            });
            setLoading(false);
            return;
        }

        posthog.identify(emailAddress, {
            $set: { email: emailAddress },
            $set_once: { sign_up_date: new Date().toISOString() },
        });
        posthog.capture('user_signed_up', { email: emailAddress });

        router.replace('/(tabs)' as Href);
        setLoading(false);
    };

    // Don't show anything if already signed in
    if (isSignedIn) {
        return null;
    }

    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="auth-screen"
            >
                <ScrollView
                    className="auth-scroll"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="auth-content">
                        {/* Branding */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">BrakoutX AI</Text>
                                    <Text className="auth-wordmark-sub">TRADING BOT</Text>
                                </View>
                            </View>
                            <Text className="auth-title">Create your account</Text>
                            <Text className="auth-subtitle">
                                Start managing your trading bots and algorithm performance
                            </Text>
                        </View>

                        {/* Sign-Up Form */}
                        <View className="auth-card">
                            <View className="auth-form">
                                {error && (
                                    <View className="auth-error-banner">
                                        <Text className="auth-error-text">{error}</Text>
                                    </View>
                                )}

                                <View className="auth-field">
                                    <Text className="auth-label">Email Address</Text>
                                    <TextInput
                                        className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="name@example.com"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        onChangeText={setEmailAddress}
                                        onBlur={() => setEmailTouched(true)}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                    />
                                    {emailTouched && !emailValid && (
                                        <Text className="auth-error">Please enter a valid email address</Text>
                                    )}
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                                        value={password}
                                        placeholder="Create a strong password"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        onBlur={() => setPasswordTouched(true)}
                                        autoComplete="password-new"
                                    />
                                    {passwordTouched && !passwordValid && (
                                        <Text className="auth-error">Password must be at least 8 characters</Text>
                                    )}
                                    {!passwordTouched && (
                                        <Text className="auth-helper">Minimum 8 characters required</Text>
                                    )}
                                </View>

                                <Pressable
                                    className={`auth-button ${(!formValid || loading) && 'auth-button-disabled'}`}
                                    onPress={handleSubmit}
                                    disabled={!formValid || loading}
                                >
                                    <Text className="auth-button-text">
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Sign-In Link */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Already have an account?</Text>
                            <Link href="/(auth)/sign-in" asChild>
                                <Pressable>
                                    <Text className="auth-link">Sign In</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;
