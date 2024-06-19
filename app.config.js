function environmentSpecific(production, preview, development) {
    switch (process.env.ENVIRONMENT) {
        case 'development':
            return development;
        case 'preview':
            return preview;
        default:
            return production;
    }
}

export default {
    expo: {
        name: `taplogit${environmentSpecific('', ' (Stg)', ' (Dev)')}`,
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
            bundleIdentifier: `com.taplogit${environmentSpecific('', '.stg', '.dev')}`,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: `com.taplogit${environmentSpecific('', '.stg', '.dev')}`,
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
