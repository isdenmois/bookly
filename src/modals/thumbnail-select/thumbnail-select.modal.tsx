import React from 'react';
import { Text, View, TextStyle, ViewStyle, StyleSheet } from 'react-native';
import { InjectorContext } from 'react-ioc';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { dbSync } from 'services/db';
import Book from 'store/book';
import { Dialog } from 'components/dialog';
import { TouchIcon } from 'components/touch-icon';
import { Thumbnail } from 'components/thumbnail';
import { ThumbnailList } from './components/thumbnail-list';

interface Props extends NavigationScreenProps {
  book: Book;
}

interface State {
  selected: string;
}

@withNavigationProps()
export class ThumbnailSelectModal extends React.Component<Props, State> {
  static contextType = InjectorContext;

  state: State = { selected: this.props.book.thumbnail };

  render() {
    const changed = this.props.book.thumbnail !== this.state.selected;

    return (
      <Dialog navigation={this.props.navigation}>
        <View style={s.header}>
          <TouchIcon name='arrow-left' size={24} color='#000' padding={20} onPress={this.close} />
          <Text style={s.title}>Обложка</Text>
          {changed && <TouchIcon name='check' size={24} color='#000' padding={20} onPress={this.save} />}
          {!changed && <View style={s.noSaveIcon} />}
        </View>

        <View style={s.thumbnail}>
          <Thumbnail cache={false} auto='height' width={150} url={this.state.selected} />
        </View>

        <ThumbnailList bookId={this.props.book.id} selected={this.state.selected} onSelect={this.setThumbnail} />
      </Dialog>
    );
  }

  setThumbnail = selected => this.setState({ selected });

  close = () => this.props.navigation.pop();
  save = () => {
    this.close();
    this.updateBook();
  };

  @dbSync updateBook() {
    return this.props.book.setThumbnail(this.state.selected);
  }
}

const s = StyleSheet.create({
  modalStyle: {
    paddingBottom: 10,
  } as ViewStyle,
  scroll: {
    flexGrow: 0,
    marginBottom: 15,
  } as ViewStyle,
  filters: {
    paddingHorizontal: 20,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    color: 'black',
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
  } as TextStyle,
  buttonRow: {
    alignItems: 'center',
    paddingBottom: 5,
  } as ViewStyle,
  thumbnail: {
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  noSaveIcon: {
    width: 60,
  } as ViewStyle,
});
