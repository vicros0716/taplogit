import { WidgetConfigurationScreenProps } from 'react-native-android-widget';
import { FlatList, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import ItWidget from '@/its/ItWidget';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ItsRepository } from '@/its/ItsRepository';
import { It } from '@/its/It';

export function WidgetConfigurationScreen({ widgetInfo, setResult, renderWidget }: WidgetConfigurationScreenProps) {
    const [its, setIts] = useState<It[]>([]);
    useEffect(() => {
        async function setup() {
            const db = await SQLite.openDatabaseAsync('taplogit.db');
            const result = await new ItsRepository(db).getIts();
            setIts(result);
        }

        setup();
    }, []);

    return (
        <View>
            <Text>Select an It</Text>
            <Button onPress={() => setResult('cancel')}>Cancel</Button>
            <FlatList
                data={its}
                renderItem={({ item }) => (
                    <Button
                        onPress={() => {
                            renderWidget(<ItWidget it={item} />);
                            setResult('ok');
                        }}>
                        {item.name}
                    </Button>
                )}
            />
        </View>
    );
}
