import "@/global.css"
import {FlatList, Image, Pressable, Text, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import {HOME_BALANCE} from "@/constants/data";
import {icons} from "@/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import ActiveBotCard from "@/components/ActiveBotCard";
import BotCard from "@/components/BotCard";
import CreateBotModal from "@/components/CreateBotModal";
import {useState, useMemo} from "react";
import { useUser } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import { useBotStore } from "@/lib/botStore";
import { ACTIVE_BOTS } from "@/constants/data";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    const { user } = useUser();
    const posthog = usePostHog();
    const [expandedBotId, setExpandedBotId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { bots, addBot } = useBotStore();

    const recentBots = useMemo(() => {
        const now = dayjs();
        const nextWeek = now.add(7, 'days');
        return bots.filter(bot =>
            bot.status === 'active' &&
            dayjs(bot.renewalDate).isAfter(now) &&
            dayjs(bot.renewalDate).isBefore(nextWeek)
        ).sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
    }, [bots]);

    const handleBotPress = (item: Bot) => {
        const isExpanding = expandedBotId !== item.id;
        setExpandedBotId((currentId) => (currentId === item.id ? null : item.id));
        posthog.capture(isExpanding ? 'bot_expanded' : 'bot_collapsed', {
            bot_name: item.name,
            bot_id: item.id,
        });
    };

    const handleCreateBot = (newBot: Bot) => {
        addBot(newBot);
        posthog.capture('bot_created', {
            bot_name: newBot.name,
            bot_performance: newBot.performance,
            bot_frequency: newBot.frequency || 'N/A',
            bot_strategy: newBot.strategy || 'N/A',
        });
    };

    // Get user display name: firstName, fullName, or email
    const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <View className="home-header">
                                <View className="home-user">
                                    <Image
                                        source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                        className="home-avatar"
                                    />
                                    <Text className="home-user-name">{displayName}</Text>
                                </View>

                                <Pressable onPress={() => setIsModalVisible(true)}>
                                    <Image source={icons.add} className="home-add-icon" />
                                </Pressable>
                            </View>

                            <View className="home-balance-card">
                                <Text className="home-balance-label">Balance</Text>

                                <View className="home-balance-row">
                                    <Text className="home-balance-amount">
                                        {formatCurrency(HOME_BALANCE.amount)}
                                    </Text>
                                    <Text className="home-balance-date">
                                        {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                    </Text>
                                </View>
                            </View>

                            <View className="mb-5">
                                <ListHeading title="Top Performing Bots" />

                                <FlatList
                                    data={ACTIVE_BOTS}
                                    renderItem={({ item }) => (<ActiveBotCard {...item} />)}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text className="home-empty-state">No active bots.</Text>}
                                />
                            </View>

                            <ListHeading title="All Bots" />
                        </>
                    )}
                    data={bots}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <BotCard
                            {...item}
                            expanded={expandedBotId === item.id}
                            onPress={() => handleBotPress(item)}
                        />
                    )}
                    extraData={expandedBotId}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No bots deployed yet.</Text>}
                    contentContainerClassName="pb-30"
                />

            <CreateBotModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleCreateBot}
            />
        </SafeAreaView>
    );
}
