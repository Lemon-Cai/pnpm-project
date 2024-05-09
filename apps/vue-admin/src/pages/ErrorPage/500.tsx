/*
 * @Author: CP
 * @Date: 2024-05-09 13:40:38
 * @Description: 
 */
import { defineComponent } from "vue";
import { useRouter } from 'vue-router'

const InnerError = defineComponent({
  setup () {
    const router = useRouter()
    // 返回上一页
    const handleBack = () => {
      router.go(-1)
    }
    return () => (
      <div class="error_page">
        <div>

        </div>
        <div>
          <h2>404</h2>
          <p>抱歉，您访问的页面不存在~</p>
          
          <a-button onClick={handleBack}>返回上一页</a-button>
        </div>
      </div>
    )
  }
})

export default InnerError