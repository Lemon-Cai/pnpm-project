/*
 * @Author: CP
 * @Date: 2023-11-16 10:05:26
 * @Description: 文件上传，支持大文件、断点续传，刷新后续传
 */
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeMount,
  renderSlot,
  cloneVNode,
  getCurrentInstance,
  // h,
  type SetupContext
} from 'vue'
import {
  ElUpload,
  // ElNotification,
  // ElProgress,
  type UploadFile,
  type UploadFiles
} from 'element-plus'
import * as EXIFR from 'exifr'
import type { AxiosResponse } from 'axios'

// import CustomProcess from './Progress.vue'

import WorkerScript from './worker.js?worker'
import MD5WorkerScript from './generateMD5Worker.js?worker'

export default defineComponent({
  props: {
    // 上传前操作
    onBeforeUpload: {
      type: Function,
      default: () => () => {}
    },
    // 上传成功
    onUploadSuccess: {
      type: Function,
      default: () => () => {}
    },
    // 是否上传文件夹
    uploadFolder: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      require: true,
      default: ''
    },
    // 是否支持多传
    multiple: {
      type: Boolean,
      default: false
    },
    // 上传类型
    accept: {},
    // 上传路径
    uploadDir: {
      type: String,
      default: ''
    },
    // 注入缺省参数
    attributes: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props: Readonly<any>, { slots }: SetupContext) {
    // const slots = useSlots()

    const { proxy } = getCurrentInstance()

    const elUploadRef = ref(null)
    const fileList = ref([])

    // const countSuccess = ref(0) // 测试

    const handleUploadFolder = () => {
      // 清空历史选择文件
      elUploadRef.value?.clearFiles?.()
    }

    const _debounce = (cb: Function) => {
      let timer = 0
      return function (...args: any[]) {
        if (elUploadRef.value?.$el?.querySelector('input')) {
          let selectFiles = elUploadRef.value.$el.querySelector('input').files
          timer++
          if (timer === selectFiles.length) {
            timer = 0
            cb && cb(...args, selectFiles)
          }
        } else {
          cb && cb(...args)
        }
      }
    }

    const handleUploadChange = _debounce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (file: UploadFile, files: UploadFiles, newFiles: any) => {
        // console.log(file, files, '========>>>', files.slice(-newFiles.length), '>>>>>>>>', newFiles)

        // files: 包含之前上传的数据，多次上传时，需要注意数据的处理,
        // way1: 可以通过点击按钮上传时，清空之前的上传列表： elUploadRef.value?.clearFiles?.()
        // way2: 也可以上传完后手动截取最后的数据： files.slice(-newFiles.length)
        // 这里采用第一种方式

        if (props.uploadFolder) {
          // 上传文件夹
          // 过滤文件夹和未知文件
        }
        fileList.value = files

        // 数据处理
        const precessedData = await Promise.all(
          files.map(async (file) => {
            // 数据处理，读取文件中 exif 信息
            try {
              const gps = await EXIFR.parse(file.raw, [
                'GPSAltitude',
                'GPSLatitude',
                'GPSLongitude'
              ])
              return Promise.resolve({
                ...file,
                ...gps,
                percentage: 0, // 进度条
                fileSize: (file.size / 1024 / 1024).toFixed(2) + 'M' //文件大小
              })
            } catch (e) {
              // 如果 exif 没有经纬度信息， 走这里，直接返回
              return Promise.resolve({
                ...file,
                percentage: 0, // 进度条
                fileSize: (file.size / 1024 / 1024).toFixed(2) + 'M' //文件大小
              })
            }
          })
        )
        console.log(precessedData)
        if (props.uploadFolder) {
          _checkFolder(precessedData)
        }
      }
    )

    // 校验文件夹
    const _checkFolder = (fileList: UploadFiles) => {
      let directoryPath = fileList.map(
        (item) => `${props.uploadDir ? props.uploadDir + '/' : ''}${item.raw.webkitRelativePath}`
      )
      // appContext.config.globalProperties.$axios({
      //   url: '/mock/allcore/checkFolder',
      //   method: 'get',
      //   params: {
      //     fileFolder: directoryPath //文件夹目录名称
      //   }
      // })
      // checkFolder()
      proxy
        .$axios({
          url: '/mock/allcore/checkFolder',
          method: 'get',
          params: {
            fileFolder: JSON.stringify(directoryPath) //文件夹目录名称
          }
          // headers: {
          //   'Content-Type': 'application/x-www-form-urlencoded'
          // }
        })
        .then((res: AxiosResponse) => {
          const { success, data, msg } = res.data
          console.log(res.data)
          if (success) {
            if (data.successList?.length === 0) {
              // 文件夹中所有图片均已上传过，无需重复上传!
            } else {
              //
              const successFiles = fileList.filter((file) =>
                data.successList.includes(file.raw.webkitRelativePath)
              )
              // 创建分片
              _generateChunk(successFiles, directoryPath)
            }
          } else {
            // TODO:
            console.log(msg)
          }
        })
    }

    const _generateChunk = (fileList: UploadFiles, directoryPath: string[]) => {
      // 创建消息通道
      const channel = new MessageChannel()

      window.$md5Worker.postMessage(null, [channel.port1])

      window.$uploadWorker.onmessage = function ({ data }) {
        console.log('222222', data)
      }
      // @ts-ignore
      window.$uploadWorker.postMessage(
        {
          fileList,
          directoryPath,
          groupSize: 10, // 分组大小
          chunkSize: 1024 * 1024 * 5, // 每个文件超过多少需要分片， 默认 5M
          // request: function () {}, // worker中不能传递 函数
          queryParams: {}
          // onLoadSuccess,
        },
        [channel.port2]
      )
    }

    const handleTestUpload = () => {
      const input: HTMLInputElement = document.querySelector('.selectFile')
      if (input.files) {
        const files: FileList = input.files
        const formData = new FormData()
        Array.from(files).forEach((file) => {
          formData.append('fileName', file.name)
          formData.append('fileSize', String(file.size))
          formData.append('file', file)
        })
        proxy
          .$axios({
            url: '/mock/allcore/testProgress',
            method: 'post',
            data: formData,
            onUploadProgress: function (progressEvent: any) {
              console.log('progressEvent', progressEvent)
            }
          })
          .then((res: AxiosResponse) => {
            console.log(res)
          })
      }
    }

    onBeforeMount(() => {
      // ??? 关闭线程
    })

    onMounted(() => {
      if (props.uploadFolder && elUploadRef.value?.$el) {
        const inputNode = elUploadRef.value?.$el?.querySelector('input')
        inputNode.setAttribute('webkitdirectory', props.uploadFolder)
        inputNode.setAttribute('mozdirectory', props.uploadFolder)
        inputNode.setAttribute('odirectory', props.uploadFolder)
      }

      // 创建 生成md5线程
      window.$md5Worker = new MD5WorkerScript()
      // 创建文件逻辑处理线程
      window.$uploadWorker = new WorkerScript()

      // const timer = setInterval(() => {
      //   countSuccess.value++
      //   if (countSuccess.value > 100) {
      //     countSuccess.value = 0
      //   }
      // }, 100)

      // let notice = ElNotification({
      //   title: '上传进度',
      //   duration: 0,
      //   // message: '看看这个会不会销毁',
      //   message: h(CustomProcess, {
      //     percentage: countSuccess, // 传递给子组件progress的prop
      //     // // 事件要以onXxx的形式书写
      //     onFinish: (status: string) => {
      //       if (status == 'ok') {
      //         clearInterval(timer)
      //         // notice.close() // 关闭ElNotification
      //       }
      //     }
      //   })
      // })
    })

    return () => (
      <div>
        <input type="file" class="selectFile" />
        <el-button onClick={handleTestUpload}>测试上传文件时进度</el-button>

        {/* 计算 分片信息同时 计算生成MD5 */}
        <ElUpload
          multiple
          showFileList={false}
          auto-upload={false}
          file-list={fileList}
          onChange={handleUploadChange}
          {...props.attributes}
          ref={elUploadRef}
          vSlots={{
            file: () => (slots.file ? renderSlot(slots, 'file') : undefined),
            trigger: () =>
              slots.trigger ? (
                cloneVNode(renderSlot(slots, 'trigger'), {
                  onClick: handleUploadFolder
                })
              ) : (
                <el-button type="primary" onClick={handleUploadFolder}>
                  {props.text || '选择上传文件'}
                </el-button>
              ),
            tip: () => (slots.tip ? renderSlot(slots, 'tip') : undefined)
          }}
        >
          {/*  */}
          {slots.default ? renderSlot(slots, 'default') : undefined}
        </ElUpload>


        {/* 测试 不同 域名下 嵌入 iframe cookie获取问题， 只有当 两个域名相同（端口可不同）下才能访问cookie，其他情况都是跨域不能访问的到cookie的 */}
        {/* <iframe src="//localhost:8009/#/page/visualMonitoring/regulatoryOverview/index?key=3307cf2140de4c2bb3130b7e3eafcb31" frameborder="0" width="100%" height="100%" /> */}

      </div>
    )
  }
})
