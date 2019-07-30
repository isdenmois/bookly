import React from 'react';
import { Text } from 'react-native';
import { Tag } from 'bbcode-to-react';
import { color } from 'types/colors';

export class SpoilerTag extends Tag {
  toReact() {
    // Using parent getComponents() to get children components.
    return <SpoilerText>{super.getComponents()}</SpoilerText>;
  }
}

const SpoilerText = (props) => {
  const [spoiler, toggleSpoiler] = React.useState(true);
  const backgroundColor = spoiler ? color.Review : color.Background;

  return (
    <Text style={{ backgroundColor, color: color.Review }} onPress={() => toggleSpoiler(prev => !prev)}>
      {props.children}
    </Text>
  )
};
