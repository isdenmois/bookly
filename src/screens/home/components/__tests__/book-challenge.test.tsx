jest.mock('services', () => null);
jest.mock('store', () => {});
import mockdate from 'mockdate';
import { getProgressMessage, getZerocastMessage, getForecastMessage } from '../book-challenge';

describe('Book challenge', () => {
  afterAll(() => {
    mockdate.reset();
  });

  describe('Challenge messages', () => {
    it('parts should return correct messages', () => {
      let lastRead = '2020-07-01';
      mockdate.set(lastRead);

      expect(getProgressMessage(40, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 27.07, чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(40, new Date(lastRead))).toBe(
        'Прочитайте книгу до 05.07 (раз в 4.6 дня), чтобы сохранить темп и прочитать 80 книг за год',
      );
      expect(getZerocastMessage(40, 70, new Date(lastRead))).toBeNull();

      expect(getProgressMessage(35, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 06.07 (раз в 5.2 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(35, new Date(lastRead))).toBe(
        'Прочитайте книгу до 06.07 (раз в 5.2 дня), чтобы сохранить темп и прочитать 70 книг за год',
      );
      expect(getZerocastMessage(35, 70, new Date(lastRead))).toBeNull();

      expect(getProgressMessage(30, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 05.07 (раз в 4.6 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(30, new Date(lastRead))).toBe(
        'Прочитайте книгу до 07.07 (раз в 6.1 дня), чтобы сохранить темп и прочитать 60 книг за год',
      );
      expect(getZerocastMessage(30, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 04.07 (раз в 3.6 дня), чтобы выйти в 0 до 27.08',
      );

      expect(getProgressMessage(20, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 04.07 (раз в 3.7 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(20, new Date(lastRead))).toBe(
        'Прочитайте книгу до 10.07 (раз в 9.2 дня), чтобы сохранить темп и прочитать 40 книг за год',
      );
      expect(getZerocastMessage(20, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 04.07 (раз в 3 дня), чтобы выйти в 0 до 17.10',
      );

      expect(getProgressMessage(8, 70, new Date(lastRead))).toBe('Вы не успеете закончить книжный вызов');
      expect(getForecastMessage(8, new Date(lastRead))).toBe(
        'Прочитайте книгу до 23.07 (раз в 22.9 дня), чтобы сохранить темп и прочитать 16 книг за год',
      );
      expect(getZerocastMessage(8, 70, new Date(lastRead))).toBeNull();

      mockdate.set('2020-08-01');

      expect(getProgressMessage(41, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 05.08 (раз в 5.2 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(41, new Date(lastRead))).toBe(
        'Прочитайте книгу до 05.08 (раз в 5.2 дня), чтобы сохранить темп и прочитать 70 книг за год',
      );
      expect(getZerocastMessage(41, 70, new Date(lastRead))).toBeNull();

      expect(getProgressMessage(35, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 02.08 (раз в 4.3 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(35, new Date(lastRead))).toBe(
        'Прочитайте книгу до 06.08 (раз в 6.1 дня), чтобы сохранить темп и прочитать 60 книг за год',
      );
      expect(getZerocastMessage(35, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 03.08 (раз в 3.3 дня), чтобы выйти в 0 до 26.09',
      );

      expect(getProgressMessage(25, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 03.08 (раз в 3.4 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(25, new Date(lastRead))).toBe(
        'Прочитайте книгу до 02.08 (раз в 8.6 дня), чтобы сохранить темп и прочитать 43 книги за год',
      );
      expect(getZerocastMessage(25, 70, new Date(lastRead))).toBeNull();

      expect(getProgressMessage(20, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 03.08 (раз в 3 дня), чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(20, new Date(lastRead))).toBe(
        'Прочитайте книгу до 10.08 (раз в 10.7 дня), чтобы сохранить темп и прочитать 34 книги за год',
      );
      expect(getZerocastMessage(20, 70, new Date(lastRead))).toBeNull();

      expect(getProgressMessage(8, 70, new Date(lastRead))).toBe('Вы не успеете закончить книжный вызов');
      expect(getForecastMessage(8, new Date(lastRead))).toBe(
        'Прочитайте книгу до 22.08 (раз в 26.8 дня), чтобы сохранить темп и прочитать 14 книг за год',
      );
      expect(getZerocastMessage(8, 70, new Date(lastRead))).toBeNull();

      mockdate.set('2020-07-28');
      lastRead = '2020-07-27';
      expect(getProgressMessage(42, 70, new Date(lastRead))).toBe(
        'Прочитайте книгу до 06.08, чтобы успеть выполнить вызов',
      );
      expect(getForecastMessage(42, new Date(lastRead))).toBe(
        'Прочитайте книгу до 01.08 (раз в 5 дней), чтобы сохранить темп и прочитать 73 книги за год',
      );
      expect(getProgressMessage(42, 73, new Date(lastRead))).toBe(
        'Прочитайте книгу до 01.08 (раз в 5 дней), чтобы успеть выполнить вызов',
      );

      expect(getProgressMessage(51, 90, new Date(lastRead))).toBe(
        'Прочитайте книгу до 31.07 (раз в 4 дня), чтобы успеть выполнить вызов',
      );
      expect(getZerocastMessage(51, 90, new Date(lastRead))).toBe(
        'Прочитайте книгу до 30.07 (раз в 3 дня), чтобы выйти в 0 до 06.08',
      );
      expect(getForecastMessage(51, new Date(lastRead))).toBe(
        'Прочитайте книгу до 31.07 (раз в 4.1 дня), чтобы сохранить темп и прочитать 89 книг за год',
      );
    });
  });
});
