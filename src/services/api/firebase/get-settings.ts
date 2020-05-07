import { api } from '../base/api';

type GetSettings = () => Promise<any>;

export default api.get<GetSettings>('/:userId/settings.json');
