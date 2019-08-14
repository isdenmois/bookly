import React from 'react';
import { Session, inject } from 'services';
import { ListItem } from 'components';

interface State {
  totalBooks: string;
}

export class ChallengeEditor extends React.Component<any, State> {
  session = inject(Session);
  state: State = { totalBooks: this.session.totalBooks.toString() };

  render() {
    return (
      <ListItem
        label='Хочу читать книг в год'
        keyboardType='decimal-pad'
        value={this.state.totalBooks}
        onChange={this.setBooksCount}
        onSubmit={this.save}
        onBlur={this.save}
      />
    );
  }

  setBooksCount = totalBooks => this.setState({ totalBooks });
  save = () => +this.state.totalBooks && this.session.setTotalBooks(+this.state.totalBooks);
}
