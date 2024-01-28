import React, { FC } from 'react';
import { useStore } from '@nanostores/react';

import { Tile } from 'shared/ui';

import { t } from 'services/i18n';
import { getNavigation, settings } from 'services';
import { Box } from 'components/theme';
import { MainRoutes } from 'navigation/routes';

import { $challengeMessage } from '../model';
import { showAlert } from '../lib';

import { ReadingProgress } from './reading-progress';
import { ReadingPlan } from './reading-plan';
import { $challengeType, toggleChallenge } from 'entities/settings';

export const BookChallenge: FC = () => {
  const challengeMessage = useStore($challengeMessage);
  const challengeType = useStore($challengeType);

  const showProgress = () => {
    const challengeToggleEnabled =
      settings.challengeAudio > 0 || settings.challengePaper > 0 || settings.challengeWithoutTranslation > 0;

    if (challengeToggleEnabled) {
      toggleChallenge();
    } else {
      showAlert(challengeMessage);
    }
  };
  const openChallenge = () => getNavigation().push(MainRoutes.Challenge);

  return (
    <Box flexDirection='row'>
      <Tile title={t(`home.challenge.${challengeType}`)} onPress={showProgress} onLongPress={openChallenge}>
        <Box pt={2}>
          <ReadingProgress />
        </Box>
      </Tile>

      <ReadingPlan />
    </Box>
  );
};
