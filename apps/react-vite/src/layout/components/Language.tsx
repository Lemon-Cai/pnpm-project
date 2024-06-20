/*
 * @Author: CP
 * @Date: 2024-06-19 16:00:04
 * @Description: 
 */
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import Icon from '@/components/Icon'
import { useGlobalStore } from '@/store'
import {TOOLBAR_ICON_SIZE} from '@/layout/constants'

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
    <div className='language'>
      <Dropdown
        menu={{ selectable: true, items: languageList, onClick: handleSelectLanguage }}
        placement="bottom"
        arrow={{ pointAtCenter: true }}
      >
        <Icon type="icon-language" style={{ fontSize: `${TOOLBAR_ICON_SIZE}px` }} ></Icon>
      </Dropdown>
    </div>
  )
}

export default Language
