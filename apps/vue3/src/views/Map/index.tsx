import { defineComponent } from 'vue'

export default defineComponent({
  name: 'mapPage',
  setup (props) {

    console.log(props);

    return () => (
      <div>
        map
      </div>
    )
  }
})