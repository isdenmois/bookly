import styled from 'styled-components/native'
import { Constants } from 'expo'

export const StatusBar = styled.View`
  background-color: ${props => props.color || 'white'};
  height: ${Constants.statusBarHeight};
`
