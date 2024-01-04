/*
 * @Author: CP
 * @Date: 2024-01-04 10:19:42
 * @Description: 
 */
import { useNavigate, redirect } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useEffect, useRef } from 'react'

export interface IFrameImpl {
  src?: string
}

const Iframe: React.FC<IFrameImpl> = (props) => {
  const { src } = props

  const navigate = useNavigate()

  useEffect(() => {
    console.log(navigate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleFrameLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.width = '100%'
      iframeRef.current.height = '100%'
    }
  }
  if (!src) {
    redirect('/404')
    return null
  }

  return (
    <iframe
      ref={iframeRef}
      id={nanoid()}
      title="11"
      src={src}
      width="100%"
      height="100%"
      frameBorder={0}
      onLoad={handleFrameLoad}
    ></iframe>
  )
}

export default Iframe
