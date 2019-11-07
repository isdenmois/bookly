import React from 'react';
import _ from 'lodash';
import { NavigationStackProp } from 'react-navigation-stack';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject } from 'services';
import { API } from 'api';
import { Fetcher } from 'components';
import Book, { BookData } from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES } from 'types/book-types';
import { BookDetailsTabs } from './components/book-details-tabs';
import { LivelibTab } from './tabs/livelib-tab';
import { ChildrenTab } from './tabs/children-tab';
import { ReviewsTab } from './tabs/reviews-tab';
import { SimilarTab } from './tabs/similar-tab';
import { DetailsTab } from './tabs/details-tab';
import { LivelibReviewsTab } from './tabs/livelib-reviews-tab';

interface Props {
  bookId: string;
  fantlabId: string;
  extra: Partial<BookData>;
  navigation: NavigationStackProp;
}

const TABS = {
  MAIN: { key: 'main', title: 'Кратко', component: DetailsTab },
  CHILDREN: { key: 'children', title: 'Состав', component: ChildrenTab },
  REVIEWS: { key: 'reviews', title: 'Отзывы', component: ReviewsTab },
  SIMILAR: { key: 'similar', title: 'Похожие', component: SimilarTab },
  DETAILS: { key: 'details', title: 'Детали', component: DetailsTab },
  LIVELIB: { key: 'livelib', title: 'Детали', component: LivelibTab },
  L_REVIEWS: { key: 'lreviews', title: 'Отзывы', component: LivelibReviewsTab },
};

const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

@withNavigationProps()
export class DetailsScreen extends React.Component<Props> {
  api = inject(API);

  get isLiveLib() {
    return this.props.bookId.startsWith('l_');
  }

  showChildren(book: BookExtended) {
    return _.size(book.children) > 0;
  }

  showSimilar(book: BookExtended) {
    return !this.isLiveLib && SHOW_SIMILARS_ON.includes(book.type);
  }

  tabs = null;

  render() {
    const api = this.isLiveLib ? this.api.lBook : this.api.book;

    return (
      <Fetcher api={api} bookId={this.props.bookId} collection='books'>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (book: Book & BookExtended) => {
    const isExist = book && !!book.status;

    if (this.props.extra && !isExist) {
      Object.assign(book, this.props.extra);
    }

    this.tabs = this.tabs || [
      ...(this.isLiveLib ? [TABS.LIVELIB] : [TABS.MAIN]),
      ...(this.showChildren(book) ? [TABS.CHILDREN] : []),
      ...(this.isLiveLib ? [TABS.L_REVIEWS] : [TABS.REVIEWS]),
      ...(this.showSimilar(book) ? [TABS.SIMILAR] : []),
      ...(this.isLiveLib ? [] : [TABS.DETAILS]),
    ];

    return (
      <BookDetailsTabs
        book={book}
        isExist={isExist}
        fantlabId={this.props.fantlabId}
        navigation={this.props.navigation}
        tabs={this.tabs}
      />
    );
  };

  goBack = () => this.props.navigation.goBack();
}
