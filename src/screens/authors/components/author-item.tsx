import React from 'react';
import { Text, ViewStyle, TextStyle, View, ImageStyle, TouchableOpacity, ToastAndroid } from 'react-native';
import Author, { createAuthor } from 'store/author';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor } from 'types/colors';
import { Thumbnail, TouchIcon } from 'components';
import { navigation, database } from 'services';

interface Props {
  author: Author;
  mode: string;
}

const getUrl = author => `https://data.fantlab.ru/images/autors/small/${author.id}`;

export function AuthorItem({ author, mode }: Props) {
  const s = ds[mode];
  const icon = author.fav ? 'times' : 'plus';
  const color = (author.fav ? dynamicColor.ErrorText : dynamicColor.Stars)[mode];
  const toggle = () => toggleAuthorFav(author);
  const search = author.fav ? () => navigation.push('Search', { query: author.name }) : null;
  const CMP: any = author.fav ? TouchableOpacity : View;

  return (
    <View style={s.wrap}>
      <CMP style={s.thumbnail} onPress={search}>
        <Thumbnail cache style={s.image} width={50} height={70} title={author.name} url={getUrl(author)} />
      </CMP>

      <View style={s.row}>
        <CMP style={s.details} onPress={search}>
          <Text style={s.text}>{author.name}</Text>
          {!!s.add && <Text style={s.add}>{getAdd(author)}</Text>}
        </CMP>

        <TouchIcon name={icon} color={color} size={20} onPress={toggle} style={s.icon} />
      </View>
    </View>
  );
}

async function toggleAuthorFav(author: Author) {
  const fav = author.fav ? null : true;
  const add = getAdd(author);

  try {
    if (author.collection) {
      await author.setFav(fav, add);
    } else {
      await createAuthor(database, { id: author.id, name: author.name, add, fav });
    }
  } catch (e) {
    ToastAndroid.show('Не удалось выполнить действи: ' + e?.message, ToastAndroid.LONG);
  }
}

function getAdd(author) {
  return author.add || author.__orig?.add;
}

const ds = new DynamicStyleSheet({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 15,
    paddingBottom: 2,
  } as ViewStyle,
  thumbnail: {
    backgroundColor: dynamicColor.BookItem,
    elevation: 4,
    borderRadius: 5,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderRightWidth: 2,
    borderTopColor: '#0002',
    borderLeftColor: '#0003',
    borderBottomColor: '#0000',
    borderEndWidth: 0,
  } as ViewStyle,
  image: {
    borderRadius: 5,
  } as ImageStyle,
  row: {
    flexDirection: 'row',
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: dynamicColor.BookItem,
    elevation: 4,
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  details: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  text: {
    color: dynamicColor.PrimaryText,
    fontSize: 16,
  } as TextStyle,
  add: {
    color: dynamicColor.PrimaryText,
    fontSize: 12,
  } as TextStyle,
  icon: {
    paddingRight: 10,
  },
});
