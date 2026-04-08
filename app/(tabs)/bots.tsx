import {Text, View, TextInput, FlatList} from 'react-native'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useState } from "react";
import BotCard from "@/components/BotCard";
import { useBotStore } from "@/lib/botStore";

const SafeAreaView = styled(RNSafeAreaView);

const Bots = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { bots } = useBotStore();

    const filteredBots = bots.filter((bot) =>
        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.strategy?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            <FlatList
                data={filteredBots}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View className="px-5 pt-5">
                        <Text className="text-3xl font-bold text-dark mb-5">Bots</Text>
                        <TextInput
                            className="bg-card rounded-xl px-4 py-3 text-dark mb-4"
                            placeholder="Search bots..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <BotCard
                        {...item}
                        expanded={expandedId === item.id}
                        onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            />
        </SafeAreaView>
    )
}
export default Bots
