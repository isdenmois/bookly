import React from 'react';
import { ScrollView, TextInput, ViewStyle, TextStyle, ToastAndroid } from 'react-native';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';

import { dynamicColor } from 'types/colors';
import { createReview } from 'store/review';
import { dbAction } from 'services/db';
import { database } from 'store';
import { ModalRoutes, ModalScreenProps } from 'navigation/routes';
import { t } from 'services';
import { Button, Dialog } from 'components';

type Props = ModalScreenProps<ModalRoutes.ReviewWrite>;

interface State {
  changed: boolean;
  body: string;
}

const NUMBER_OF_LINES = 10;

export class ReviewWriteModal extends React.Component<Props, State> {
  static contextType = ColorSchemeContext;

  state = { changed: false, body: this.props.route.params.review ? this.props.route.params.review.body : '' };

  buttonTitle = t(this.props.route.params.review ? 'button.update' : 'button.add');

  render() {
    const changed = this.state.changed && Boolean(this.state.body);
    const s = ds[this.context];

    return (
      <Dialog style={s.dialog} title={this.props.route.params.book.title} onApply={changed && this.save}>
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
    if (this.props.route.params.review) {
      this.updateReview();
    } else {
      this.createReview();
    }

    this.props.navigation.goBack();
  };

  async updateReview() {
    await this.props.route.params.review.setBody(this.state.body);

    ToastAndroid.show(t('modal.review-updated'), ToastAndroid.SHORT);
  }

  @dbAction async createReview() {
    const record = await createReview(database, this.props.route.params.book, this.state.body);

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
