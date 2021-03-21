import _ from 'lodash';
import React from 'react';
import { getNavigation, openModal, api } from 'services';
import { SearchBar, Tag } from 'components';
import { t } from 'services/i18n';
import { livelib } from 'screens/search/search.screen';
import { MainRoutes, ModalRoutes } from 'navigation/routes';
import { ActivityIndicator } from 'components/activity-indicator';
import { Box } from 'components/theme';

interface State {
  query: string;
  fetching: boolean;
  source: 'FantLab' | 'LiveLib';
}

export class HomeSearchScreen extends React.Component<any, State> {
  state: State = { query: '', fetching: false, source: 'FantLab' };

  render() {
    const { fetching, query, source } = this.state;

    if (fetching) {
      return <ActivityIndicator />;
    }

    return (
      <Box px={2} pt={2}>
        <SearchBar
          placeholder={t('home.search')}
          value={query}
          actionIcon='barcode'
          autoFocus
          onChange={this.queryChange}
          onSearch={this.onSearch}
          onAction={this.scan}
        />

        <Box flexDirection='row' mt={2}>
          <Tag title='FantLab' selected={source === 'FantLab'} onPress={this.setFantLab} outline />
          <Tag title='LiveLib' selected={source === 'LiveLib'} onPress={this.setLiveLib} outline />
        </Box>
      </Box>
    );
  }

  queryChange = query => this.setState({ query });

  setFantLab = () => this.setState({ source: 'FantLab' });
  setLiveLib = () => this.setState({ source: 'LiveLib' });

  onSearch = async () => {
    let screen = MainRoutes.Search;
    let params: any = { query: this.state.query.trim(), source: this.state.source };

    if (isISBN(params.query)) {
      this.setState({ fetching: true });

      [screen, params] = await this.isbnSearch(params.query);

      this.setState({ fetching: false });
    }

    getNavigation().push(screen, params);

    setTimeout(() => {
      this.props.navigation.jumpTo('main');
    }, 500);
  };

  async isbnSearch(query): Promise<[MainRoutes, any]> {
    try {
      const works = await searchWorkIds(query);

      if (works.length === 1) {
        return [MainRoutes.Details, works[0]];
      }

      if (works.length > 0) {
        return [MainRoutes.WorkList, { works, title: 'Поиск по ISBN' }];
      }
    } catch (e) {
      console.warn(e.toString());
    }

    return [MainRoutes.Search, { query, source: livelib, paper: true }];
  }

  scan = () => {
    const onScan = (query: string) => this.setState({ query }, this.onSearch);

    openModal(ModalRoutes.ScanIsbn, { onScan });
  };
}

async function searchWorkIds(q): Promise<any[]> {
  const works = [];

  try {
    const editions = await api.searchEditions(q);
    let bookId: string;

    for (let i = 0; i < editions?.length; i++) {
      const editionId = String(editions[i].edition_id);
      const extra = { thumbnail: editionId, paper: true, title: editions[i].name?.replace(/\[(.+?)\]/g, '') };

      if ((bookId = editions[i].name?.match(/\[work=(\d+)\]/)?.[1])) {
        works.push({ bookId, extra });
        continue;
      }

      await sleep(1000);
      delete extra.title;

      const edition = await api.edition(editionId);

      _.map(edition.content, s => {
        bookId = s.match(/\/work(\d+)/)?.[1];

        if (bookId) {
          works.push({ bookId, extra });
        }
      });
    }
  } catch (e) {
    console.warn(e.toString());
  }

  return _.uniqBy(works, 'bookId');
}

function sleep(t: number) {
  return new Promise(r => setTimeout(r, t));
}

function isISBN(query: string) {
  return query.match(/^\d+$/);
}
