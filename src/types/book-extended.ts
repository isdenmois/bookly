import { BookData } from 'store/book';

export interface BookExtended extends BookData {
  year: number;
  description: string;
  language: string;
  languageId: string;
  originalTitle: string;
  editionCount: number;
  genre: string;
  parent: ParentBook[];
}

export interface ParentBook {
  id: string;
  title: string;
  type: string;
}
