import { StatTab, TabTransition, IRow, FactoryProps, byYear, round, openRead } from './shared';

export interface TypeRow extends IRow {
  rating: number;
  f: any;
}

function ByTypeFactory({ books, year }: FactoryProps): TypeRow[] {
  if (year) {
    books = books.filter(byYear(year));
  }

  let paper = 0;
  let paperR = 0;

  let ebook = 0;
  let ebookR = 0;

  let audio = 0;
  let audioR = 0;

  let withoutTranslation = 0;
  let withoutTranslationR = 0;

  books.forEach(b => {
    if (b.audio) {
      ++audio;
      audioR += b.rating;
    } else if (b.paper) {
      ++paper;
      paperR += b.rating;
    } else {
      ++ebook;
      ebookR += b.rating;
    }

    if (b.withoutTranslation) {
      ++withoutTranslation;
      withoutTranslationR += b.rating;
    }
  });

  paperR = round(paperR / paper);
  ebookR = round(ebookR / ebook);
  audioR = round(audioR / audio);
  withoutTranslationR = round(withoutTranslationR / withoutTranslation);

  return [
    { id: 'Бумажных', count: paper, rating: paperR, f: { paper: 'y', audio: 'n' } },
    { id: 'Электронных', count: ebook, rating: ebookR, f: { paper: 'n', audio: 'n' } },
    { id: 'Аудио', count: audio, rating: audioR, f: { audio: 'y' } },
    { id: 'В оригинале', count: withoutTranslation, rating: withoutTranslationR, f: { withoutTranslation: 'y' } },
  ].filter(r => r.count > 0);
}

export const transition: TabTransition = {
  enabled: () => true,
  go({ f }: TypeRow, year) {
    openRead(f, year);
  },
};

export const ByType: StatTab = {
  header: ['Тип', 'Книг', 'Оценка'],
  columns: ['id', 'count', 'rating'],
  flexes: [2, 1, 1],
  factory: ByTypeFactory,
};
