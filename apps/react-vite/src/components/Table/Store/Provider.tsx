import { createContext } from 'react'

type TableContextProps = Record<string, any>

export const TableContext = createContext<TableContextProps>({} as TableContextProps);

export const Provider: React.FC<{
  children: React.ReactNode
}> = (props) => {

  return (
    <TableContext.Provider 
      value={{
        
      }}
    >
      {props.children}
    </TableContext.Provider>
  )
}