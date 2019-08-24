import { Text } from 'react-native';
import Parser from 'bbcode-to-react/lib/parser';
import Tag from 'bbcode-to-react/lib/tag';
import { SpoilerTag } from 'components';

class TextTag extends Tag {
  toReact() {
    return <Text>{super.getComponents()} </Text>;
  }
}

export const parser = new Parser();

parser.registerTag('spoiler', SpoilerTag);
parser.registerTag('*', TextTag);
