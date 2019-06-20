import React from 'react';
import { ViewStyle, TextStyle, StyleSheet, View, Text, TextInput } from 'react-native';
import { Session } from 'services';

interface Props {
  session: Session;
}

interface State {
  totalBooks: string;
}

export class ChallengeEditor extends React.Component<Props, State> {
  state: State = { totalBooks: this.props.session.totalBooks.toString() };

  render() {
    return (
      <View style={s.container}>
        <Text style={s.text}>Хочу читать книг в год</Text>
        <TextInput
          style={s.input}
          keyboardType='decimal-pad'
          value={this.state.totalBooks}
          onChangeText={this.setBooksCount}
          onSubmitEditing={this.save}
          onBlur={this.save}
        />
      </View>
    );
  }

  setBooksCount = totalBooks => this.setState({ totalBooks });
  save = () => +this.state.totalBooks && this.props.session.setTotalBooks(+this.state.totalBooks);
}

const s = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 30,
    paddingHorizontal: 10,
  } as ViewStyle,
  text: {
    position: 'absolute',
    left: 20,
    top: -10,
    backgroundColor: 'white',
    fontSize: 12,
    color: '#757575',
  } as TextStyle,
  input: {
    fontSize: 18,
    color: 'black',
  } as TextStyle,
});
