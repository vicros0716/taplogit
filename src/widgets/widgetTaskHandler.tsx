import * as SQLite from 'expo-sqlite';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { DATABASE_NAME } from '@/db/constants';
import { DEFAULT_COALESCE_BY, DEFAULT_IT_TYPE, It } from '@/its/It';
import { ItsRepository } from '@/its/ItsRepository';
import { TapsRepository } from '@/taps/TapsRepository';
import TapWidgIt from '@/widgets/TapWidgIt';
import { WidgetsRepository } from '@/widgets/WidgetsRepository';

export async function widgetTaskHandler({
    clickAction,
    renderWidget,
    widgetAction,
    widgetInfo: { widgetId, widgetName },
}: WidgetTaskHandlerProps) {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    const widgetsRepository = new WidgetsRepository(db);
    const itsRepository = new ItsRepository(db);

    const it: It = (await itsRepository.getItByWidgetId(widgetId)) ?? {
        id: 0,
        name: 'unconfigured widget',
        isDeleted: false,
        type: DEFAULT_IT_TYPE,
        coalesceBy: DEFAULT_COALESCE_BY,
        latestTap: null,
    };
    const tapsRepository = new TapsRepository(db);

    switch (widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            renderWidget(<TapWidgIt it={it} />);
            break;

        case 'WIDGET_DELETED':
            await widgetsRepository.forgetWidget(widgetId);
            break;

        case 'WIDGET_CLICK':
            switch (clickAction) {
                case 'TAP':
                    await tapsRepository.createTap(it);
                    break;
            }
    }
}
