import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { inject } from 'services';
import { API } from 'api';
import { Fetcher, ScreenHeader } from 'components';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { EditionTranslators } from 'types/book-extended';
import { Edition } from 'services/api/fantlab/editions';
import { EditionsSort } from './components/editions-sort';
import { EditionCard } from './components/edition-card';

interface Props extends NavigationScreenProps {
  editionIds: number[];
  translators: EditionTranslators;
}

@withNavigationProps()
export class EditionsListScreen extends React.Component<Props> {
  api = inject(API);
  state = { sort: '-year' };
  e = this.props.editionIds.join(',');

  render() {
    return (
      <View style={s.container}>
        <ScreenHeader title={'Список изданий'} />
        <EditionsSort sort={this.state.sort} onChange={this.setSort} />
        <Fetcher contentContainerStyle={s.scroll} api={this.api.editions} e={this.e} sort={this.state.sort} useFlatlist>
          {this.renderEditionsList}
        </Fetcher>
      </View>
    );
  }

  setSort = sort => this.setState({ sort });

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
    paddingBottom: 15,
  } as ViewStyle,
});
