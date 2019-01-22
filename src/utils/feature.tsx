import * as React from 'react'
import { check } from 'constants/version'

export function feature(version: string, active: any, inactive: any): any {
  return check(version) ? active : inactive
}

export function Feature({ version, inactive: Inactive = () => null, children }) {
  if (check(version)) {
    return children
  }

  return <Inactive/>
}
