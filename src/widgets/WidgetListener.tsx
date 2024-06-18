import * as SQLite from 'expo-sqlite';
import { requestWidgetUpdateById } from 'react-native-android-widget';
import { It } from '@/its/It';
import { eventBus } from '@/util/eventBus';
import TapWidgIt from '@/widgets/TapWidgIt';
import { WidgetsRepository } from '@/widgets/WidgetsRepository';

export async function registerWidgetListener() {
    const db = await SQLite.openDatabaseAsync('taplogit.db');
    const widgetsRepository = new WidgetsRepository(db);

    eventBus.listen('onCreateTap', async ({ it }: { it: It }) => {
        const widgetIds = await widgetsRepository.getWidgetIdsByItId(it.id);
        await Promise.all(
            widgetIds.map((widgetId) =>
                requestWidgetUpdateById({
                    widgetName: 'TapWidgIt',
                    widgetId,
                    renderWidget: () => <TapWidgIt it={it} />,
                }),
            ),
        );
    });
}
