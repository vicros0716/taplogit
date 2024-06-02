const IS_DEV = process.env.ENVIRONMENT === 'development';
const IS_STG = process.env.ENVIRONMENT === 'staging';

export default {
    expo: {
        name: IS_DEV ? 'taplogit (Dev)' : IS_STG ? 'taplogit (Stg)' : 'taplogit',
        slug: 'taplogit',
        owner: 'vicros0716',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'myapp',
        userInterfaceStyle: 'automatic',
        splash: {
            image: './assets/images/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: IS_DEV ? 'com.taplogit.dev' : IS_STG ? 'com.taplogit.stg' : 'com.taplogit',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: IS_DEV ? 'com.taplogit.dev' : IS_STG ? 'com.taplogit.stg' : 'com.taplogit',
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: ['expo-router'],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            eas: {
                projectId: '429042e0-e59f-4f36-8b68-5e757f248871',
            },
        },
    },
};
