/*
 * @Author: CP
 * @Date: 2023-12-08 15:50:12
 * @Description: 
 */
import { defineComponent, ref } from 'vue'
import { ElDialog, ElProgress } from 'element-plus'

interface FileImpl {
  name: string
  sizes: number
  percentage: number
}

export default defineComponent({
  props: {
    countSuccess: {
      type: Number,
      default: 0
    },
    fileList: {
      type: Array<FileImpl>,
      default: (): FileImpl[] => []
    }
  },
  setup(props) {
    const dialogVisible = ref(false)

    const handleClose = () => {}

    return () => (
      <ElDialog
        modelValue={dialogVisible.value}
        title="文件上传进度"
        width="50%"
        closeOnClickModal={false}
        closeOnPressEscape={false}
        beforeClose={handleClose}
      >
        <div class="img-list">
          <div class="img-list-title">
            <div class="img-list-title-div img-list-title-div1">序号</div>
            <div class="img-list-title-div img-list-title-div2">文件名</div>
            <div class="img-list-title-div img-list-title-div3">大小</div>
            <div class="img-list-title-div img-list-title-div4">进度</div>
            {/* <div class="img-list-title-div img-list-title-div5">操作</div>  */}
          </div>
          {props.fileList.map((item, index) => (
            <div class="img-list-item" key={index}>
              <div class="img-list-item-div img-list-item-div1">{index + 1}</div>
              <div class="img-list-item-div img-list-item-div2">{item.name}</div>
              <div class="img-list-item-div img-list-item-div3">{item.sizes}</div>
              <div class="img-list-item-div img-list-item-div4">
                <ElProgress percentage={item.percentage} />
              </div>
              {/* <div class="img-list-item-div img-list-item-div5">
              <el-button @click="delImg(item)" class="btn_del" type="danger" size="mini">删除</el-button>
            </div> */}
            </div>
          ))}
        </div>
        <div class="num">
          照片已上传: {props.countSuccess} / { props.fileList.length } (张)
        </div>
      </ElDialog>
    )
  }
})
