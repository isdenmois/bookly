import React from 'react';
import { EditableListItem } from './editable-list-item';

const BOOK_TYPES = {
  novel: 'Роман',
  story: 'Повесть',
  shortstory: 'Рассказ',
  other: 'Прочее',
  microstory: 'Микрорассказ',
  documental: 'Документальное произведение',
  collection: 'Сборник',
  poem: 'Стихотворение',
  piece: 'Пьеса',
  cycle: 'Цикл',
  epic: 'Роман-эпопея',
  na: 'Не определено',
};

interface Props {
  value: any;
  onChange: (type: string, value: any) => void;
}

export class BookTypeFilter extends React.Component<Props> {
  render() {
    return (
      <EditableListItem
        title='Тип книги'
        fields={BOOK_TYPES as any}
        value={this.props.value}
        onChange={this.setType}
        clearable
      />
    );
  }

  setType = value => {
    this.props.onChange('type', value);
  };
}
