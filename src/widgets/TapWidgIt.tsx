import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import { It } from '@/its/It';
import { GestureTapSvg, ToggleSwitchSvg, ToggleSwitchOffSvg } from '@/util/svgs';

export default function TapWidgIt({ it }: { it: It }) {
    switch (it.type) {
        case 'tap':
            return (
                <FlexWidget style={styles.container} clickAction="TAP" clickActionData={{ it }}>
                    <SvgWidget svg={GestureTapSvg} style={styles.icon} />
                    <TextWidget text={it.name} style={styles.text} />
                    <TextWidget
                        text={it.latestTap?.format('MMM D, YYYY @ hh:mm A') ?? 'No tap yet!'}
                        style={styles.textSecondary}
                    />
                </FlexWidget>
            );
        case 'switch':
            const switchOpen = it.numberOfTaps % 2 === 0;
            return (
                <FlexWidget style={styles.container} clickAction="SWITCH" clickActionData={{ it }}>
                    <SvgWidget svg={switchOpen ? ToggleSwitchOffSvg : ToggleSwitchSvg} style={styles.icon} />
                    <TextWidget text={it.name} style={styles.text} />
                </FlexWidget>
            );
    }
}

const styles = {
    container: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderRadius: 48,
        height: 'match_parent',
        justifyContent: 'center',
        width: 'match_parent',
    },
    icon: {
        height: 44,
        width: 44,
    },
    text: {
        fontSize: 24,
        color: '#55433b',
    },
    textSecondary: {
        fontSize: 12,
        color: '#55433b',
    },
} as const;
