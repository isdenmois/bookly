import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { inject, InjectorContext } from 'react-ioc';
import { FantlabAPI } from 'api';
import { Fetcher } from 'components/fetcher';
import { BookExtended } from 'types/book-extended';
import { BookDetails } from './components/book-details';

function EmptyResult() {
  return <Text>No data</Text>;
}

export class DetailsScreen extends React.Component<NavigationScreenProps> {
  static contextType = InjectorContext;

  api = inject(this, FantlabAPI);

  render() {
    return (
      <Fetcher bookId={this.props.navigation.getParam('bookId')} api={this.api.book} empty={EmptyResult}>
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
