import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { inject, InjectorContext } from 'react-ioc';
import { withNavigationProps } from 'utils/with-navigation-props';
import { FantlabAPI } from 'api';
import { Fetcher } from 'components/fetcher';
import { BookExtended } from 'types/book-extended';
import { BookDetails } from './components/book-details';

function EmptyResult() {
  return <Text>No data</Text>;
}

interface Props extends NavigationScreenProps {
  bookId: string;
}

@withNavigationProps()
export class DetailsScreen extends React.Component<Props> {
  static contextType = InjectorContext;

  api = inject(this, FantlabAPI);

  render() {
    return (
      <Fetcher bookId={this.props.bookId} api={this.api.book} empty={EmptyResult}>
        {this.renderResult}
      </Fetcher>
    );
  }

  renderResult = (data: BookExtended, error) => {
    if (error) {
      return this.renderError(error);
    }

    return <BookDetails book={data} onBack={this.goBack} navigation={this.props.navigation} />;
  };

  renderError(error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }

  goBack = () => this.props.navigation.goBack();
}
