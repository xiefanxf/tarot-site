import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

const DAILY_REMINDER_ID = 7801;

async function cancelDailyReminder() {
  await LocalNotifications.cancel({ notifications: [{ id: DAILY_REMINDER_ID }] });
}

async function scheduleDailyReminder(title: string, body: string) {
  await cancelDailyReminder();
  await LocalNotifications.schedule({
    notifications: [{
      id: DAILY_REMINDER_ID,
      title,
      body,
      schedule: { on: { hour: 9, minute: 0 }, repeats: true },
      sound: 'default',
    }],
  });
}

export async function tapHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (!Capacitor.isNativePlatform()) return;
  const impact = style === 'heavy' ? ImpactStyle.Heavy : style === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
  try { await Haptics.impact({ style: impact }); } catch { /* Haptics are an enhancement. */ }
}

export async function successHaptic() {
  if (!Capacitor.isNativePlatform()) return;
  try { await Haptics.notification({ type: NotificationType.Success }); } catch { /* Haptics are an enhancement. */ }
}

export async function configureDailyReminder(enabled: boolean, title: string, body: string) {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    if (!enabled) {
      await cancelDailyReminder();
      return false;
    }

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display === 'prompt') {
      permission = await LocalNotifications.requestPermissions();
    }
    if (permission.display !== 'granted') {
      await cancelDailyReminder();
      return false;
    }

    await scheduleDailyReminder(title, body);
    const pending = await LocalNotifications.getPending();
    return pending.notifications.some(notification => notification.id === DAILY_REMINDER_ID);
  } catch {
    return false;
  }
}

/**
 * Reconcile the saved reminder switch with iOS and refresh localized content.
 * This never prompts: permission requests only happen after an explicit tap.
 */
export async function synchronizeDailyReminder(title: string, body: string) {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const permission = await LocalNotifications.checkPermissions();
    if (permission.display !== 'granted') {
      await cancelDailyReminder();
      return false;
    }

    const pending = await LocalNotifications.getPending();
    const reminder = pending.notifications.find(notification => notification.id === DAILY_REMINDER_ID);
    if (!reminder) return false;

    if (reminder.title !== title || reminder.body !== body) {
      await scheduleDailyReminder(title, body);
    }
    return true;
  } catch {
    return false;
  }
}
