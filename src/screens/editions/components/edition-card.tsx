import React from 'react';
import { View, TextStyle, ViewStyle, Text, TouchableOpacity, Linking } from 'react-native';
import { dynamicColor, boldText } from 'types/colors';
import { Thumbnail } from 'components';
import { t } from 'services';
import { thousandsSeparator } from 'utils/number-format';
import { Edition } from 'services/api/fantlab/editions';
import { DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  edition: Edition;
  translators: string[];
  mode: string;
}

export class EditionCard extends React.PureComponent<Props> {
  get title() {
    const edition = this.props.edition;

    if (edition.published) {
      return edition.isbns.join(', ') || 'Без ISBN';
    }

    return 'Издание запланировано';
  }

  get translators() {
    const translators = this.props.translators;

    if (translators) {
      return translators.join(', ');
    }

    return 'Переводчик не указан';
  }

  get pageCount() {
    const count = this.props.edition.pages;
    return t('pages', { postProcess: 'ruplur', count });
  }

  render() {
    const edition = this.props.edition;
    const s = ds[this.props.mode];

    return (
      <View style={s.card}>
        <View style={s.thumbnail}>
          <TouchableOpacity activeOpacity={0.5} onPress={this.openEditionPage}>
            <Thumbnail width={76} height={117} url={edition.thumbnail} />
          </TouchableOpacity>
          <View style={s.yearBlock}>
            <Text style={s.yearText}>{edition.year}</Text>
          </View>
        </View>

        <View style={s.info}>
          <Text style={s.title}>{this.title}</Text>
          <Text style={s.description}>{this.translators}</Text>
          <Text style={s.description}>{this.pageCount}</Text>
          <Text style={s.description}>
            {thousandsSeparator(edition.copies)} {t('copies')}
          </Text>
        </View>
      </View>
    );
  }

  openEditionPage = () => Linking.openURL(`https:${this.props.edition.url}`);
}

const ds = new DynamicStyleSheet({
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  info: {
    flex: 1,
  } as ViewStyle,
  title: {
    color: dynamicColor.PrimaryText,
    marginBottom: 10,
    ...boldText,
  } as TextStyle,
  thumbnail: {
    marginRight: 20,
    position: 'relative',
  } as ViewStyle,
  description: {
    fontSize: 14,
    color: dynamicColor.SecondaryText,
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
