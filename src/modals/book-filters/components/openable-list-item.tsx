import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, View, TouchableOpacity } from 'react-native';
import { color } from 'types/colors';
import { ListItem, TouchIcon } from 'components';

interface Props {
  title: string;
  viewValue: string;
  onClear: () => void;
  onClose?: () => void;
}

interface State {
  opened: boolean;
  viewValue?: string;
}

export class OpenableListItem extends React.Component<Props, State> {
  state: State = { opened: false };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state && props.viewValue && props.viewValue !== state.viewValue) {
      return { opened: false, viewValue: props.viewValue };
    }

    return null;
  }

  render() {
    const { title, viewValue, children, onClear } = this.props;
    const defined = Boolean(viewValue);
    const opened = this.state.opened;

    return (
      <ListItem onPress={opened ? null : this.open} value={viewValue} clearable={defined && !opened} onChange={onClear}>
        {!opened && <Text style={s.title}>{title}</Text>}
        {opened && (
          <View style={s.container}>
            <TouchableOpacity onPress={this.close}>
              <Text style={s.title}>{title}</Text>
            </TouchableOpacity>

            {children}
          </View>
        )}
        {defined && !opened && <Text style={s.value}>{viewValue}</Text>}
      </ListItem>
    );
  }

  open = () => this.setState({ opened: true });
  close = () => {
    this.setState({ opened: false });
    this.props.onClose && this.props.onClose();
  };
}

const s = StyleSheet.create({
  title: {
    fontSize: 16,
    color: color.PrimaryText,
  } as TextStyle,
  container: {
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: color.PrimaryText,
    flex: 1,
    textAlign: 'right',
  } as TextStyle,
});
