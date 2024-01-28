import { fromState } from 'shared/lib';
import { settings } from 'services/settings';
import { atom, computed } from 'nanostores';

export type ChallengeType = 'totalBooks' | 'challengeAudio' | 'challengePaper' | 'challengeWithoutTranslation';
export const $challengeType = atom<ChallengeType>('totalBooks');

export const $totalBooks = fromState(settings, 'totalBooks');
export const $challengeAudio = fromState(settings, 'challengeAudio');
export const $challengePaper = fromState(settings, 'challengePaper');
export const $challengeWithoutTranslation = fromState(settings, 'challengeWithoutTranslation');

export const $challengeCount = computed(
  [$challengeType, $totalBooks, $challengeAudio, $challengePaper, $challengeWithoutTranslation],
  (challengeType, totalBooks, challengeAudio, challengePaper, challengeWithoutTranslation) => {
    return (
      {
        totalBooks,
        challengeAudio,
        challengePaper,
        challengeWithoutTranslation,
      }[challengeType] || 1
    );
  },
);

const TYPE_ORDER: ChallengeType[] = ['totalBooks', 'challengeAudio', 'challengePaper', 'challengeWithoutTranslation'];

export const toggleChallenge = () => {
  const type = $challengeType.get();
  const types = TYPE_ORDER.filter(type => settings[type] > 0);
  const index = types.indexOf(type);
  const nextType = types[(index + 1) % types.length];

  $challengeType.set(nextType);
};

export const $isAuthorsEnabled = fromState(settings, 'authors');
