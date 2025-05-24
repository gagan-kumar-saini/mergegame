import React, { use, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Image,
    Dimensions,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive functions
const responsiveWidth = (percentage: number): number => (screenWidth * percentage) / 100;
const responsiveHeight = (percentage: number): number => (screenHeight * percentage) / 100;
const responsiveFontSize = (size: number): number => {
    const scale = screenWidth / 375; // Base width (iPhone X)
    return Math.round(size * scale);
};

// Device type detection
const isTablet: boolean = screenWidth >= 768;
const isSmallDevice: boolean = screenWidth < 350;

const LoginScreen: React.FC = () => {
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '1056091076727-8tpphq5b9m1utqa1uk76thon8uq7fsim.apps.googleusercontent.com',
        });
    }, []);

    const handleGoogleLogin = (): void => {
        console.log('Google login pressed');
        GoogleSignin.signIn()
            .then((userInfo) => {
                console.log('User Info: ', userInfo);
                // Handle successful login here
            })
            .catch((error) => {
                console.error('Google Sign-In Error: ', error);
                // Handle login error here
            });
    };

    const handleFacebookLogin = (): void => {
        console.log('Facebook login pressed');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

            <ImageBackground
                source={require('../assets/images/login-backgroud.png')}
                style={styles.gradient}
                resizeMode="cover"
            >
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Login Buttons Section */}
                <View style={styles.buttonContainer}>
                    {/* Google Login Button */}
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleLogin}
                        activeOpacity={0.8}
                    >
                        <View style={styles.buttonContent}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../assets/images/google-icon.png')}
                                    style={styles.buttonIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.googleButtonText}>Log In with Google</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Facebook Login Button */}
                    <TouchableOpacity
                        style={styles.facebookButton}
                        onPress={handleFacebookLogin}
                        activeOpacity={0.8}
                    >
                        <View style={styles.buttonContent}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../assets/images/facebook-icon.png')}
                                    style={styles.buttonIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.facebookButtonText}>Log In with Facebook</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

interface Styles {
    container: ViewStyle;
    gradient: ViewStyle;
    logoContainer: ViewStyle;
    logo: ImageStyle;
    buttonContainer: ViewStyle;
    googleButton: ViewStyle;
    facebookButton: ViewStyle;
    buttonContent: ViewStyle;
    iconContainer: ViewStyle;
    buttonIcon: ImageStyle;
    googleButtonText: TextStyle;
    facebookButtonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: '#1e3a8a',
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(5), // 5% of screen width
        paddingVertical: responsiveHeight(5), // 5% of screen height
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
        // Adjust margin based on device size
        marginTop: isTablet ? -responsiveHeight(8) : -responsiveHeight(12),
    },
    logo: {
        width: Math.min(responsiveWidth(85), 400), // Max 400px, min 85% of screen
        height: isTablet ? responsiveHeight(15) : responsiveHeight(12),
        maxHeight: 120,
    },
    buttonContainer: {
        paddingBottom: responsiveHeight(5),
        paddingHorizontal: responsiveWidth(2),
        gap: responsiveHeight(2), // Responsive gap
    },
    googleButton: {
        backgroundColor: '#ffffff',
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(5),
        minHeight: responsiveHeight(7), // Minimum touch target
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Ensure minimum width for small devices
        minWidth: isSmallDevice ? responsiveWidth(90) : 'auto',
    },
    facebookButton: {
        backgroundColor: '#1877f2',
        borderRadius: responsiveWidth(2),
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(5),
        minHeight: responsiveHeight(7), // Minimum touch target
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Ensure minimum width for small devices
        minWidth: isSmallDevice ? responsiveWidth(90) : 'auto',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        width: responsiveWidth(6),
        height: responsiveWidth(6),
        minWidth: 20,
        minHeight: 20,
        maxWidth: 28,
        maxHeight: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(3),
    },
    buttonIcon: {
        width: '100%',
        height: '100%',
    },
    googleButtonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '500',
        color: '#333333',
        textAlign: 'center',
    },
    facebookButtonText: {
        fontSize: responsiveFontSize(16),
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },

    // Tablet-specific overrides
    ...(isTablet && {
        logoContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: responsiveWidth(10),
            marginTop: -responsiveHeight(8),
        },
        buttonContainer: {
            paddingBottom: responsiveHeight(8),
            paddingHorizontal: responsiveWidth(15),
            gap: responsiveHeight(2.5),
            alignItems: 'center',
        },
        googleButton: {
            maxWidth: 400,
            width: '100%',
        },
        facebookButton: {
            maxWidth: 400,
            width: '100%',
        },
    }),

    // Small device adjustments
    ...(isSmallDevice && {
        gradient: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(3),
        },
        logoContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: responsiveWidth(3),
            marginTop: -responsiveHeight(15),
        },
        buttonContainer: {
            paddingBottom: responsiveHeight(4),
            gap: responsiveHeight(1.5),
        },
    }),
});

export default LoginScreen;