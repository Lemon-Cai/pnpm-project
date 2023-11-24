/*
 * @Author: CP
 * @Date: 2023-11-16 17:24:37
 * @Description:
 */
// import MD5 from 'spark-md5'
import axios from 'axios'
// import type { AxiosResponse } from 'axios'

/**
 * 分两种方案计算
 * 1、先把所有的md5 hash 计算完成后在进行计算分片，合并数据
 *
 * 2、直接计算分片数据，在计算过程中去生成 md5
 *
 *
 * 两种方案都是在相同数据情况下计算，36个 图片文件 ，文件大小 309M
 * 方案1 消耗时间：log_time: 2776.458984375 ms
 *
 * 方案2 消耗时间： 2.8s
 *
 * 总结两种方案，差别不大哦，唯一区别可能是请求接口时的网络波动差别，但生成MD5的确有点耗时
 *
 * 换成 288个文件，总大小2.41G
 * 方案1 生成MD5消耗时间：  log_time: 27495.437255859375 ms
 *                  log time: 27798.346923828125 ms
 *                  log_time: 21816.94677734375 ms
 *                  log_time: 21473.299072265625 ms
 *  请求接口耗时： start_time: 38506.8779296875 ms
 * 方案2
 */

let finishMergeCount = 0
// let  finishCount=  0
let messagePort = null
// 接受主线程消息
onmessage = function (evt) {
  console.log(evt.data)
  // const { asynchronous } = evt.data
  if (!messagePort) {
    messagePort = evt.ports[0]
    // if (!asynchronous) {
    //   _process(evt)
    //   return
    // }
    if (messagePort) {
      messagePort.onmessage = ({ data }) => {
        // workerB.js 只是把 workerA 改为了 workerB
        // MD5 hash值计算完后在这里处理
        console.log(`workerA receive data: `, data)
        // _process(evt, data)
      }
    }
  }
  _process(evt)
}

// const _getMd5 = (file, chunkSize) => {
//   return new Promise((resolve, reject) => {
//     // 发送数据给计算md5线程
//     messagePort.postMessage({
//       file,
//       chunkSize
//     })
//     messagePort.onmessage = ({ data }) => {
//       // 当前文件创建hash完成
//       resolve(data)
//     }
//     messagePort.onerror = ()=> {
//       // 创建md5失败
//       resolve()
//     }
//   })
// }

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
  console.log('chunks: ', chunks, groupList)
  console.time('start_time')

  axios
    .all(
      groupList.map((item) => {
        return axios('/mock/allcore/upload', {
          method: 'post',
          data: {
            ...queryParams,
            fileDtoList: item
          }
        })
      })
    )
    .then(
      axios.spread((...responses) => {
        console.log(responses)

        responses.forEach((result, index) => {
          const { success, data } = result.data
          if (success) {
            let idx = 0
            const promises = []

            for (const item of data) {
              const { urlDtoList = [] } = item
              // console.log(item);
              promises.push(
                ...urlDtoList.map((item) => {
                  return axios({
                    url: '/mock/allcore/uploadChunk',
                    // url: item.partyUploadUrl,
                    method: 'PUT',
                    data: chunks[index * groupSize + idx][item.partNumber],
                    headers: { 'Content-Type': 'application/octet-stream' },
                    onUploadProgress: (progressEvent) => {
                      console.log('progressEvent', progressEvent);
                    }
                  })
                })
              )
              idx++
            }

            axios.all(promises).then(
              axios.spread(async (...results) => {
                console.log(results);
                // 每组分片处理完后即上传合并, 异步乱序不知道什么时候结束
                _mergeChunk(data, responses.length)
              })
            )
          }
        })
      })
    )
}

const _mergeChunk = async (data, total) => {
  let params = {
    bizType: 4, //主服务桶信息
    uploadFileList: data.map((item) => ({
      fileGuid: item.fileGuid,
      objectName: item.objectName,
      uploadId: item.uploadId
    }))
  }
  axios({
    method: 'post',
    url: '/mock/allcore/mergeChunk',
    data: params
  }).then((response) => {
    console.log(response);
    ++finishMergeCount
     // 这里的打印一直没打印全，没有排查出原因，如果debugger的话，可以打印全
    // console.log('finishMergeCount = ', finishMergeCount)
    if (finishMergeCount === total) {
      // console.timeEnd('start_time')
      finishMergeCount = 0
      postMessage('我完成了') // 通知主线程全部完成
    }
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
