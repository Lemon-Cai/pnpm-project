import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import Icon from '@/components/Icon'
import { useGlobalStore } from '@/store'

const languageList: MenuProps['items'] = [
  { label: '简体中文', key: 'zh' },
  { label: 'English', key: 'en' }
]

const Language = () => {
  // const language = useGlobalStore((state) => state.language)
  const updateState = useGlobalStore((state) => state.updateState)

  const handleSelectLanguage: MenuProps['onClick'] = ({ key }) => {
    updateState({
      language: key
    })
  }

  return (
    <Dropdown
      menu={{ selectable: true, items: languageList, onClick: handleSelectLanguage }}
      placement="bottomLeft"
      arrow={{ pointAtCenter: true }}
    >
      <Icon type="language" size={24}></Icon>
    </Dropdown>
  )
}

export default Language
