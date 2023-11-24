export {};

// 如果有属性需要挂载在window上需要在这申明
declare global {
  interface Window {
    $uploadWorker: Worker // 上传组件worker线程
    $md5Worker: Worker // 上传组件计算生成 md5 worker线程
  }
}
