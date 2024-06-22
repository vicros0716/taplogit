import { Link, Stack } from 'expo-router';
import { useContext } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { IconButton, Switch, Text, useTheme } from 'react-native-paper';
import useScrollExtended from '@/hooks/useScrollExtended';
import CreateItFAB from '@/its/CreateItFAB';
import { EditItDialog } from '@/its/EditItDialog';
import { ItsContext } from '@/its/ItsContext';
import ItsList from '@/its/ItsList';

export default function HomeScreen() {
    const [isExtended, onScroll] = useScrollExtended();
    const { showDeleted, setShowDeleted, dialogIt, dialogVisible, onDialogConfirm, hideDialog } =
        useContext(ItsContext);
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
                            <Switch value={showDeleted} onValueChange={setShowDeleted} />
                        </>
                    ),
                }}
            />
            <ItsList onScroll={onScroll} />
            <CreateItFAB extended={isExtended} />
            <EditItDialog
                key={dialogIt?.id}
                it={dialogIt}
                visible={dialogVisible}
                onDismiss={hideDialog}
                onConfirm={onDialogConfirm}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
