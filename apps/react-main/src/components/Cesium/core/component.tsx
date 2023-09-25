import {
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  HTMLAttributes,
  PropsWithChildren,
  PropsWithoutRef,
  RefAttributes,
  forwardRef,
} from 'react'

import { CesiumContext } from './context'
import { useCesiumComponent, Options } from './hooks'
import { pick } from './utils'

export type RootComponentInternalProps = {
  onUpdate?: () => void
}

export type CesiumComponentOptions<
  Element,
  Props extends RootComponentInternalProps,
  State = any
> = Options<Element, Props, State> & {
  renderContainer?: boolean
  noChildren?: boolean
  containerProps?:
    | (keyof Props)[]
    | ((props: Props) => HTMLAttributes<HTMLDivElement>)
  defaultProps?: Partial<Props>
}

export type CesiumComponentRef<Element> = {
  cesiumElement?: Element
}

export type CesiumComponentType<Element, Props> = ForwardRefExoticComponent<
  PropsWithoutRef<Props> & RefAttributes<CesiumComponentRef<Element>>
>

export const createCesiumComponent = <Element, Props extends {}, State = any>({
  renderContainer,
  noChildren,
  containerProps,
  defaultProps,
  ...options
}: CesiumComponentOptions<Element, Props, State>): CesiumComponentType<
  Element,
  Props
> => {
  const Component: ForwardRefRenderFunction<
    CesiumComponentRef<Element>,
    Props
  > = (props, ref) => {
    const mergedProps = {
      ...defaultProps,
      ...props,
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [provided, mounted, wrapperRef] = useCesiumComponent<Element, Props, State>(
      options,
      mergedProps,
      ref,
    );
    // // 容器ref
    // const wrapperRef = useRef<HTMLDivElement>(null)
    // // 挂载完成，再渲染
    // const [mounted, setMounted] = useState(false)

    // useLayoutEffect(() => {
    //   setMounted(true)
    //   return () => {
    //     setMounted(false)
    //   }
    // }, [])

    if (noChildren) return null

    const children = mounted
      ? 'children' in mergedProps
        ? (mergedProps as PropsWithChildren<Props>).children
        : null
      : null

    const wrappedChildren = renderContainer ? (
      <div
        data-testid='resium-container'
        ref={wrapperRef}
        {...(typeof containerProps === 'function'
          ? containerProps(mergedProps)
          : pick(mergedProps, containerProps))}
      >
        {children}
      </div>
    ) : children ? (
      <>{children}</>
    ) : null

    if (provided) {
      return <CesiumContext.Provider value={provided}>{wrappedChildren}</CesiumContext.Provider>;
    }
    return wrappedChildren
  }

  return forwardRef(Component)
}
