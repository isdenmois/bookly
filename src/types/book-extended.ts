import { BookData } from 'store/book';

export interface BookExtended extends BookData {
  year: number;
  description: string;
  language: string;
  languageId: string;
  originalTitle: string;
  otherTitles: string;
  editionCount: number;
  genre: string;
  parent: ParentBook[];
  children: ChildBook[];
  editionIds: number[];
  editionTranslators: EditionTranslators;
  translators: string[];
  films: Film[];
}

export interface ParentBook {
  id: string;
  title: string;
  type: string;
}

export interface ChildBook {
  id: string;
  title: string;
  type: string;
  year?: number;
}

export interface EditionTranslators {
  [editionId: number]: string[];
}

export interface Translator {
  id: string;
  name: string;
  count: number;
}

export interface Film {
  id: string;
  title: string;
  country: string;
  year: number;
}
