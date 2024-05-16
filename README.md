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

****
### 分支操作

**1、更新分支，删除无用分支**
```shell 
  git fetch -p # -p 是 --prune 的缩写
  git fetch -p origin
  git remote prune origin
```

**2、查看并创建分支**
```shell
  # 更新分支信息, 删除无用的分支
  git fetch -p

  # 查看分支信息
  git branch  #显示本地分支
  git branch -r #显示远程所有分支

  # 创建分支并切换到该分支
  git checkout -b branchName # 本地创建分支
  git checkout -B branchName # -B 是强制创建分支
  # 推送到远程
  git push --set-upstream origin branchName
```

**3、删除分支**
```shell
# 切换到要删除的分支
git checkout <deleteBranch> # 可省略
# 删除远程分支
git push <remote> --delete <branch>
# eg: git push origin --delete dev

# 切换到其他分支
git checkout <otherBranch> # 可省略

# 本地分支也删除
git branch -d <deleteBranch>    # 删除分支，分支上有未提交更改是不能删除的
git branch -D <deleteBranch>    # 强行删除分支，尽管这个分支上有未提交的更改

# 同步
git fetch -p

```
**4、恢复被删除的分支**
```shell
git log --branches="被删除的分支名"     # 找到被删分支最新的commit版本号
git branch 分支名 版本号(前七位即可)    # 恢复被删分支
```

**5、分支重命名**
```shell
git branch -m 老分支名 新分支名     # 分支重命名
```

**6、合并分支**

```shell
# 比如： 把 branchName1 合并到当前分支
git merge branchName1
```
**参数说明：**

| 参数          | 描述 |
| -----------   | ----------- |
| -ff           | 快速合并，默认参数 |
| -ff-only      | 只有快速合并的情况才合并 |
| --no-ff       | 不使用快速合并 |
| -n 分支名      | 合并分支，不会在合并后显示合并前后的不同状态 |
| -stat 分支名   | 合并分支，合并结束后显示合并前后的不同状态 |
| -e 分支名      | 合并分支，合并前调用编辑器，可自行编写commit |

也可用下面的命令
```shell
git push origin <otherBranch>
# eg: 当前所在分支dev， 你想把另一个分支 dt 的代码合并到 当前分支
# git push origin dt
```


### 撤销相关操作

**1、撤销本地（工作区）（未 add ）**
```shell
  git checkout <filename>   # 撤销指定文件的变动
  git checkout .            # 撤销所有
```
checkout 只撤销已有(tracked)文件，新增文件（untracked）不会撤销
- **清除工作区新增（untracked）文件**
```shell
  git clean -df
```

**2、撤销暂存区修改 （已 add， 但未 commit 的部分）**

把添加（add）到暂存区的更改，恢复到工作区
```shell
git reset  #撤销暂存区全部文件
git reset  filename #指定文件
```

**3、查看本地仓库修改(已经commit，未push)**
```shell
git log 本地branch ^仓库 远程分支   #可以查看本地有远程没有的提交。
git log 远程分子 ^本地branch   #可以查看远程有，本地没有的提交。
git log master ^origin master #demo
```

**4、撤销本地仓库修改(已经commit,未push)**

仅仅是撤回commit操作，您写的代码仍然保留。

HEAD^的意思是上一个版本，也可以写成HEAD~1

如果你进行了2次commit，想都撤回，可以使用HEAD~2

```shell
  git reset --soft HEAD^
```
**参数说明：**
- --mixed
  - 不删除工作空间改动代码，撤销commit，并且撤销git add . 操作
- --soft
  - 不删除工作空间改动代码，撤销commit，不撤销git add . 操作
- --hard
  - 删除工作空间改动代码，撤销commit，撤销git add .操作


**5、远程仓库版本回退（已经push到远程仓库）**

本地版本回退到指定的id
```shell
git reset --hard 4e0c318  #4e0c318 是提交的Id,git log/git reflog 等 可以查看
```
强制提交到远程仓库
```shell
git push -f
```

**6、撤销某次提交**

会增加一次修改记录会增加一次修改记录
```shell
git revert HEAD             # 撤销最近的一个提交
git revert 提交的Hash值     # 撤销某次commit
```

**7、只修改 commit 注释**
```shell
git commit --amend
```
此时会进入默认vim编辑器，修改注释完毕后保存就好了。