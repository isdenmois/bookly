import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject } from 'services';
import { API } from 'api';
import { Fetcher } from 'components';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BookDetailsTabs } from './components/book-details-tabs';

interface Props extends NavigationScreenProps {
  bookId: string;
}

@withNavigationProps()
export class DetailsScreen extends React.Component<Props> {
  api = inject(API);

  render() {
    if (this.props.bookId.startsWith('l_')) {
      return <Text>Еще не реализованно</Text>;
    }

    return (
      <Fetcher api={this.api.book} bookId={this.props.bookId} collection='books'>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (book: Book & BookExtended) => {
    return <BookDetailsTabs book={book} isExist={book && !!book.status} navigation={this.props.navigation} />;
  };

  goBack = () => this.props.navigation.goBack();
}
