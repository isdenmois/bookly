import React, { useState } from 'react';
import { useStore } from '@nanostores/react';

import { Tile } from 'shared/ui';

import { t } from 'services/i18n';
import { Box, Text } from 'components/theme';

import { $challengeMessage, $negativeProgressDate, $progressDate, $readingForecast } from '../model';
import { showAlert } from '../lib';

export const ReadingPlan = () => {
  const forecast = useStore($readingForecast);
  const challengeMessage = useStore($challengeMessage);
  const progressDate = useStore($progressDate);
  const negativeProgressDate = useStore($negativeProgressDate);

  const [showDate, setShowDate] = useState(false);
  const toggleShowDate = () => setShowDate(!showDate);
  const showProgress = () => showAlert(challengeMessage);

  return (
    <Tile title={t('home.challenge.plan')} onPress={toggleShowDate} onLongPress={showProgress}>
      <Box mt={1} alignItems='center' justifyContent='center' flex={1}>
        {showDate && (
          <Text fontSize={24} lineHeight={24}>
            {progressDate || negativeProgressDate}
          </Text>
        )}

        {!showDate && (
          <Text fontSize={52} lineHeight={52}>
            {forecast}
          </Text>
        )}

        <Text variant='small' mt={1}>
          {showDate ? t('home.challenge.read-before') : t('home.challenge.ahead')}
        </Text>
      </Box>
    </Tile>
  );
};
