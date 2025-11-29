import { setMode } from 'mode-watcher';
import type { AuthRecord } from 'pocketbase';

export function initializeTheme(user: AuthRecord): void {
  const userSettings = user?.settings as { darkMode?: boolean } | null;

  if (userSettings?.darkMode !== undefined) {
    const isDark = userSettings.darkMode;
    setDarkMode(isDark);
  }
}

export function setDarkMode(isDark: boolean): void {
  setMode(isDark ? 'dark' : 'light');
}
