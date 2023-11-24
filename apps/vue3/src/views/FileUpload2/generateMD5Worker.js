/*
 * @Author: CP
 * @Date: 2023-11-17 15:01:48
 * @Description: 
 */
// 生产 MD5 worker；
//  和worker 同步，当MD5生成完成，通知 worker，线程之间的通信

import SparkMD5 from 'spark-md5'

let messagePort = null
let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
// let DEFAULT_CHUNK_SIZE = 1024 * 1024 * 1
  onmessage = async function (evt) {
    if (!messagePort) {
      messagePort = evt.ports[0]
      messagePort.onmessage = async ({ data }) => {
        // 接受 worker.js 传递过来的信息
        console.log(`workerA receive data: ${data}`)
        const { file, chunkSize } = data
        const hash = await _generateMD5(file, chunkSize)
        messagePort.postMessage(hash) // 发送数据给worker.js 线程
      }
    }
  }

function _generateMD5  (file, chunkSize) {
  return new Promise (resolve => {
    let chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();
    fileReader.onload = function (e) {
      // console.log('read chunk nr', currentChunk + 1, 'of');

      const chunk = e.target.result;
      spark.append(chunk);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        let fileHash = spark.end();
        console.info('finished computed hash', fileHash);
        // resolve({ fileHash, fileReader, MD5: true })
        resolve(fileHash)
        // return fileHash
        // 此处为重点，计算完成后，仍然通过postMessage通知主线程（这里是 计算线程）
        // if (messagePort) {
        //   messagePort.postMessage({ fileHash, fileReader, MD5: true })
        // } else {
        //   postMessage({ fileHash, fileReader })
        // }
      }
    };

    fileReader.onerror = function () {
      console.warn('oops, something went wrong.');
      resolve()
    };

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
      let chunk = blobSlice.call(file, start, end);
      fileReader.readAsArrayBuffer(chunk);
    }

    loadNext();
  })
}
