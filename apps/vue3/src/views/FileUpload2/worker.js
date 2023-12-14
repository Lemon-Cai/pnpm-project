/*
 * @Author: CP
 * @Date: 2023-11-16 17:24:37
 * @Description: 
 */
// import MD5 from 'spark-md5'
import axios from 'axios'
// import { ElNotification } from 'element-plus'
// import { computed, createVNode, h, ref } from 'vue'
// import CustomProcess from './Progress.vue'

// const count = ref(0)
// const computeValue = computed(() => {
//   return count
// })

// const notice = () => {
//   let timer = setInterval(() => {
//     count.value++
//     // computeValue.value
//   }, 1000)


//   ElNotification({
//     title: '上传进度',
//     duration: 0,
//     message: count.value
//     // message: h(CustomProcess, {
//     //   percentage: count, // 传递给子组件progress的prop
//     //   // // 事件要以onXxx的形式书写
//     //   onFinish: (status) => {
//     //     if (status == 'ok') {
//     //       clearInterval(timer)
//     //       // window.notice?.close?.() // 关闭ElNotification
//     //     }
//     //   }
//     // })
//   })
// }

let messagePort = null
// 接受主线程消息
onmessage = function (evt) {
  console.log(evt.data)
  if (!messagePort) {
    console.time('log_time')
    messagePort = evt.ports[0]
    _process(evt)
    // if (messagePort) {
    //   messagePort.onmessage = ({ data }) => {
    //     // workerB.js 只是把 workerA 改为了 workerB
    //     // MD5 hash值计算完后在这里处理
    //     // console.log(`workerA receive data: `, data)
    //     _process(evt, data)
    //   }
    // }
  }

  // notice()
}

// eslint-disable-next-line
const _getMd5 = (file, chunkSize) => {
  return new Promise((resolve) => {
    // 发送数据给计算md5线程
    messagePort.postMessage({
      file,
      chunkSize
    })
    messagePort.onmessage = ({ data }) => {
      // 当前文件创建hash完成
      resolve(data)
    }
    messagePort.onerror = ()=> {
      // 创建md5失败
      resolve()
    }
  })
}

const _process = async (evt, fileMD5) => {
  const { fileList = [], directoryPath, chunkSize, groupSize, queryParams } = evt.data
  const groupCount = Math.ceil(fileList.length / groupSize) // 分几组上传

  const groupList = [] // 分组信息
  const chunks = [] // 切片信息 二维数组
  for (let i = 0; i < groupCount; i++) {
    let chunk = fileList.slice(i * groupSize, (i + 1) * groupSize) // 
    const params = []
    for (let index = 0; index < chunk.length; index++) {
      const file = chunk[index]
      const count = Math.ceil(file.size / chunkSize) // 超过预设大小进行分片
      chunks.push(_createFileChunk(file.raw, chunkSize, count))
      let md5 = fileMD5?.[index]?.hash
      // if (!md5) {
      //   md5 = await _getMd5(file.raw, chunkSize)
      // }
      params.push({
        chunks: count, // 这里告诉后台，会有几个分片信息
        // elevation: file.elevation,
        fileName: file.name,
        fileNum: i * groupSize + index,
        fileOriginalName: directoryPath[i * groupSize + index], // 此处workOrderNum有值代表巡检数据提交，那么文件原始名需要拼接 workOrderNum
        fileSize: file.size,
        isShortcut: '1',
        md5: md5,
        width: file.width,
        height: file.height,
        latitude: file.latitude || '',
        longitude: file.longitude || ''
      })
    }
    groupList.push(params)
  }
  console.timeEnd('log_time')
  console.log('chunks: ', chunks, groupList);
  axios.all(groupList.map(item => {
    return axios('/mock/allcore/upload', {
      method: 'post',
      data: {
        ...queryParams,
        fileDtoList: item
      }
    })
  })).then(axios.spread((...responses) => {
    console.log(responses);
    responses.forEach((result, index) => {
      const { success, data } = result.data
      if (success) {
        const promises = []
        let idx = 0
        for (const item of data) {
          const { urlDtoList = [] } = item
          console.log(item);
          promises.push(...urlDtoList.map(item => {
            const form = new FormData()
            form.append('chunk', chunks[index*groupSize + idx][item.partNumber])
            return axios({
              url: '/mock/allcore/uploadChunk',
              // url: item.partyUploadUrl,
              method: 'POST',
              data: form,
              // headers: { 'Content-Type': 'application/octet-stream' },
              onUploadProgress: (progressEvent) => {
                console.log('progressEvent', progressEvent);
              }
            })
          }))
          idx++
        }
        axios.all(promises).then(axios.spread((...results) => {
          console.log(results);
          _mergeChunk(data, responses.length)
        }))
      }
    })
  }))
}

const _mergeChunk = () => {
  axios({
    method: 'post',
    url: '/mock/allcore/mergeChunk',
  }).then((response) => {
    console.log(response);
  })
}

// 对文件进行切片
// function _createFileChunk(file, size) {
//   var fileChunkList = []
//   var cur = 0,
//     i = 0
//   while (cur < file.size) {
//     fileChunkList.push({
//       file: file.slice(cur, cur + size),
//       idx: i
//     })
//     cur += size
//     i++
//   }
//   return fileChunkList
// }


// 对文件进行切片
const _createFileChunk = (file, chunkSize, chunkCount) => {
  const chunks = []
  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize
    const end = Math.min(file.size, start + chunkSize)
    let blob = file.slice(start, end) // 切割文件
    chunks.push(blob)
  }
  return chunks
}
