import React from 'react';
import { Dialog } from 'components';
import { ThumbnailEdit } from 'modals/book-editor/components/thumbnail-edit';
import { ModalRoutes, ModalScreenProps } from 'navigation/routes';

type Props = ModalScreenProps<ModalRoutes.ThumbnailSelect>;

interface State {
  selected: string;
}

export class ThumbnailSelectModal extends React.Component<Props, State> {
  state: State = { selected: this.props.route.params.book.thumbnail };

  render() {
    const book = this.props.route.params.book;
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
    return this.props.route.params.book.setThumbnail(this.state.selected);
  }
}
