jest.mock('@react-native-community/async-storage', () => {
  let storage = null;
  return {
    getItem: jest.fn(() => Promise.resolve(storage)),
    setItem: jest.fn((key, data) => (storage = data)),
    clear: jest.fn(),
  };
});

import AsyncStorage from '@react-native-community/async-storage';
import { session } from '../session';

describe('Session service', () => {
  it('should fills with default data if storage is empty', async () => {
    await session.loadSession();

    expect(session.userId).toBe(null);
    expect(session.totalBooks).toBe(80);
  });

  it('should load data from AsyncStorage', async () => {
    AsyncStorage.setItem('SESSION_KEY', '{"userId": "testID", "totalBooks": 10}');
    await session.loadSession();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('SESSION_KEY');
    expect(session.userId).toBe('testID');
    expect(session.totalBooks).toBe(10);
  });

  it('could set data', () => {
    jest.spyOn(session, 'saveSession');

    session.set('aaa' as any, 'bbb');
    expect(session).not.toHaveProperty('aaa');
    expect(session.saveSession).not.toHaveBeenCalled();

    session.totalBooks = 80;
    session.set('totalBooks', 80);
    expect(session.totalBooks).toBe(80);
    expect(session.saveSession).not.toHaveBeenCalled();

    session.set('totalBooks', 50);
    expect(session.totalBooks).toBe(50);
    expect(session.saveSession).toHaveBeenCalled();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('SESSION_KEY', '{"userId":"testID","totalBooks":50}');
  });

  it('should clear AsyncStorage on stop', () => {
    session.stopSession();

    expect(session.userId).toBeNull();
    expect(session.totalBooks).toBe(80);
    expect(AsyncStorage.clear).toHaveBeenCalled();
  });
});
