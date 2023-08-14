import { MyMenuItem } from '@/types/menu'


export const findParentKeyPath = (tree: MyMenuItem[], key: string): string[] => {
  let path: string[] = [];
  function dfs (node: MyMenuItem, currPath: string[]) {
    if (node.key) {
      currPath.push(node.key as string);
      // 如果当前节点的key等于目标key，则保存当前路径
      if (node.key === key) {
        path = [...currPath];
      }
      
      // 递归搜索当前节点的子节点
      if (node?.children) {
        for (let child of node.children) {
          dfs(child, currPath);
        }
      }
      
      // 回溯，将当前节点从路径中移除
      currPath.pop();
    }
  }
  for (const node of tree) {
    dfs(node, path)
  }
  path.pop() // 去掉当前节点
  return path
}