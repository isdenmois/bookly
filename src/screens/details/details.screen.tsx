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
import { LivelibTab } from './tabs/livelib-tab';
import { ChildrenTab } from './tabs/children-tab';
import { ReviewsTab } from './tabs/reviews-tab';
import { SimilarTab } from './tabs/similar-tab';
import { DetailsTab } from './tabs/details-tab';
import { LivelibReviewsTab } from './tabs/livelib-reviews-tab';

interface Props {
  bookId: string;
  navigation: NavigationStackProp;
  extra?: Partial<BookData>;
  fantlabId?: string;
  initialTab?: string;
}

const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

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
  TABS = {
    MAIN: { key: 'main', title: t('details.briefly'), component: DetailsTab },
    CHILDREN: { key: 'children', title: t('details.content'), component: ChildrenTab },
    REVIEWS: { key: 'reviews', title: t('details.reviews'), component: ReviewsTab },
    SIMILAR: { key: 'similar', title: t('details.similar'), component: SimilarTab },
    DETAILS: { key: 'details', title: t('details.details'), component: DetailsTab },
    LIVELIB: { key: 'livelib', title: t('details.details'), component: LivelibTab },
    L_REVIEWS: { key: 'lreviews', title: t('details.reviews'), component: LivelibReviewsTab },
  };

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
    const TABS = this.TABS;

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
