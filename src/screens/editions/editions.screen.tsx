import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { api } from 'services';
import { Fetcher, ScreenHeader } from 'components';
import { withNavigationProps } from 'utils/with-navigation-props';
import { withScroll } from 'utils/scroll-to-top';
import { EditionTranslators } from 'types/book-extended';
import { Edition } from 'services/api/fantlab/editions';
import { EditionsSort } from './components/editions-sort';
import { EditionCard } from './components/edition-card';

interface Props {
  editionIds: number[];
  translators: EditionTranslators;
}

@withNavigationProps()
@withScroll
export class EditionsListScreen extends React.Component<Props> {
  state = { sort: '-year' };
  e = this.props.editionIds.join(',');

  render() {
    const count = this.props.editionIds.length;
    return (
      <View style={s.container}>
        <ScreenHeader title={'Список изданий'} />
        {count > 1 && <EditionsSort sort={this.state.sort} onChange={this.setSort} />}
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
      </View>
    );
  }

  setSort = sort => this.setState({ sort });

  renderEditionsList = (edition: Edition) => {
    return <EditionCard key={edition.id} edition={edition} translators={this.props.translators[edition.id]} />;
  };
}

const groupBy = {
  field: 'lang_code',
  title: 'lang',
  sort: [e => (e.id === 'ru' ? 0 : 1), 'title'],
};

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
