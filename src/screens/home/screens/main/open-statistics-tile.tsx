import React, { FC } from 'react';

import { Tile } from 'shared/ui';

import { Text } from 'components/theme';
import { MainRoutes } from 'navigation/routes';
import { getNavigation, t } from 'services';

export const OpenStatisticsTile: FC = () => {
  const openStat = () => getNavigation().push(MainRoutes.Stat);

  return (
    <Tile title={t('home.statistics')} onPress={openStat}>
      <Text mt={2} textAlign='center' fontSize={12} color='SecondaryText'>
        {t('home.empty.statistics')}
      </Text>
    </Tile>
  );
};
