import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, ViewStyle, ScrollView, Linking } from 'react-native';
import { color } from 'types/colors';
import { EditionCard } from './components/edition-card';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { Fetcher, ScreenHeader } from 'components';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { BookExtended } from 'types/book-extended';

interface Props extends NavigationScreenProps {
  book: BookExtended
}

@withNavigationProps()
export class EditionsListScreen extends React.Component<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <View style={s.container}>
        <ScreenHeader title={'Список изданий'} />
        <ScrollView contentContainerStyle={s.scroll}>
          <Fetcher api={this.api.editions} e={this.props.book.editionIds.join(',')}>
            {this.renderEditionsList}
          </Fetcher>
        </ScrollView>
      </View>
    );
  }

  renderEditionsList = (edition: Edition) => {
    return <EditionCard key={edition.id} edition={edition} translators={this.props.book.translators[edition.id]} onCoverPress={this.openEditionPage} />
  };

  openEditionPage = (edition: Edition) => Linking.openURL(`https:${edition.url}`);
}

const s = StyleSheet.create({
  container: {
    backgroundColor: color.Background,
    flex: 1,
    marginTop: 40,
    marginHorizontal: 10,
  } as ViewStyle,
  scroll: {
    paddingTop: 25,
    paddingBottom: 20,
  } as ViewStyle,
});

export interface Edition {
  copies: number
  id: number
  image: string
  isbns: string[]
  thumbnail: string
  pages: number
  published: number
  url: string
  year: number
}