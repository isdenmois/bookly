import * as _ from 'lodash'
import * as React from 'react'
import { ActivityIndicator, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { DocumentNode } from 'graphql'
import { Query } from 'react-apollo'
import { Button, List, ListItem } from 'native-base'
import { color } from 'constants/colors'

interface Props {
  query: DocumentNode
  variables?: any
  emptyComponent: any
  itemComponent: any
  resultCountComponent?: any
  request: string
  field: string
}

type State = {
  refresh: boolean
}

export class QueryList extends React.Component<Props, State> {
  state: State = {refresh: false}

  render() {
    return (
        <Query query={this.props.query} variables={this.props.variables}>
          {this.renderResult}
        </Query>
    )
  }

  renderResult = ({ loading, data, fetchMore }) => {
    const { emptyComponent: Empty, itemComponent: Item, resultCountComponent: ResultCount, request, field } = this.props,
          items = _.get(data, [request, field])

    if (loading) return <ActivityIndicator size='large'/>
    if (!loading && _.isEmpty(items)) return <Empty/>

    return (
      <List>
        {ResultCount &&
          <ListItem first>
            <ResultCount count={_.get(data, [request, 'count'])}/>
          </ListItem>
        }
        {_.map(items, item =>
          <ListItem key={item.id}>
            <Item item={item}/>
          </ListItem>
        )}

        {this.state.refresh && <ActivityIndicator size='large'/>}
        {!this.state.refresh && this.renderFetchMore(fetchMore, data[request], items)}
      </List>
    )
  }

  renderFetchMore(fetchMore, data, items) {
    if (_.size(items) >= data.count) return null

    return (
      <Button style={s.button} full onPress={() => this.fetchMoreParams(fetchMore, _.size(items) + 1)}>
        <Text style={s.buttonText}>Загрузить еще</Text>
      </Button>
    )
  }

  fetchMoreParams = (fetchMore, start) => {
    this.setState({refresh: true})

    fetchMore({
      variables: {start},
      updateQuery: updateQueryList(this.props.request, this.props.field),
    })
      .finally(() => this.setState({refresh: false}))
  }
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

const s = StyleSheet.create({
  button: {
    backgroundColor: color.Green,
  } as ViewStyle,

  buttonText: {
    color: 'white',
  } as TextStyle,
})
