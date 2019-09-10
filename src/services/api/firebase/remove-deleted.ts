import { api } from '../base/api';

type RemoveDeletedResponse = { deleted: number };
type RemoveDeletedRequest = () => Promise<RemoveDeletedResponse>;

export default api.post<RemoveDeletedRequest>('/remove-deleted/:userId');
