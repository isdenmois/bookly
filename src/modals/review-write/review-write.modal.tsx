import React from 'react';
import { ScrollView, TextInput, StyleSheet, ViewStyle, TextStyle, Alert, ToastAndroid } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import { withNavigationProps } from 'utils/with-navigation-props';
import { color } from 'types/colors';
import Book from 'store/book';
import Review, { createReview } from 'store/review';
import { inject } from 'services';
import { dbSync, dbAction } from 'services/db';
import { Button, Dialog } from 'components';

interface Props extends NavigationScreenProps {
  book: Book;
  review?: Review;
}

interface State {
  changed: boolean;
  body: string;
}

const NUMBER_OF_LINES = 10;

@withNavigationProps()
export class ReviewWriteModal extends React.Component<Props, State> {
  state = { changed: false, body: this.props.review ? this.props.review.body : '' };

  database = inject(Database);

  buttonTitle = this.props.review ? 'Обновить' : 'Добавить';

  render() {
    const changed = this.state.changed && Boolean(this.state.body);

    return (
      <Dialog style={s.dialog} title={this.props.book.title} onApply={changed && this.save}>
        <ScrollView style={s.scroll}>
          <TextInput
            style={s.text}
            placeholder='Введите текст отзыва'
            value={this.state.body}
            onChangeText={this.setBody}
            numberOfLines={NUMBER_OF_LINES}
            multiline
          />
        </ScrollView>

        <Button
          disabled={!changed}
          label={this.buttonTitle}
          style={s.button}
          textStyle={s.buttonText}
          onPress={this.save}
        />
      </Dialog>
    );
  }

  setBody = body => this.setState({ body, changed: true });

  save = () => {
    if (this.props.review) {
      this.updateReview();
    } else {
      this.createReview();
    }

    this.props.navigation.pop();
  };

  @dbSync async updateReview() {
    await this.props.review.setBody(this.state.body);

    ToastAndroid.show('Отзыв был обновлен', ToastAndroid.SHORT);
  }

  @dbAction async createReview() {
    const record = await createReview(this.database, this.props.book, this.state.body);

    ToastAndroid.show('Отзыв добавлен', ToastAndroid.SHORT);

    return record;
  }
}

const s = StyleSheet.create({
  dialog: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    overflow: 'hidden',
  } as ViewStyle,
  scroll: {
    borderColor: color.Border,
    borderWidth: 0.5,
    borderRadius: 10,
  } as ViewStyle,
  text: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
  } as TextStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
  buttonText: {
    flex: 1,
  } as ViewStyle,
});
