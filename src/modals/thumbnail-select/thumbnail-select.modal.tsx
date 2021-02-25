import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import Book from 'store/book';
import { Dialog } from 'components';
import { ThumbnailEdit } from 'modals/book-editor/components/thumbnail-edit';

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
        <ThumbnailEdit book={book} thumbnail={this.state.selected} onThumbnailChange={this.setThumbnail} />
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
