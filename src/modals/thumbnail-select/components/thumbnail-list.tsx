import React from 'react';
import _ from 'lodash';
import { ScrollView, Text, StyleSheet, ViewStyle, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import { Fetcher, Thumbnail } from 'components';

function EmptyResult() {
  return <Text>No data</Text>;
}

interface Props {
  bookId: string;
  selected: string;
  onSelect: (value: string) => void;
}

export class ThumbnailList extends React.PureComponent<Props> {
  api = inject(FantlabAPI);

  render() {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.content} horizontal>
        <Fetcher bookId={this.props.bookId} api={this.api.thumbnails} empty={EmptyResult}>
          {(data, error) => this.renderList(data, error)}
        </Fetcher>
      </ScrollView>
    );
  }

  renderList(data, error) {
    if (error) {
      return this.renderError(error);
    }

    return _.map(data.thumbnails, t => this.renderThumbnail(t));
  }

  renderThumbnail(thumbnail) {
    const isSelected = thumbnail.url === this.props.selected;
    const ViewComponent: any = isSelected ? View : TouchableOpacity;

    return (
      <ViewComponent key={thumbnail.id} style={s.thumbnail} onPress={() => this.props.onSelect(thumbnail.url)}>
        <Thumbnail cache={false} url={thumbnail.url} auto='width' height={120} />
        {isSelected && (
          <View style={s.check}>
            <Icon name='check' size={12} color={color.PrimaryTextInverse} />
          </View>
        )}
      </ViewComponent>
    );
  }

  renderError(error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }
}

const s = StyleSheet.create({
  container: {
    borderTopColor: color.Border,
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
    backgroundColor: color.Primary,
    position: 'absolute',
    padding: 4,
    top: 5,
    right: 5,
  } as ViewStyle,
});
