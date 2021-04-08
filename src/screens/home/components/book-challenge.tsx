import _ from 'lodash';
import React, { useMemo, useCallback, useState } from 'react';
import { TouchableOpacity, Alert, Platform } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { t } from 'services/i18n';
import { useSetting } from 'services/settings';
import { dayOfYear, format, daysAmount } from 'utils/date';
import { readBooksThisYearQuery, booksReadForecast, lastReadDateObserver } from '../home.queries';
import { Box, Text } from 'components/theme';
import { getNavigation } from 'services';
import { MainRoutes } from 'navigation/routes';
import { Tile } from './tile';
import { ReadingProgress } from './reading-progress';

const DATE_FORMAT = 'DD.MM';
const formatDate = date => format(date, DATE_FORMAT);

interface Props {
  readCount?: number;
  lastReadDate?: Date;
}

const showAlert = text => (Platform.OS === 'web' ? window.alert(text) : Alert.alert('', text));

function BookChallengeComponent({ readCount, lastReadDate }: Props) {
  const [showDate, setShowDate] = useState(false);
  const totalBooks = useSetting('totalBooks');
  const forecast = useMemo(() => booksReadForecast(readCount, totalBooks), [readCount, totalBooks]);
  const showProgress = useCallback(
    () => showAlert(getChallengeMessage(readCount, totalBooks, new Date(lastReadDate))),
    [readCount, totalBooks, lastReadDate],
  );
  const progressDate = useMemo(
    () =>
      getProgressDate(readCount, totalBooks) || getNegativeProgressDate(readCount, totalBooks, new Date(lastReadDate)),
    [readCount, totalBooks],
  );
  const openSettings = () => getNavigation().push(MainRoutes.Settings);
  const toggleShowDate = () => setShowDate(!showDate);

  return (
    <Box flexDirection='row'>
      <Tile title={t('home.challenge.title')} onPress={showProgress} onLongPress={openSettings}>
        <Box pt={2}>
          <ReadingProgress readCount={readCount} totalBooks={totalBooks} />
        </Box>
      </Tile>

      <Tile title={t('home.challenge.plan')} onPress={toggleShowDate} onLongPress={showProgress}>
        <Box mt={1} alignItems='center' justifyContent='center' flex={1}>
          {showDate && (
            <Text fontSize={24} lineHeight={24}>
              {progressDate}
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
    </Box>
  );
}

export function getChallengeMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  if (readCount >= totalBooks) {
    return t('home.challenge.youve-completed');
  }

  const speed = (daysAmount() - dayOfYear()) / (totalBooks - readCount);

  if (speed < 3) {
    return t('home.challenge.cantdoit');
  }

  return [
    getNegativeProgress(readCount, totalBooks, lastRead),
    getProgressMessage(readCount, totalBooks),
    getZerocastMessage(readCount, totalBooks, lastRead),
    getForecastMessage(readCount, totalBooks, lastRead),
  ]
    .filter(_.identity)
    .join('\n\n');
}

function getProgressDate(readCount: number, totalBooks: number): string {
  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (readCount < needToRead) {
    return null;
  }

  const dueDate = ((readCount + 1) * amount) / totalBooks;
  const date = new Date();

  date.setMonth(0, dueDate);

  return formatDate(date);
}

export function getProgressMessage(readCount: number, totalBooks: number): string {
  const date = getProgressDate(readCount, totalBooks);

  return date && t('home.challenge.advice', { date });
}

function getNegativeProgressDate(readCount: number, totalBooks: number, lastRead: Date) {
  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (readCount >= needToRead) return null;

  const remainDays = amount - today;
  const toRead = totalBooks - readCount;
  let speed = remainDays / toRead;

  let last = dayOfYear(lastRead) + speed;

  while (today > last) {
    last += speed;
    speed = (amount - last) / toRead;
  }

  lastRead = new Date(lastRead);
  lastRead.setMonth(0, last);

  return formatDate(lastRead);
}

export function getNegativeProgress(readCount: number, totalBooks: number, lastRead: Date) {
  const today = dayOfYear();
  const amount = daysAmount();
  const needToRead = Math.floor((today / amount) * totalBooks);

  if (readCount >= needToRead) return null;

  const remainDays = amount - today;
  const toRead = totalBooks - readCount;
  let speed = remainDays / toRead;

  let last = dayOfYear(lastRead) + speed;

  while (today > last) {
    last += speed;
    speed = (amount - last) / toRead;
  }

  lastRead = new Date(lastRead);
  lastRead.setMonth(0, last);

  const rate = Math.round(speed * 10) / 10;

  return t('home.challenge.progress-rate', { date: formatDate(lastRead), rate, postProcess: 'rp' });
}

export function getZerocastMessage(readCount: number, totalBooks: number, lastRead: Date) {
  const total = daysAmount();
  const today = dayOfYear();
  const last = dayOfYear(lastRead);
  const remainDays = total - last;
  const getForecast = d => ((last + d) / total) * totalBooks;
  let speed = remainDays / (totalBooks - readCount);

  if (speed < 3.5 || readCount >= Math.floor(getForecast(0))) return null;

  if (speed > 10) {
    speed = speed / 2;
  } else if (speed > 6) {
    speed = speed - 2;
  } else if (speed > 4.1) {
    speed = speed - 1;
  } else {
    speed = 3;
  }

  const top = speed * (total * readCount - last * totalBooks);
  const bottom = speed * totalBooks - total;
  const add = top / bottom;
  let zero = add + last + 1;
  let due = last + speed;

  while (today > due) {
    due += speed;
    zero += speed;
  }

  const dueDate = new Date();
  const zeroDate = new Date();

  zeroDate.setMonth(0, zero);
  dueDate.setMonth(0, due);
  speed = Math.round(speed * 10) / 10;

  return t('home.challenge.zerocast', {
    date: formatDate(dueDate),
    rate: speed,
    zero: formatDate(zeroDate),
    postProcess: 'rp',
  });
}

export function getForecastMessage(readCount: number, totalBooks: number, lastRead: Date): string {
  const date = new Date();
  const today = dayOfYear();
  const total = daysAmount();
  const last = dayOfYear(lastRead);
  let willRead = Math.round((total / last) * readCount);
  let speed = last / readCount;

  let dueDate = ((readCount + 1) * total) / willRead;

  while (today > dueDate) {
    willRead--;
    dueDate = ((readCount + 1) * total) / willRead;
    speed = dueDate / readCount;
  }

  date.setMonth(0, dueDate);
  speed = Math.round(speed * 10) / 10;

  if (willRead === totalBooks) {
    return null;
  }

  return t('home.challenge.forecast', { date: formatDate(date), rate: speed, count: willRead, postProcess: 'rp' });
}

export const BookChallenge = withObservables(null, () => ({
  readCount: readBooksThisYearQuery().observeCount(),
  lastReadDate: lastReadDateObserver(),
}))(BookChallengeComponent);
