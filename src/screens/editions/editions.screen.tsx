import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { api } from 'services';
import { Fetcher, Screen } from 'components';
import { ColorSchemeContext } from 'react-native-dynamic';
import { withScroll } from 'utils/scroll-to-top';
import { Edition } from 'services/api/fantlab/editions';
import { EditionsSort } from './components/editions-sort';
import { EditionCard } from './components/edition-card';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

type Props = MainScreenProps<MainRoutes.Editions>;

@withScroll
export class EditionsListScreen extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  state = { sort: '-year' };
  e = this.props.route.params.editionIds.join(',');

  render() {
    const count = this.props.route.params.editionIds.length;
    groupBy.mode = this.context;

    return (
      <Screen>
        <View style={s.container}>{count > 1 && <EditionsSort sort={this.state.sort} onChange={this.setSort} />}</View>

        <Fetcher
          contentContainerStyle={s.scroll}
          api={api.editions}
          e={this.e}
          sort={this.state.sort}
          groupBy={groupBy}
          useFlatlist
        >
          {this.renderEditionsList}
        </Fetcher>
      </Screen>
    );
  }

  setSort = sort => this.setState({ sort });

  renderEditionsList = (edition: Edition) => {
    return (
      <EditionCard
        key={edition.id}
        edition={edition}
        translators={this.props.route.params.translators[edition.id]}
        mode={this.context}
      />
    );
  };
}

const groupBy = {
  field: 'lang_code',
  title: 'lang',
  sort: [e => (e.id === 'ru' ? 0 : 1), 'title'],
  mode: null,
};

const s = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  } as ViewStyle,
  scroll: {
    paddingBottom: 15,
  } as ViewStyle,
});
