jest.mock('../api', () => {
  return {
    api: {
      saveSettings: jest.fn(),
      getSettings: jest.fn(),
    },
  };
});
jest.mock('../session', () => {
  return { session: {} };
});
import { session } from '../session';
import { api } from '../api';
import { loadSettings, saveSettings } from '../settings-sync';

describe('Settings sync service', () => {
  describe('save settings', () => {
    beforeEach(() => {
      (api.saveSettings as any).mockReset();
    });

    it("should not save settings if session doesn't change", async () => {
      session.needsToSave = false;

      await saveSettings();

      expect(api.saveSettings).not.toHaveBeenCalled();
    });

    it('should save settings to firebase', async () => {
      session.serialize = () => ({ userId: 1, fantlabAuth: '123', persistState: true, totalBooks: 10 });
      session.needsToSave = true;

      await saveSettings();

      expect(api.saveSettings).toHaveBeenCalledWith({ body: { totalBooks: 10 } });
      expect(session.needsToSave).toBeFalsy();
    });

    it('should log error if server is unavailable', async () => {
      jest.spyOn(console, 'error').mockReturnValue(null);

      session.serialize = () => ({});
      session.needsToSave = true;
      (api.saveSettings as any).mockRejectedValue('test');

      await saveSettings();

      expect(api.saveSettings).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('test');
    });
  });

  describe('load settings', () => {
    beforeEach(() => {
      (api.getSettings as any).mockReset();
      session.setDefaults = jest.fn();
      session.saveSession = jest.fn();
    });

    it('should do nothing if server returns empty response', async () => {
      (api.getSettings as any).mockResolvedValue({});

      await loadSettings();

      expect(session.setDefaults).not.toHaveBeenCalled();
      expect(session.saveSession).not.toHaveBeenCalled();
    });

    it('should load settings from firebase', async () => {
      (api.getSettings as any).mockResolvedValue({ totalBooks: 25 });
      session.serialize = () => ({});
      session.userId = 'test_user';

      await loadSettings();

      expect(api.getSettings).toHaveBeenCalled();
      expect(session.setDefaults).toHaveBeenCalledWith({ totalBooks: 25, userId: 'test_user' });
      expect(session.saveSession).toHaveBeenCalled();
    });

    it('should log error if server is unavailable', async () => {
      jest.spyOn(console, 'error').mockReturnValue(null);

      (api.getSettings as any).mockRejectedValue('test');

      await loadSettings();

      expect(api.getSettings).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('test');
      expect(session.setDefaults).not.toHaveBeenCalled();
      expect(session.saveSession).not.toHaveBeenCalled();
    });
  });
});
