import {View, Text} from 'react-native'
import {Link, useLocalSearchParams} from "expo-router";
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';

const BotDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const posthog = usePostHog();

    useEffect(() => {
        // Only capture if id is valid
        if (id && typeof id === 'string' && id.trim()) {
            posthog.capture('bot_details_viewed', { bot_id: id });
        }
    }, [id, posthog]);

    return (
        <View>
            <Text>Bot Details: {id}</Text>
            <Link href="/">Go back</Link>
        </View>
    )
}

export default BotDetails
