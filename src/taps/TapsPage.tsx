import { useTapsIt } from '@/taps/TapsContext';
import TapsGraph from '@/taps/TapsGraph';
import { TapsIntervals } from '@/taps/TapsIntervals';
import TapsList from '@/taps/TapsList';

export default function TapsPage() {
    const it = useTapsIt();

    switch (it.view) {
        case 'list':
            return <TapsList />;
        case 'chart':
            return <TapsGraph />;
        case 'intervals':
            return <TapsIntervals />;
    }
}
