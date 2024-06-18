import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { It } from '@/its/It';

export default function TapWidgIt({ it }: { it: It }) {
    // TODO(feature): base the formatted text off the coalesce by choice.
    return (
        <FlexWidget style={styles.container} clickAction="TAP" clickActionData={{ it: it }}>
            <TextWidget text={it.name} style={styles.text} />
            <TextWidget
                text={it.latestTap?.format('MMM D, YYYY @ hh:mm A') ?? 'No tap yet!'}
                style={styles.textSecondary}
            />
        </FlexWidget>
    );
}

const styles = {
    container: {
        alignItems: 'center',
        backgroundColor: '#fbeae4',
        borderRadius: 16,
        height: 'match_parent',
        justifyContent: 'center',
        width: 'match_parent',
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
