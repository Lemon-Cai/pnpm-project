export interface BasicResult {
  code: number,
  msg: string | null
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends BasicResult {
	data?: T;
}
