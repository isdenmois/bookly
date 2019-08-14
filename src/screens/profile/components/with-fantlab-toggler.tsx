import React from 'react';
import { observer } from 'mobx-react';
import { ViewStyle, StyleSheet, Switch } from 'react-native';
import { Session, inject } from 'services';
import { ListItem } from 'components';

@observer
export class WithFantlabToggler extends React.Component {
  session = inject(Session);

  render() {
    return (
      <ListItem
        style={s.container}
        rowStyle={s.row}
        label='Синхронизировать с Fantlab'
        onPress={this.toggleWithFantlab}
      >
        <Switch value={this.session.withFantlab} onValueChange={this.toggleWithFantlab} />
      </ListItem>
    );
  }

  toggleWithFantlab = () => this.session.setWithFantlab(!this.session.withFantlab);
}

const s = StyleSheet.create({
  container: {
    width: 'auto',
  } as ViewStyle,
  row: {
    justifyContent: 'space-between',
  } as ViewStyle,
});
