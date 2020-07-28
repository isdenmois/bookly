import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import Book from 'store/book';
import { Dialog, Thumbnail } from 'components';
import { ThumbnailList } from './components/thumbnail-list';

interface Props {
  book: Book;
  navigation: NavigationScreenProp<any>;
}

interface State {
  selected: string;
}

@withNavigationProps()
export class ThumbnailSelectModal extends React.Component<Props, State> {
  state: State = { selected: this.props.book.thumbnail };

  render() {
    const book = this.props.book;
    const changed = book.thumbnail !== this.state.selected;

    return (
      <Dialog title='modal.cover' onApply={changed && this.save}>
        <View style={s.thumbnail}>
          <Thumbnail auto='height' width={150} height={200} url={this.state.selected} title={book.title} />
        </View>

        <ThumbnailList book={book} selected={this.state.selected} onSelect={this.setThumbnail} />
      </Dialog>
    );
  }

  setThumbnail = selected => this.setState({ selected });

  close = () => this.props.navigation.goBack();
  save = () => {
    this.close();
    this.updateBook();
  };

  updateBook() {
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
  buttonRow: {
    alignItems: 'center',
    paddingBottom: 5,
  } as ViewStyle,
  thumbnail: {
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
});
