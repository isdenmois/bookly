import mockdate from 'mockdate';
import * as util from '../date';

describe('date utils', () => {
  afterAll(() => {
    mockdate.reset();
  });

  it('should formats date with custom mask', () => {
    const date = new Date('2012-01-27T18:30:00Z');

    expect(util.format(date, 'YYYY(YY)-MM-DD HH:mm')).toBe('2012(12)-01-27 22:30');
  });

  it('should formats dates as DD.MM.YYYY', () => {
    const date = '2012-01-27T18:30:00Z';

    expect(util.formatDate(date)).toBe('27.01.2012');
  });

  it('getCurrentYear ', () => {
    mockdate.set('2020-01-01');
    expect(util.getCurrentYear()).toBe(2020);

    mockdate.set('2019-01-01');
    expect(util.getCurrentYear()).toBe(2019);
  });

  it('getStartOfYear', () => {
    mockdate.set('2020-05-10');
    expect(util.getStartOfYear().toISOString()).toBe('2020-01-01T00:00:00.000Z');

    expect(util.getStartOfYear(new Date('2015-12-31')).toISOString()).toBe('2015-01-01T00:00:00.000Z');
  });

  it('should returns current day of the year', () => {
    mockdate.set('2020-01-01');
    expect(util.dayOfYear()).toBe(1);

    mockdate.set('2020-01-07');
    expect(util.dayOfYear()).toBe(7);

    mockdate.set('2020-05-01');
    expect(util.dayOfYear()).toBe(122);

    mockdate.set('2020-12-31');
    expect(util.dayOfYear()).toBe(366);
  });
});
