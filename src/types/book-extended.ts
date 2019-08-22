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
  editionIds: number[]
  translators: any
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
