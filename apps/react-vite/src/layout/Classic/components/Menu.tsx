import { useMenuStore } from "@/store"
import { MenuItem } from "@/store/types"

/*
 * @Author: CP
 * @Date: 2024-06-20 13:46:47
 * @Description: 
 */
const Menu = () => {

  const topMenuList = useMenuStore(state => state.topMenuList)
  const updateTopMenu = useMenuStore(state => state.updateTopMenu)

  const handleClickMenu = (topMenu: MenuItem) => {
    updateTopMenu(topMenu)
  }
  return (
    <div className='menu_wrapper'>
      <div className='menu'>
        {
          topMenuList.map((menu) => (
            <div key={menu.id} className="menu-item" onClick={() => handleClickMenu(menu)}>{ menu.name }</div>
          ))
        }
        {/* <div>数据管理</div>
        <div>GIS管理</div>
        <div>典型案例</div>
        <div>LowCode平台</div>
        <div>富文本编辑</div>
        <div>系统管理</div> */}
      </div>
    </div>
  )
}

export default Menu