
# 💧 Water Reminder App

## 🚀 How to Run the App

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Expo development server**
   ```bash
   npx expo start
   ```

3. **Run on your device**
   - Download the **Expo Go** app from the App Store (iOS) or Google Play (Android).
   - Scan the QR code shown in your terminal or browser with Expo Go.
   - The app will load and run on your device.

4. **Run on an emulator (optional)**
   - For iOS: Use Xcode Simulator
   - For Android: Use Android Studio Emulator

For more details, see the [Expo documentation](https://docs.expo.dev/get-started/installation/).

A simple Water Reminder app built with Expo (React Native + TypeScript) to help users track daily water intake and receive reminders throughout the day.

## 📱 Core Features

- **Track Daily Water Intake**
   - Tap a button to log a cup of water
   - Display progress as X / Y cups (default goal: 8 cups)
   - Progress saved locally and persists after app reload

- **Daily Reset**
   - Intake resets at midnight automatically
   - Manual "Reset Day" button available

- **Local Storage**
   - Uses AsyncStorage to store water intake per day
   - Stores today’s intake separately for history tracking

- **Notifications**
   - Uses Expo Notifications to remind users to drink water
   - Default: every 2 hours during the day (customizable later)

- **Customizable Goal (Optional)**
   - Users can set a daily water goal (default 8 cups)
   - Goal saved in AsyncStorage

- **History / Analytics (Optional)**
   - Tracks last 7 days of water intake
   - Displays in a bar chart or list

## 🖼️ UI Layout

### Home Screen
- Header: "💧 Water Reminder"
- Progress circle or bar showing today’s progress
- Big “+ Add Cup” button
- Small “Reset Day” button

### Settings Screen (Optional)
- Change daily goal
- Toggle notifications
- Adjust reminder frequency

### History Screen (Optional)
- Show intake from last 7 days
- Display in a simple chart (e.g., react-native-svg-charts)

## ⚙️ Technical Requirements

- **Framework:** Expo (React Native, TypeScript)
- **State:** Local state with React Hooks
- **Storage:** @react-native-async-storage/async-storage
- **Notifications:** expo-notifications
- **Navigation:** @react-navigation/native
- **Charts (optional):** react-native-svg or react-native-chart-kit
