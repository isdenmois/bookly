import { api } from '../base/api';
import { removeFromCache } from '../base/create-api';

type VoteType = 'plus' | 'minus';
type ReviewVote = (responseId: string, type?: VoteType) => Promise<void>;

export default api
  .get<ReviewVote>('/vote:{responseId}:{type}')
  .withAuth()
  .notParse()
  .query((responseId: string, type: VoteType = 'plus') => ({ responseId, type }))
  .response(() => removeFromCache('/responses'));
