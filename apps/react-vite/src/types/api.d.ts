/*
 * @Author: CP
 * @Date: 2024-07-11 16:06:55
 * @Description:
 */

declare namespace Api {
  import type { AxiosError } from 'axios'

  type ResponseSuccessData<T = any> = {
    success: true
    data: T
  }

  type ResponseFailureData<ErrorInfo = any> = {
    data: null
    success: false
    error: AxiosError<ErrorInfo>
  }

  type ResponseData<T = any, ErrorInfo = any> = {
    code: number
    msg: string
  } & (ResponseSuccessData<T> | ResponseFailureData<ErrorInfo>)

  /** common params of paginating */
  interface PaginatingCommonParams {
    /** current page number */
    current: number
    /** page size */
    size: number
    /** total count */
    total: number
  }

  /** common params of paginating query list data */
  interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
    records: T[]
  }

  type CommonSearchParams = Pick<PaginatingCommonParams, 'current' | 'size'>;

}
