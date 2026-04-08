import {View, Text, Image} from 'react-native'
import React from 'react'
import {formatCurrency} from "@/lib/utils";

const ActiveBotCard = ({ name, performance, daysActive, icon, currency }: ActiveBot) => {
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                <Image source={icon} className="upcoming-icon" />
                <View>
                    <Text className="upcoming-price">{performance}{currency}</Text>
                    <Text className="upcoming-meta" numberOfLines={1}>
                        {daysActive} days active
                    </Text>
                </View>
            </View>

            <Text className="upcoming-name" numberOfLines={1}>{name}</Text>
        </View>
    )
}
export default ActiveBotCard
