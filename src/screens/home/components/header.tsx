import _ from 'lodash';
import React from 'react';
import { getNavigation, openModal, api } from 'services';
import { SearchBar } from 'components';
import { ActivityIndicator } from 'react-native';
import { t } from 'services/i18n';
import { livelib } from 'screens/search/search.screen';
import { MainRoutes, ModalRoutes } from 'navigation/routes';

interface State {
  query: string;
  fetching: boolean;
}

export class HomeHeader extends React.Component<any, State> {
  state: State = { query: '', fetching: false };

  render() {
    const { fetching, query } = this.state;

    if (fetching) {
      return <ActivityIndicator />;
    }

    return (
      <SearchBar
        placeholder={t('home.search')}
        value={query}
        actionIcon='barcode'
        onChange={this.queryChange}
        onSearch={this.onSearch}
        onAction={this.scan}
      />
    );
  }

  queryChange = query => this.setState({ query });

  onSearch = async () => {
    let screen = MainRoutes.Search;
    let params: any = { query: this.state.query.trim() };

    if (isISBN(params.query)) {
      this.setState({ fetching: true });

      [screen, params] = await this.isbnSearch(params.query);

      this.setState({ fetching: false });
    }

    getNavigation().push(screen, params);
    this.setState({ query: '' });
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
