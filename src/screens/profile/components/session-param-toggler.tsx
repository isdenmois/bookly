import React from 'react';
import { observer } from 'mobx-react';
import { ViewStyle, StyleSheet, Switch } from 'react-native';
import { Session, inject } from 'services';
import { ListItem } from 'components';

interface Props {
  title: string;
  param: keyof Session;
}

@observer
export class SessionParamToggler extends React.Component<Props> {
  session = inject(Session);

  render() {
    const param = this.props.param;
    const value = !!this.session[param];

    return (
      <ListItem style={s.container} rowStyle={s.row} label={this.props.title} onPress={this.toggle}>
        <Switch value={value} onValueChange={this.toggle} />
      </ListItem>
    );
  }

  toggle = () => {
    const p = this.props.param;

    this.session[`set${p[0].toUpperCase()}${p.slice(1)}`](!this.session[p]);
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
