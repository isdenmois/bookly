import React from 'react';
import { ScrollView, TextInput, ViewStyle, TextStyle, ToastAndroid } from 'react-native';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';
import { NavigationScreenProp } from 'react-navigation';
import { withNavigationProps } from 'utils/with-navigation-props';
import { color, dynamicColor } from 'types/colors';
import Book from 'store/book';
import Review, { createReview } from 'store/review';
import { dbAction } from 'services/db';
import { database } from 'store';
import { Button, Dialog } from 'components';
import { t } from 'services';

interface Props {
  navigation: NavigationScreenProp<any>;
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
  static contextType = ColorSchemeContext;

  state = { changed: false, body: this.props.review ? this.props.review.body : '' };

  buttonTitle = t(this.props.review ? 'button.update' : 'button.add');

  render() {
    const changed = this.state.changed && Boolean(this.state.body);
    const s = ds[this.context];

    return (
      <Dialog style={s.dialog} title={this.props.book.title} onApply={changed && this.save}>
        <ScrollView style={s.scroll}>
          <TextInput
            style={s.text}
            placeholder={t('modal.enter-review')}
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

    this.props.navigation.goBack();
  };

  async updateReview() {
    await this.props.review.setBody(this.state.body);

    ToastAndroid.show(t('modal.review-updated'), ToastAndroid.SHORT);
  }

  @dbAction async createReview() {
    const record = await createReview(database, this.props.book, this.state.body);

    ToastAndroid.show(t('modal.review-added'), ToastAndroid.SHORT);

    return record;
  }
}

const ds = new DynamicStyleSheet({
  dialog: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    overflow: 'hidden',
  } as ViewStyle,
  scroll: {
    borderColor: dynamicColor.Border,
    borderWidth: 0.5,
    borderRadius: 10,
  } as ViewStyle,
  text: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
    color: dynamicColor.PrimaryText,
  } as TextStyle,
  button: {
    marginTop: 20,
  } as ViewStyle,
  buttonText: {
    flex: 1,
  } as ViewStyle,
});
