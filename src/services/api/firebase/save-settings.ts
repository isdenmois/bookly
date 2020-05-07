import { api } from '../base/api';

type SaveSettings = (data: { body: Record<string, any> }) => Promise<void>;

export default api.put<SaveSettings>('/:userId/settings.json').contentType('application/json');
