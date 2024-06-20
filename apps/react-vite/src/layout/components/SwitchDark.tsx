import { useGlobalStore } from "@/store"
import { Switch } from "antd"

const SwitchDark = () => {
  const isDark = useGlobalStore(state => state.isDark)
  const updateState = useGlobalStore(state => state.updateState)

  const handleChange = (checked: boolean) => {
    updateState({ isDark: checked })
  }

  return (
    <Switch 
      className="dark"
      defaultChecked={isDark}
      checkedChildren={<>🌞</>}
      unCheckedChildren={<>🌜</>}
      onChange={handleChange}
    />
  )
}

export default SwitchDark