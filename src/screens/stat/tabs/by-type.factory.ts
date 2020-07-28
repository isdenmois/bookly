import { StatTab, TabTransition, IRow, round, openRead, StatBook } from './shared';
import { t } from 'services';

export interface TypeRow extends IRow {
  rating: number;
  f: any;
}

function ByTypeFactory(books: StatBook[]): TypeRow[] {
  const paper = { r: 0, c: 0 };
  const ebook = { r: 0, c: 0 };
  const audio = { r: 0, c: 0 };
  const withoutTranslation = { r: 0, c: 0 };
  const keep = { r: 0, c: 0 };
  const leave = { r: 0, c: 0 };

  books.forEach(b => {
    if (b.audio) {
      ++audio.c;
      audio.r += b.rating;
    } else if (b.paper) {
      ++paper.c;
      paper.r += b.rating;
    } else {
      ++ebook.c;
      ebook.r += b.rating;
    }

    if (b.withoutTranslation) {
      ++withoutTranslation.c;
      withoutTranslation.r += b.rating;
    }

    if (b.paper) {
      if (b.leave) {
        ++leave.c;
        leave.r += b.rating;
      } else {
        ++keep.c;
        keep.r += b.rating;
      }
    }
  });

  paper.r = round(paper.r / paper.c);
  ebook.r = round(ebook.r / ebook.c);
  audio.r = round(audio.r / audio.c);
  withoutTranslation.r = round(withoutTranslation.r / withoutTranslation.c);
  leave.r = round(leave.r / leave.c);
  keep.r = round(keep.r / keep.c);

  return [
    { id: t('stat.paper'), count: paper.c, rating: paper.r, f: { paper: 'y', audio: 'n' } },
    { id: t('stat.ebook'), count: ebook.c, rating: ebook.r, f: { paper: 'n', audio: 'n' } },
    { id: t('stat.audio'), count: audio.c, rating: audio.r, f: { audio: 'y' } },
    { id: t('stat.eng'), count: withoutTranslation.c, rating: withoutTranslation.r, f: { withoutTranslation: 'y' } },
    { id: t('stat.keep'), count: leave.c && keep.c, rating: keep.r, f: { leave: 'n', paper: 'y' } },
    { id: t('stat.leave'), count: leave.c, rating: leave.r, f: { leave: 'y', paper: 'y' } },
  ].filter(r => r.count > 0);
}

export const transition: TabTransition = {
  enabled: () => true,
  go({ f }: TypeRow, year) {
    openRead(f, year);
  },
};

export const ByType: StatTab = {
  header: ['stat.type', 'stat.books', 'stat.mark'],
  columns: ['id', 'count', 'rating'],
  flexes: [2, 1, 1],
  factory: ByTypeFactory,
};
