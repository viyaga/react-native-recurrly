# AI Rules for Recurrly React Native App

This document outlines the core technologies used in the Recurrly application and provides guidelines for their appropriate use. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen tech stack.

## Tech Stack Overview

1.  **Mobile Framework:** React Native with Expo for a managed workflow, providing a unified development experience across iOS and Android.
2.  **Routing:** Expo Router for file-based navigation, simplifying route management and deep linking.
3.  **Language:** TypeScript for strong typing, enhancing code quality, developer experience, and maintainability.
4.  **Styling:** NativeWind, enabling the use of Tailwind CSS classes directly in React Native components for rapid and consistent UI development.
5.  **Authentication:** Clerk for secure user authentication, sign-up, sign-in, and session management.
6.  **Analytics:** PostHog for comprehensive product analytics, event capturing, user identification, and error tracking.
7.  **State Management:** Zustand for efficient and lightweight global state management.
8.  **Date Handling:** Day.js for all date and time manipulation and formatting.
9.  **Persistence:** `expo-secure-store` for sensitive client-side data (e.g., authentication tokens) and `posthog-react-native`'s internal persistence for analytics data.

## Library Usage Rules

*   **UI/Styling:** All styling must be done using **NativeWind** (Tailwind CSS classes). Avoid inline styles or `StyleSheet.create` unless absolutely necessary for complex animations or platform-specific overrides not covered by NativeWind.
*   **Navigation:** Use **Expo Router** for all navigation within the application. Follow its conventions for file-based routing and dynamic routes.
*   **Authentication:** **Clerk** is the sole provider for user authentication, sign-up, sign-in, and session management. Do not implement custom authentication logic.
*   **Analytics & Event Tracking:** **PostHog** must be used for all product analytics, event capturing, user identification, and error tracking. Ensure PostHog keys are loaded via environment variables.
*   **State Management:** For global or shared application state, prefer **Zustand**. For local component state, use React's `useState` and `useReducer` hooks.
*   **Date & Time Operations:** All date and time formatting, parsing, and manipulation should be handled using **Day.js**.
*   **Environment Variables:** Configuration values (like API keys) must be loaded via `process.env.EXPO_PUBLIC_*` variables, configured in `.env` and exposed through `app.config.js` and `expo-constants`.
*   **Icons:** Use the local image assets defined in `constants/icons.ts`. Do not introduce new icon libraries unless explicitly approved.
*   **Sensitive Data Storage:** For sensitive client-side data persistence (e.g., authentication tokens), use `expo-secure-store`. For general, non-sensitive persistent data, rely on `posthog-react-native`'s built-in persistence or `AsyncStorage` if a new custom storage solution is required.
*   **Conditional Class Names:** Use **`clsx`** for conditionally applying Tailwind CSS classes to elements.