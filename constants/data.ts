import { icons } from "./icons";

export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "bots", title: "Bots", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    name: "Adrian | JS Mastery",
};

export const HOME_BALANCE = {
    amount: 2489.48,
    nextRenewalDate: "2026-03-18T09:00:00.000Z",
};

export const ACTIVE_BOTS: ActiveBot[] = [
    {
        id: "btc-momentum",
        icon: icons.figma, // fallback
        name: "BTC Momentum",
        performance: 15.99,
        currency: "%",
        daysActive: 22,
    },
    {
        id: "eth-breakout",
        icon: icons.notion, // fallback
        name: "ETH Breakout",
        performance: 42.0,
        currency: "%",
        daysActive: 14,
    },
    {
        id: "sol-scalper",
        icon: icons.spotify, // fallback
        name: "SOL Scalper",
        performance: 75.0,
        currency: "%",
        daysActive: 6,
    },
];

export const HOME_BOTS: Bot[] = [
    {
        id: "btc-momentum-bot",
        icon: icons.adobe, // fallback
        name: "BTC Momentum Bot",
        strategy: "Momentum",
        category: "Crypto",
        status: "active",
        startDate: "2025-03-20T10:00:00.000Z",
        performance: 77.49,
        currency: "%",
        billing: "Monthly",
        renewalDate: "2026-03-20T10:00:00.000Z",
        color: "#f5c542",
    },
    {
        id: "eth-breakout-bot",
        icon: icons.github, // fallback
        name: "ETH Breakout Bot",
        strategy: "Breakout",
        category: "Crypto",
        status: "active",
        startDate: "2024-11-24T10:00:00.000Z",
        performance: 59.99,
        currency: "%",
        billing: "Monthly",
        renewalDate: "2026-03-24T10:00:00.000Z",
        color: "#e8def8",
    },
    {
        id: "forex-grid",
        icon: icons.claude, // fallback
        name: "Forex Grid Bot",
        strategy: "Grid",
        category: "Forex",
        status: "paused",
        startDate: "2025-06-27T10:00:00.000Z",
        performance: 2.0,
        currency: "%",
        billing: "Monthly",
        renewalDate: "2026-03-27T10:00:00.000Z",
        color: "#b8d4e3",
    },
    {
        id: "sp500-mean-reversion",
        icon: icons.canva, // fallback
        name: "S&P500 Mean Rev",
        strategy: "Reversion",
        category: "Stocks",
        status: "cancelled",
        startDate: "2024-04-02T10:00:00.000Z",
        performance: -4.99,
        currency: "%",
        billing: "Yearly",
        renewalDate: "2026-04-02T10:00:00.000Z",
        color: "#b8e8d0",
    },
];
