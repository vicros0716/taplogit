import * as SQLite from 'expo-sqlite';
import { requestWidgetUpdateById, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { It } from '@/its/It';
import { ItsRepository } from '@/its/ItsRepository';
import { TapsRepository } from '@/taps/TapsRepository';
import TapWidgIt from '@/widgets/TapWidgIt';
import { WidgetsRepository } from '@/widgets/WidgetsRepository';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const db = await SQLite.openDatabaseAsync('taplogit.db');
    const widgetsRepository = new WidgetsRepository(db);
    const itsRepository = new ItsRepository(db);

    const widgetId = props.widgetInfo.widgetId;
    const it: It = (await itsRepository.getItByWidgetId(widgetId)) ?? {
        id: 0,
        name: 'unconfigured widget',
        isDeleted: false,
        coalesceBy: 'day',
    };
    const tapsRepository = new TapsRepository(db);
    const latestTap = await tapsRepository.getLatestTap(it);

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            props.renderWidget(<TapWidgIt it={it} latestTap={latestTap} />);
            break;

        case 'WIDGET_DELETED':
            await widgetsRepository.forgetWidget(widgetId);
            break;

        case 'WIDGET_CLICK':
            switch (props.clickAction) {
                case 'TAP':
                    await tapsRepository.createTap(it);
                    const latestTap = await tapsRepository.getLatestTap(it);
                    const widgetIds = await widgetsRepository.getWidgetIdsByItId(it.id);
                    await Promise.all(
                        widgetIds.map((widgetId) => {
                            console.log(
                                `requesting update for widget ${widgetId}, should set latest tap to ${latestTap?.tappedAt.format('MMM D, YYYY @ hh:mm A')}`,
                            );
                            return requestWidgetUpdateById({
                                widgetName: 'It',
                                widgetId,
                                renderWidget: () => <TapWidgIt it={it} latestTap={latestTap} />,
                            });
                        }),
                    );
                    break;
            }
    }
}
