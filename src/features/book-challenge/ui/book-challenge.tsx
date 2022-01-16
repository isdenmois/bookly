import React, { FC } from 'react';
import { useStore } from '@nanostores/react';

import { Tile } from 'shared/ui';

import { t } from 'services/i18n';
import { getNavigation } from 'services';
import { Box } from 'components/theme';
import { MainRoutes } from 'navigation/routes';

import { $challengeMessage } from '../model';
import { showAlert } from '../lib';

import { ReadingProgress } from './reading-progress';
import { ReadingPlan } from './reading-plan';

export const BookChallenge: FC = () => {
  const challengeMessage = useStore($challengeMessage);

  const showProgress = () => showAlert(challengeMessage);
  const openSettings = () => getNavigation().push(MainRoutes.Settings);

  return (
    <Box flexDirection='row'>
      <Tile title={t('home.challenge.title')} onPress={showProgress} onLongPress={openSettings}>
        <Box pt={2}>
          <ReadingProgress />
        </Box>
      </Tile>

      <ReadingPlan />
    </Box>
  );
};
