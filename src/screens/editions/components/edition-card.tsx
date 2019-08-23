import React from 'react';
import { StyleSheet, View, TextStyle, ViewStyle, Text, TouchableOpacity, Linking } from 'react-native';
import { color } from 'types/colors';
import { Thumbnail } from 'components';
import { thousandsSeparator } from 'utils/number-format';
import { Edition } from 'services/api/fantlab/editions';
const pluralize = require('pluralize-ru');

interface Props {
  edition: Edition;
  translators: string[];
}

export class EditionCard extends React.PureComponent<Props> {
  render() {
    const { edition, translators } = this.props;

    return (
      <View style={s.card}>
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={this.openEditionPage}>
            <Thumbnail auto={null} width={76} height={117} url={edition.thumbnail} />
          </TouchableOpacity>
          <View style={s.yearBlock}>
            <Text style={s.yearText}>{edition.year}</Text>
          </View>
        </View>
        <View>
          {this.title(edition)}
          <Text style={s.descriontion}>{translators ? translators.join(', ') : 'Переводчик не указан'}</Text>
          <Text style={s.descriontion}>{this.pageCount(edition)}</Text>
          <Text style={s.descriontion}>{thousandsSeparator(edition.copies)} изданий</Text>
        </View>
      </View>
    );
  }

  title = (edition: Edition) => {
    if (edition.published) {
      return <Text style={s.title}>{edition.isbns.join('')}</Text>;
    }

    return <Text style={s.title}>Издание запланировано</Text>;
  };

  pageCount = (edition: Edition) => {
    return pluralize(edition.pages, '%d страниц', '%d страница', '%d страницы', '%d страниц');
  };

  openEditionPage = () => Linking.openURL(`https:${this.props.edition.url}`);
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  } as ViewStyle,
  title: {
    fontWeight: '500',
    color: color.PrimaryText,
    marginBottom: 10,
  } as TextStyle,
  descriontion: {
    fontSize: 14,
    color: color.SecondaryText,
    marginBottom: 10,
  } as TextStyle,
  yearBlock: {
    backgroundColor: '#FFDE03',
    borderTopLeftRadius: 5,
    padding: 2,
    position: 'absolute',
    bottom: 0,
    right: 0,
  } as ViewStyle,
  yearText: { color: 'black', fontSize: 16 } as TextStyle,
});
