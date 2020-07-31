import React from 'react';
import { ScrollView, ViewStyle, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { dynamicColor, getColor } from 'types/colors';
import { api } from 'services';
import { FantlabThumnail } from 'services/api/fantlab/thumbnails';
import { Fetcher, Thumbnail } from 'components';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';

interface Props {
  book: Book & BookExtended;
  selected: string;
  onSelect: (value: string) => void;
}

const OBSERVE_FIELDS = ['bookId'];

export class ThumbnailList extends React.PureComponent<Props> {
  static contextType = ColorSchemeContext;

  additional = getAdditional(this.props.book.lid);

  render() {
    const s = ds[this.context];
    const book = this.props.book;

    return (
      <ScrollView style={s.container} contentContainerStyle={s.content} horizontal>
        <Fetcher
          observe={OBSERVE_FIELDS}
          api={api.thumbnails}
          bookId={book.id}
          selected={this.props.selected}
          additional={this.additional}
          notSendRequest={book.editionCount === 0}
        >
          {this.renderThumbnail}
        </Fetcher>
      </ScrollView>
    );
  }

  renderThumbnail = (thumbnail: FantlabThumnail) => {
    const s = ds[this.context];
    const color = getColor(this.context);
    const isSelected = thumbnail.url === this.props.selected;
    const onPress: any = isSelected ? null : () => this.props.onSelect(thumbnail.url);

    return (
      <TouchableOpacity key={thumbnail.id} style={s.thumbnail} onPress={onPress}>
        <Thumbnail url={thumbnail.url} auto='width' height={120} />
        {isSelected && (
          <View style={s.check}>
            <Icon name='check' size={12} color={color.PrimaryTextInverse} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
}

function getAdditional(lid: string): any[] {
  if (lid) {
    lid = `l_${lid}`;

    return [{ id: lid, url: lid }];
  }
}

const ds = new DynamicStyleSheet({
  container: {
    borderTopColor: dynamicColor.Border,
    borderTopWidth: 0.5,
    marginTop: 25,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingRight: 15,
  } as ViewStyle,
  thumbnail: {
    marginLeft: 15,
    position: 'relative',
  } as ViewStyle,
  check: {
    borderRadius: 50,
    backgroundColor: dynamicColor.Primary,
    position: 'absolute',
    padding: 4,
    top: 5,
    right: 5,
  } as ViewStyle,
});
