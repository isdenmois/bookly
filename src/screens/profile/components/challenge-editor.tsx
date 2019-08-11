import React from 'react';
import { ViewStyle, TextStyle, StyleSheet, View, Text, TextInput } from 'react-native';
import { Session, inject } from 'services';
import { color } from 'types/colors';

interface State {
  totalBooks: string;
}

export class ChallengeEditor extends React.Component<any, State> {
  session = inject(Session);
  state: State = { totalBooks: this.session.totalBooks.toString() };

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
  save = () => +this.state.totalBooks && this.session.setTotalBooks(+this.state.totalBooks);
}

const s = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderColor: color.Border,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 30,
    paddingHorizontal: 10,
  } as ViewStyle,
  text: {
    position: 'absolute',
    left: 20,
    top: -10,
    backgroundColor: color.Background,
    fontSize: 12,
    color: color.SecondaryText,
  } as TextStyle,
  input: {
    fontSize: 18,
    color: color.PrimaryText,
  } as TextStyle,
});
