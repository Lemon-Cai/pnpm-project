/*
 * @Author: CP
 * @Date: 2024-07-05 08:52:39
 * @Description:
 */
// import { lazy } from 'react'
import { lazy } from '@loadable/component'

import { LazyLoad } from '@/components/LazyLoad'
import LayoutGuard from '@/layout'

import { RouteObject } from '../types'

// const LayoutGuard = lazy(() => import('@/layout'))


const WangEditor = LazyLoad(lazy(() => import('@/pages/Richtext/WangEditor')))
const Draft = LazyLoad(lazy(() => import('@/pages/Richtext/Draft')))
const Quill = LazyLoad(lazy(() => import('@/pages/Richtext/Quill')))
const Slate = LazyLoad(lazy(() => import('@/pages/Richtext/Slate')))
const TinyMCE = LazyLoad(lazy(() => import('@/pages/Richtext/TinyMCE')))
const Lexical = LazyLoad(lazy(() => import('@/pages/Richtext/Lexical')))

const routeList: RouteObject[] = [
  {
    path: '/richtext',
    name: '富文本编辑',
    element: <LayoutGuard />,
    children: [
      {
        path: 'wangEditor',
        name: 'WangEditor',
        meta: {
          title: 'WangEditor',
          key: 'richtext_wangEditor'
        },
        element: WangEditor,
      },
      {
        path: 'draft',
        name: 'Draft',
        meta: {
          title: 'Draft',
          key: 'richtext_draft'
        },
        element: Draft,
      },
      {
        path: 'quill',
        name: 'Quill',
        meta: {
          title: 'Quill',
          key: 'richtext_quill'
        },
        element: Quill,
      },
      {
        path: 'slate',
        name: 'Slate',
        meta: {
          title: 'Slate',
          key: 'richtext_slate'
        },
        element: Slate,
      },
      {
        path: 'tinyMCE',
        name: 'TinyMCE',
        meta: {
          title: 'TinyMCE',
          key: 'richtext_tinyMCE'
        },
        element: TinyMCE,
      },
      {
        path: 'lexical',
        name: 'Lexical',
        meta: {
          title: 'Lexical',
          key: 'richtext_lexical'
        },
        element: Lexical,
      }
    ]
  }
] as RouteObject[]
export default routeList
