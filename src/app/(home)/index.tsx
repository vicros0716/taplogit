import { Link, Stack } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import { IconButton, Switch, Text, useTheme } from 'react-native-paper';
import useScrollExtended from '@/hooks/useScrollExtended';
import CreateItFAB from '@/its/CreateItFAB';
import { EditItDialog } from '@/its/EditItDialog';
import { useDeletedVisible } from '@/its/ItsContext';
import ItsList from '@/its/ItsList';

export default function HomeScreen() {
    const [isExtended, onScroll] = useScrollExtended();
    const [deletedVisible, setDeletedVisible] = useDeletedVisible();
    const theme = useTheme();
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Tap Log It',
                    headerLeft: () => (
                        <Link href="/it-widget-preview">
                            <IconButton icon="code-tags" />
                        </Link>
                    ),
                    headerRight: () => (
                        <>
                            <Text style={{ color: theme.colors.onPrimary }}>Show Deleted</Text>
                            <Switch value={deletedVisible} onValueChange={setDeletedVisible} />
                        </>
                    ),
                }}
            />
            <ItsList onScroll={onScroll} />
            <CreateItFAB extended={isExtended} />
            <EditItDialog />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
