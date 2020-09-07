import React from 'react';
import _ from 'lodash';
import { NavigationStackProp } from 'react-navigation-stack';
import { withNavigationProps } from 'utils/with-navigation-props';
import { api, t } from 'services';
import { Fetcher, Screen } from 'components';
import Book, { BookData } from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES } from 'types/book-types';
import { BookDetailsTabs } from './components/book-details-tabs';
import { ChildrenTab } from './tabs/children-tab';
import { ReviewsTab } from './tabs/reviews-tab';
import { SimilarTab } from './tabs/similar-tab';
import { DetailsTab } from './tabs/details-tab';

interface Props {
  bookId: string;
  navigation: NavigationStackProp;
  extra?: Partial<BookData>;
  fantlabId?: string;
  initialTab?: string;
}

const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

const TABS = {
  MAIN: { key: 'main', title: 'details.briefly', component: DetailsTab },
  CHILDREN: { key: 'children', title: 'details.content', component: ChildrenTab },
  REVIEWS: { key: 'reviews', title: 'details.reviews', component: ReviewsTab },
  SIMILAR: { key: 'similar', title: 'details.similar', component: SimilarTab },
  DETAILS: { key: 'details', title: 'details.details', component: DetailsTab },
  LIVELIB: { key: 'livelib', title: 'details.details', component: DetailsTab },
};

@withNavigationProps()
export class DetailsScreen extends React.Component<Props> {
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
    return (
      <Screen>
        <Fetcher api={this.isLiveLib ? api.lBook : api.book} bookId={this.props.bookId} collection='books'>
          {this.renderResult}
        </Fetcher>
      </Screen>
    );
  }

  renderResult = (book: Book & BookExtended) => {
    const isExist = book && !!book.status;

    if (this.props.extra && !isExist) {
      Object.assign(book, this.props.extra);
    }

    this.tabs =
      this.tabs ||
      [
        ...(this.isLiveLib ? [TABS.LIVELIB] : [TABS.MAIN]),
        ...(this.showChildren(book) ? [TABS.CHILDREN] : []),
        TABS.REVIEWS,
        ...(this.showSimilar(book) ? [TABS.SIMILAR] : []),
        ...(this.isLiveLib ? [] : [TABS.DETAILS]),
      ].map(tab => Object.assign(tab, { title: t(tab.title) }));
    let initialTab = this.props.initialTab ? this.tabs.findIndex(tab => tab.key === this.props.initialTab) : 0;
    initialTab = initialTab < 0 ? 0 : initialTab;

    return (
      <BookDetailsTabs
        book={book}
        isExist={isExist}
        fantlabId={this.props.fantlabId}
        navigation={this.props.navigation}
        tabs={this.tabs}
        initialTab={initialTab}
      />
    );
  };

  goBack = () => this.props.navigation.goBack();
}
