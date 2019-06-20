import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Session } from 'services';

interface Props {
  session: Session;
}

interface State {
  totalBooks: string;
}

export class ChallengeEditor extends React.Component<Props, State> {
  state: State = {totalBooks: this.props.session.totalBooks.toString()}

  render() {
    return (
      <View>
        <Text>Хочу читать книг в год</Text>
        <TextInput
          keyboardType='decimal-pad'
          value={this.state.totalBooks}
          onChangeText={this.setBooksCount}
          onSubmitEditing={this.save}
          onBlur={this.save}
        />
      </View>
    )
  }

  setBooksCount = totalBooks => this.setState({totalBooks});
  save = () => this.props.session.setTotalBooks(+this.state.totalBooks);
}
