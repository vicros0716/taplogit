import { ConfigContext, ExpoConfig } from '@expo/config';
import { WithAndroidWidgetsParams } from 'react-native-android-widget';

function environmentSpecific(production: string, preview: string, development: string) {
    switch (process.env.ENVIRONMENT) {
        case 'development':
            return development;
        case 'preview':
            return preview;
        default:
            return production;
    }
}

const widgetConfig: WithAndroidWidgetsParams = {
    fonts: [
        './assets/fonts/material-symbols/outlined/MaterialSymbolsOutlined.ttf',
        './assets/fonts/material-symbols/rounded/MaterialSymbolsRounded.ttf',
        './assets/fonts/material-symbols/sharp/MaterialSymbolsSharp.ttf',
    ],
    widgets: [
        {
            name: 'TapWidgIt',
            label: 'Tap WidgIt',
            minWidth: '180dp',
            minHeight: '120dp',
            targetCellWidth: 3,
            targetCellHeight: 2,
            description: 'Tap WidgIt',
            previewImage: './assets/widget-preview/tapwidgit.png',
            widgetFeatures: 'reconfigurable',
        },
    ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: `taplogit${environmentSpecific('', ' (Preview)', ' (Development)')}`,
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
        bundleIdentifier: `com.taplogit${environmentSpecific('', '.preview', '.development')}`,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        package: `com.taplogit${environmentSpecific('', '.preview', '.development')}`,
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', ['react-native-android-widget', widgetConfig]],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        eas: {
            projectId: '429042e0-e59f-4f36-8b68-5e757f248871',
        },
    },
});
