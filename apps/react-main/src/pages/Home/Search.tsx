/*
 * @Author: CP
 * @Date: 2023-12-14 15:12:58
 * @Description:
 */
import { FC, FormEvent /* useEffect, useState */ } from 'react'
import styled from 'styled-components'
import { SearchOutlined } from '@ant-design/icons'

export type FormChangeArg = string | undefined | null

export type SearchProps = {
  value?: string | undefined
  onChange?: (arg: FormChangeArg) => void
}

const SearchBox = styled.div`
  padding: 6px 12px;
  border-radius: 40px;
  background: #ededed;

  &:hover {
    input[type='text'] {
      width: 200px;
      padding: 0 6px;
    }
  }

  form {
    display: flex;
    align-items: center;
    input {
      outline: none;
      border: none;
      background: transparent;
      color: #000;
      transition: 0.4s;
      width: 0;
      height: 22px;
      line-height: 22px;
    }
    button {
      outline: none;
      border: none;
    }
  }
`

const Search: FC<SearchProps> = ({ value, onChange }) => {
  // useEffect(() => {
  //   setSearchValue(value || '')
  // }, [value])

  // const [searchValue, setSearchValue] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // console.log('e:', e)

    let formData = new FormData(e.currentTarget)
    let value = formData.get('searchValue')

    // setSearchValue(value as string)
    onChange?.(value as FormChangeArg)
  }

  // const handleInputChange = () => {}

  return (
    <SearchBox className="search_box">
      <form action="" onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="searchValue"
          // value={searchValue}
          // onChange={handleInputChange}
          placeholder="搜索"
        />
        <button type="submit">
          <SearchOutlined />
        </button>
      </form>
    </SearchBox>
  )
}

export default Search
