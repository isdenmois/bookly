import React from 'react';
import _ from 'lodash';

import { MainRoutes, MainScreenProps } from 'navigation/routes';
import { api, t } from 'services';
import { Fetcher, Screen } from 'components';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES } from 'types/book-types';
import { ChildrenTab } from './tabs/children-tab';
import { ReviewsTab } from './tabs/reviews-tab';
import { SimilarTab } from './tabs/similar-tab';
import { DetailsTab } from './tabs/details-tab';
import { BookMainInfo } from './components/book-main-info';
import { CoordinatorTabs, CoordinatorHeader, CoordinatorLayout } from 'components/coordinator';

type Props = MainScreenProps<MainRoutes.Details>;

const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

const TABS = {
  MAIN: { key: 'main', title: 'details.briefly', component: DetailsTab },
  CHILDREN: { key: 'children', title: 'details.content', component: ChildrenTab },
  REVIEWS: { key: 'reviews', title: 'details.reviews', component: ReviewsTab },
  SIMILAR: { key: 'similar', title: 'details.similar', component: SimilarTab },
  DETAILS: { key: 'details', title: 'details.details', component: DetailsTab },
  LIVELIB: { key: 'livelib', title: 'details.details', component: DetailsTab },
};

export class DetailsScreen extends React.Component<Props> {
  get isLiveLib() {
    return this.props.route.params.bookId.startsWith('l_');
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
        <Fetcher api={this.isLiveLib ? api.lBook : api.book} bookId={this.props.route.params.bookId} collection='books'>
          {this.renderResult}
        </Fetcher>
      </Screen>
    );
  }

  renderResult = (book: Book & BookExtended) => {
    const isExist = book && !!book.status;
    const params = this.props.route.params;

    if (params.extra && !isExist) {
      Object.assign(book, params.extra);
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
    let initialTab = params.initialTab ? this.tabs.findIndex(tab => tab.key === params.initialTab) : 0;
    initialTab = initialTab < 0 ? 0 : initialTab;

    return (
      <CoordinatorLayout>
        <CoordinatorHeader>
          <BookMainInfo book={book} />
        </CoordinatorHeader>

        <CoordinatorTabs
          tabs={this.tabs}
          initialTab={initialTab}
          extraProps={{ book, isExist, fantlabId: params.fantlabId, navigation: this.props.navigation }}
        />
      </CoordinatorLayout>
    );
  };

  goBack = () => this.props.navigation.goBack();
}
