import { createBrowserApp } from '@react-navigation/web';

export const createApp = input => createBrowserApp(input, { history: 'hash' });
