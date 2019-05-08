import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchIcon } from 'components/touch-icon';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value?: string) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  onBack?: () => void;
}

export class SearchBar extends React.Component<Props> {
  render() {
    const { style, value, onChange, onBack } = this.props;

    return (
      <View style={[s.container, style]}>
        {onBack && (
          <TouchIcon
            padding={5}
            style={[s.touchIcon, s.leftIcon]}
            onPress={onBack}
            name='chevron-left'
            size={20}
            color='black'
          />
        )}
        {!onBack && <Icon style={s.searchIcon} name='search' size={20} color='#757575' />}

        <TextInput
          style={s.text}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={this.toSearch}
        />

        {!!value && (
          <TouchIcon
            padding={5}
            style={[s.touchIcon, s.rightIcon]}
            onPress={this.clear}
            name='times'
            size={20}
            color='black'
          />
        )}
      </View>
    );
  }

  clear = () => this.props.onChange('');

  toSearch = () => this.props.value && this.props.onSearch(this.props.value);
}

const s = StyleSheet.create({
  container: {
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'stretch',
  } as ViewStyle,
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
  } as ViewStyle,
  text: {
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 5,
  } as TextStyle,
});
