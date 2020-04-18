import React from 'react';
import { observer } from 'mobx-react';
import { ViewStyle, StyleSheet, Switch } from 'react-native';
import { session } from 'services';
import { ListItem } from 'components';
import { Setting } from 'services/session';

interface Props {
  title: string;
  param: Setting;
}

@observer
export class SessionParamToggler extends React.Component<Props> {
  render() {
    const param = this.props.param;
    const value = !!session[param];

    return (
      <ListItem style={s.container} rowStyle={s.row} label={this.props.title} onPress={this.toggle}>
        <Switch value={value} onValueChange={this.toggle} />
      </ListItem>
    );
  }

  toggle = () => {
    const p = this.props.param;

    session.set(p, !session[p]);
  };
}

const s = StyleSheet.create({
  container: {
    width: 'auto',
  } as ViewStyle,
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
