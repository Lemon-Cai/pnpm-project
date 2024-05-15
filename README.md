```shell
  echo "# pnpm-project" >> README.md
  git init
  git add README.md
  git commit -m "first commit"
  git branch -M master
  git remote add origin https://github.com/Lemon-Cai/pnpm-project.git
  git push -u origin master
```

```shell
  # 
  pnpm config list -g
  # user-agent=pnpm/8.10.5 npm/? node/v16.20.2 win32 x64
  # 修改 node 的版本
  pnpm config set user-agent "your-user-agent Node.js/$(node -v)"

```

```shell
  # 安装 msw， 
  pnpm i msw -w
  # 在子项目目录下执行
  npx msw init ./public
```


### 创建分支
```shell
  # 更新分支信息, 删除无用的分支
  git fetch -p

  # 
  git checkout -b branch
  # 
  git push --set-upstream origin branch
```


### 删除分支
```shell
# 切换到要删除的分支
git checkout <deleteBranch>
# 删除远程分支
git push <remote> --delete <branch>
# eg: git push origin --delete dev

# 切换到其他分支
git checkout <otherBranch>

# 本地分支也删除
git branch -d <deleteBranch>

# 同步
git fetch -p

```