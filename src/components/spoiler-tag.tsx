import React from 'react';
import { Text } from 'react-native';
import Tag from 'bbcode-to-react/lib/tag';
import { color } from 'types/colors';

export class SpoilerTag extends Tag {
  toReact() {
    return <SpoilerText>{super.getComponents()}</SpoilerText>;
  }
}

const SpoilerText = props => {
  const [spoiler, toggleSpoiler] = React.useState(true);
  const backgroundColor = spoiler ? color.Review : color.LightBackground;

  return (
    <Text style={{ backgroundColor, color: color.Review }} onPress={() => toggleSpoiler(prev => !prev)}>
      {props.children}
    </Text>
  );
};
