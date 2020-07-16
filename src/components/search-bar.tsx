import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color as light, dark } from 'types/colors';
import { TouchIcon } from 'components/touch-icon';
import { DynamicStyleSheet, DynamicValue, ColorSchemeContext } from 'react-native-dynamic';

interface Props {
  value: string;
  actionIcon?: string;
  onChange: (value: string) => void;
  onSearch: (value?: string) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  onBack?: () => void;
  onClose?: () => void;
  onAction?: () => void;
}

export class SearchBar extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  input: TextInput;

  render() {
    const { style, value, actionIcon, onChange, onBack, onAction } = this.props;
    const ds = dynamicStyle[this.context];
    const color = this.context === 'dark' ? dark : light;

    return (
      <View style={style ? [ds.container, style] : ds.container}>
        {onBack && (
          <TouchIcon
            padding={5}
            style={[s.touchIcon, s.leftIcon]}
            onPress={onBack}
            name='chevron-left'
            size={20}
            color={color.PrimaryText}
          />
        )}
        {!onBack && <Icon style={s.searchIcon} name='search' size={20} color={color.SecondaryText} />}

        <TextInput
          style={s.text}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={color.SecondaryText}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={this.toSearch}
          returnKeyType='search'
          ref={this.setInputRef}
        />

        {!!value && (
          <TouchIcon
            padding={5}
            style={[s.touchIcon, s.rightIcon]}
            onPress={this.clear}
            name='times'
            size={20}
            color={color.PrimaryText}
          />
        )}
        {!value && actionIcon && (
          <TouchIcon
            padding={5}
            style={[s.touchIcon, s.rightIcon]}
            onPress={onAction}
            name={actionIcon}
            size={20}
            color={color.PrimaryText}
          />
        )}
      </View>
    );
  }

  setInputRef = input => (this.input = input);

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  clear = () => {
    this.props.onChange('');
    this.focus();
  };

  toSearch = () => {
    if (this.props.value) {
      this.props.onSearch(this.props.value);
    } else if (this.props.onClose) {
      this.props.onClose();
    }
  };
}

const s = StyleSheet.create({
  touchIcon: {
    paddingVertical: 5,
  } as ViewStyle,
  leftIcon: {
    paddingLeft: 5,
  } as ViewStyle,
  rightIcon: {
    paddingRight: 5,
  } as ViewStyle,
  searchIcon: {
    padding: 10,
    paddingRight: 5,
  } as ViewStyle,
  text: {
    flex: 1,
    marginHorizontal: 5,
    fontSize: 16,
    padding: 0,
  } as TextStyle,
});

const dynamicStyle = new DynamicStyleSheet({
  container: {
    height: 40,
    backgroundColor: new DynamicValue(light.SearchBackground, dark.SearchBackground),
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
