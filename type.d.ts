import type { ImageSourcePropType } from "react-native";

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Bot {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        strategy?: string;
        category?: string;
        status?: string;
        startDate?: string;
        performance: number;
        currency?: string;
        billing: string;
        frequency?: string;
        renewalDate?: string;
        color?: string;
    }

    interface BotCardProps extends Omit<Bot, "id"> {
        expanded: boolean;
        onPress: () => void;
        onStopPress?: () => void;
        isStopping?: boolean;
    }

    interface ActiveBot {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        performance: number;
        currency?: string;
        daysActive: number;
    }

    interface ActiveBotCardProps
        extends Omit<ActiveBot, "id"> {}

    interface ListHeadingProps {
        title: string;
    }
}

export {};
