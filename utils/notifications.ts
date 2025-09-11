import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export const requestNotificationPermissions = async () => {
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }
};

export const scheduleWaterReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  // Default: every 2 hours from 8am to 8pm
  const hours = [8, 10, 12, 14, 16, 18, 20];
  for (const hour of hours) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to drink water!',
        body: 'Stay hydrated. Log your ounces in Water Reminder.',
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  }
};
