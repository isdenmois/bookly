import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { Fetcher } from 'components';
import { BookExtended } from 'types/book-extended';
import { BookDetails } from './components/book-details';

interface Props extends NavigationScreenProps {
  bookId: string;
}

@withNavigationProps()
export class DetailsScreen extends React.Component<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <Fetcher api={this.api.book} bookId={this.props.bookId}>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (book: BookExtended) => {
    return <BookDetails book={book} onBack={this.goBack} navigation={this.props.navigation} />;
  };

  goBack = () => this.props.navigation.goBack();
}
