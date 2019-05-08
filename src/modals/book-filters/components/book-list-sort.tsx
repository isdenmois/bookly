import React from 'react';
import _ from 'lodash';
import { TouchIcon } from 'components/touch-icon';
import { EditableListItem } from './editable-list-item';

const SORT_LABELS = {
  date: 'дата',
  title: 'название',
  rating: 'рейтинг',
  author: 'автор',
  id: 'id',
};

interface Props {
  fields: string[];
  value: any;
  onChange: (params: any) => void;
}

export class BookListSort extends React.PureComponent<Props> {
  render() {
    const fields: any = _.pick(SORT_LABELS, this.props.fields);

    return (
      <EditableListItem title='Сортировка' fields={fields} value={this.props.value.field} onChange={this.setField}>
        <TouchIcon
          name={this.props.value.desc ? 'arrow-down' : 'arrow-up'}
          paddingVertical={15}
          paddingLeft={15}
          size={18}
          color='black'
          onPress={this.toggleDesc}
        />
      </EditableListItem>
    );
  }

  toggleDesc = () => {
    const prev = this.props.value;

    this.props.onChange({ field: prev.field, desc: !prev.desc });
  };

  setField = field => {
    const desc = this.props.value.desc;

    this.props.onChange({ field, desc });
  };
}