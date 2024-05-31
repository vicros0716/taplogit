import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { It } from '@/its/It';

export default function ItWidget({ it }: { it: It }) {
    return (
        <FlexWidget
            style={{
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 16,
                height: 'match_parent',
                justifyContent: 'center',
                width: 'match_parent',
            }}
            clickAction="TAP"
            clickActionData={{ it: it }}>
            <TextWidget
                text={it.name}
                style={{
                    fontSize: 32,
                    color: '#000000',
                }}
            />
        </FlexWidget>
    );
}
