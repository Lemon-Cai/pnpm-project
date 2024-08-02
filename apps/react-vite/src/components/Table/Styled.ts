import styled from 'styled-components'

import type { StyledTableProps } from './types'

export const StyledTableContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

export const StyledTable = styled.div<StyledTableProps>`
  height: 100%;

  .table-content {
    height: 100%;

    .table-loading,.ant-spin-container {
      height: 100%;
      /* .ant-spin-container {
        height: ${(props) => (!!props.$pagination ? 'calc(100% - 64px)' : '100%')};
        height: 100%;
      } */
    }
    .ant-table {
      /* height: 100%; */
      height: ${(props) => (!!props.$pagination ? 'calc(100% - 64px)' : '100%')};

      &:not(.ant-table-empty) {
        .ant-table-container {
          height: ${(props) => (props.$hasFooter ? 'calc(100% - 60px)' : '100%')};
          display: flex;
          flex-direction: column;
          .ant-table-body {
            flex: 1;
          }
        }
      }
      &.ant-table-empty {
        height: 100%;
        .ant-table-container, .ant-table-content, table {
          height: 100%;
        }
      }
    }
  }
`

export const StyledTh = styled.span`

`