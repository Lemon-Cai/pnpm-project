import { Spin, SpinProps } from 'antd'
import { nanoid } from 'nanoid'
import React from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

type ServiceProps = Partial<{ container: string | HTMLElement } & LoadingImpl>

interface LoadingImpl extends SpinProps {
  fullscreen?: boolean,
  service?: (options?: ServiceProps) => LoadingManager;
}


interface LoadingComponent extends React.FC<LoadingImpl> {
  service: (options?: ServiceProps) => LoadingManager;
}

const StyledRoot = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  inset: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s;
`

const Loading: LoadingComponent = ({ fullscreen, ...otherProps }) => {
  if (fullscreen) {
    return (
      <StyledRoot className="loading-fullscreen">
        <Spin {...otherProps} className="loading" />
      </StyledRoot>
    )
  }

  return <Spin {...otherProps} className="loading" />
}

export class LoadingManager {
  private keyMap: Map<string, ReactDOM.Root>
  private cls: string
  private loadingContainer: HTMLElement
  private root: ReactDOM.Root | null = null

  private fullscreenInstance: ReactDOM.Root | null = null

  constructor(options?: Partial<{ container: string | HTMLElement } & LoadingImpl>) {
    this.keyMap = new Map<string, ReactDOM.Root>()
    // 创建唯一的class
    this.cls = nanoid(12)

    this.loadingContainer = document.createElement('div')

    this.addContainerAttribute()

    // this.root =  ReactDOM.createRoot(this.loadingContainer)

    // 生成
    this.show(options)
  }

  // 创建个容器
  addContainerAttribute() {
    let defaultZIndex = 2000
    let loadingNumber: string | null = this.loadingContainer.getAttribute('loading-number')
    if (!loadingNumber) {
      loadingNumber = '1'
    } else {
      loadingNumber = `${Number.parseInt(loadingNumber) + 1}`
    }
    // 
    defaultZIndex += Number(loadingNumber)

    this.loadingContainer.setAttribute('loading-number', loadingNumber)

    this.loadingContainer.classList.add('loading-container', this.cls)

    this.loadingContainer.style.cssText = `
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: ${defaultZIndex}
      `
  }

  private show({
    container,
    ...restProps
  }: Partial<{ container: string | HTMLElement } & LoadingImpl> = {}) {
    let element = container || document.body
    if (typeof element === 'string') {
      element = document.querySelector<HTMLElement>(container as string) || document.body
    }

    let fullscreen = element === document.body && (restProps?.fullscreen ?? true)

    if (fullscreen && this.fullscreenInstance) {
      // 全屏
      return this.fullscreenInstance
    }

    // // 1、不存在重新创建
    // if (!this.loadingContainer) {
    //   this.createContainer()
    // }
    // 2、添加到容器
    element.appendChild(this.loadingContainer as HTMLElement)

    // if (this.loadingContainer!.children?.length > 0) {
    //   // 清空子元素
    //   this.loadingContainer!.replaceChildren()
    // }

    this.root = ReactDOM.createRoot(this.loadingContainer as HTMLElement)
    this.root!.render(<Loading {...restProps} />)

    // const id = nanoid(12)

    // if (!this.root) {
    //   this.root = ReactDOM.createRoot(this.loadingContainer as HTMLElement)
    // }

    // this.root!.render(<Loading {...restProps} />)
    // this.keyMap.set(id, this.root)

    // return id
  }

  hide() {
    this.root?.unmount()

    // 移除当前实例
    this.loadingContainer.parentNode?.removeChild(this.loadingContainer)
    // if (!id) {
    //   this.destroyAll()
    // } else {
    //   const root = this.keyMap.get(id)
    //   if (root) {
    //     root.unmount()
    //     this.keyMap.delete(id)
    //   }
    // }
  }
  /**
   * @deprecated
   */
  destroyAll() {
    this.keyMap.forEach((root, id) => {
      root.unmount()
      this.keyMap.delete(id)
    })
  }
}

// export const loadingService = () => new LoadingManager();

Loading.service = function (options: ServiceProps = {}) {
  return new LoadingManager(options)
}

export default Loading
