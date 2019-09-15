import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject } from 'services';
import { API } from 'api';
import { Fetcher } from 'components';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BookDetailsTabs } from './components/book-details-tabs';
import { LivelibInfo } from './components/livelib-info';

interface Props extends NavigationScreenProps {
  bookId: string;
}

@withNavigationProps()
export class DetailsScreen extends React.Component<Props> {
  api = inject(API);

  get isLiveLib() {
    return this.props.bookId.startsWith('l_');
  }

  render() {
    const api = this.isLiveLib ? this.api.lBook : this.api.book;

    return (
      <Fetcher api={api} bookId={this.props.bookId} collection='books'>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (book: Book & BookExtended) => {
    const Component: any = this.isLiveLib ? LivelibInfo : BookDetailsTabs;

    return <Component book={book} isExist={book && !!book.status} navigation={this.props.navigation} />;
  };

  goBack = () => this.props.navigation.goBack();
}
