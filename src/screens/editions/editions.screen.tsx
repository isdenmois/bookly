import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { EditionCard } from './components/edition-card';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { Fetcher, ScreenHeader } from 'components';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { EditionTranslators } from 'types/book-extended';
import { Edition } from 'services/api/fantlab/editions';

interface Props extends NavigationScreenProps {
  editionIds: number[];
  translators: EditionTranslators;
}

@withNavigationProps()
export class EditionsListScreen extends React.Component<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <View style={s.container}>
        <ScreenHeader title={'Список изданий'} />
        <Fetcher
          contentContainerStyle={s.scroll}
          api={this.api.editions}
          e={this.props.editionIds.join(',')}
          useFlatlist
        >
          {this.renderEditionsList}
        </Fetcher>
      </View>
    );
  }

  renderEditionsList = (edition: Edition) => {
    return <EditionCard key={edition.id} edition={edition} translators={this.props.translators[edition.id]} />;
  };
}

const s = StyleSheet.create({
  container: {
    backgroundColor: color.Background,
    flex: 1,
    marginHorizontal: 10,
  } as ViewStyle,
  scroll: {
    paddingTop: 25,
    paddingBottom: 20,
  } as ViewStyle,
});
