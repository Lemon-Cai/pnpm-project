/*
 * @Author: CP
 * @Date: 2024-06-20 10:06:47
 * @Description: 
 */

interface ListImpl {
  data: any[]
}

const List: React.FC<ListImpl> = ({ data = [] }) => {
  return data.map(item => (
    <div key={item?.key}>{item.title}</div>
  ))
}

export default List