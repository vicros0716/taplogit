import * as SQLite from 'expo-sqlite';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { It } from '@/its/It';
import ItWidget from '@/its/ItWidget';
import { ItsRepository } from '@/its/ItsRepository';
import { TapsRepository } from '@/taps/TapsRepository';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const db = await SQLite.openDatabaseAsync('taplogit.db');
    const itsRepository = new ItsRepository(db);

    const widgetId = props.widgetInfo.widgetId;
    const it: It = (await itsRepository.getItByWidgetId(widgetId)) ?? {
        id: 0,
        name: 'unconfigured widget',
        isDeleted: false,
        coalesceBy: 'day',
    };

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            props.renderWidget(<ItWidget it={it} />);
            break;

        case 'WIDGET_DELETED':
            await itsRepository.forgetWidget(widgetId);
            break;

        case 'WIDGET_CLICK':
            switch (props.clickAction) {
                case 'TAP':
                    const tapsRepository = new TapsRepository(db);
                    await tapsRepository.createTap(it);
                    break;
            }
    }
}
