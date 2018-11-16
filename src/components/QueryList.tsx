import * as _ from 'lodash'
import * as React from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { DocumentNode } from 'graphql'
import { Query } from 'react-apollo'
import { Button, List, ListItem } from 'native-base'

interface Props {
    query: DocumentNode
    variables?: any
    emptyComponent: any
    itemComponent: any
    request: string
    field: string
}

export class QueryList extends React.Component<Props> {
    render() {
        return (
            <Query query={this.props.query} variables={this.props.variables}>
              {this.renderResult}
            </Query>
        )
    }

    renderResult = ({ loading, data, fetchMore }) => {
      const { emptyComponent: Empty, itemComponent: Item, request, field } = this.props,
            items = _.get(data, [request, field])

      if (loading && !items) return <ActivityIndicator size='large'/>
      if (!loading && _.isEmpty(items)) return <Empty/>

      return (
        <List>
          {_.map(items, item =>
            <ListItem key={item.id}>
              <Item item={item}/>
            </ListItem>
          )}

          {loading && <ActivityIndicator size='large'/>}
          {!loading && this.renderFetchMore(fetchMore, data[request], items)}
        </List>
      )
    }

    renderFetchMore(fetchMore, data, items) {
      if (_.size(items) >= data.count) return null

      return (
        <Button full onPress={() => this.fetchMoreParams(fetchMore, _.size(items) + 1)}>
          <Text>Загрузить еще</Text>
        </Button>
      )
    }

    fetchMoreParams = (fetchMore, start) => fetchMore({
      variables: {start},
      updateQuery: updateQueryList(this.props.request, this.props.field),
    })
}

function updateQueryList(request, field) {
  return function (prev, { fetchMoreResult }) {
    return Object.assign({}, prev, {
      [request]: {
        count: prev[request].count,
        [field]: [...prev[request][field], ...fetchMoreResult[request][field]],
        __typename: prev[request].__typename,
      },
    })
  }
}
