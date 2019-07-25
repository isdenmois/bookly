import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { dbSync } from 'services/db';
import Book from 'store/book';
import { Dialog, Thumbnail } from 'components';
import { ThumbnailList } from './components/thumbnail-list';

interface Props extends NavigationScreenProps {
  book: Book;
}

interface State {
  selected: string;
}

@withNavigationProps()
export class ThumbnailSelectModal extends React.Component<Props, State> {
  state: State = { selected: this.props.book.thumbnail };

  render() {
    const changed = this.props.book.thumbnail !== this.state.selected;

    return (
      <Dialog title='Обложка' onApply={changed && this.save}>
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
  buttonRow: {
    alignItems: 'center',
    paddingBottom: 5,
  } as ViewStyle,
  thumbnail: {
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
});
