import { ReactNode } from 'react'
import { LoaderFunction } from 'react-router-dom'

export interface MetaProps {
  title: string
  key: string
  icon?: string
  isAffix?: boolean
}

export interface RouteObject {
  id?: string
  name?: string
  loader?: LoaderFunction
  element?: ReactNode | null;
  path?: string
  fullPath?: string
  children?: RouteObject[]
  index?: false
  meta?: MetaProps
  errorElement?: React.ReactNode | null;
  Component?: React.ComponentType | null;
}

export enum ExceptionEnum {
  // page not access
  PAGE_NOT_ACCESS = 403,

  // page not found
  PAGE_NOT_FOUND = 404,

  // server error
  SERVER_ERROR = 500
}