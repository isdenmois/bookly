import { fromState } from 'shared/lib';
import { settings } from 'services/settings';

export const $totalBooks = fromState(settings, 'totalBooks');
export const $isAuthorsEnabled = fromState(settings, 'authors');
