import * as SQLite from 'expo-sqlite';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { It } from '@/its/It';
import ItWidget from '@/its/ItWidget';
import { TapsRepository } from '@/taps/TapsRepository';

const nameToWidget = {
    It: ItWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const Widget = nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
            props.renderWidget(<Widget {...widgetInfo} it={{ id: 1, name: 'test It', isDeleted: false }} />);
            break;

        case 'WIDGET_UPDATE':
            props.renderWidget(<ItWidget it={{ id: 1, name: 'widget updated', isDeleted: false }} />);
            // Not needed for now
            break;

        case 'WIDGET_RESIZED':
            props.renderWidget(<ItWidget it={{ id: 1, name: 'widget updated', isDeleted: false }} />);
            // Not needed for now
            break;

        case 'WIDGET_DELETED':
            // Not needed for now
            break;

        case 'WIDGET_CLICK':
            const db = await SQLite.openDatabaseAsync('taplogit.db');
            const tapsRepository = new TapsRepository(db);
            await tapsRepository.createTap(props.clickActionData?.it as It);
            break;

        default:
            break;
    }
}
