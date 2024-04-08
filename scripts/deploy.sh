#!/bin/bash


# 获取脚本的当前目录
script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# jq 可执行文件的相对路径
jq_path="$script_dir/jq-win64.exe"


# 获取 monorepo 中的项目列表
# projects=$(yarn workspaces --json info | jq -r 'keys_unsorted[]')
# projects=$(npx lerna list --all --json | jq -r '.[]')
projects=$(npx pnpm -r list --json | $jq_path -r '.[]')
# 执行子项目命令
# pnpm -C <workspace-name> <command>
# 获取 子项目 
# pnpm list -r --depth -1

# 选择要打包的项目
echo "请选择要打包的项目:"
select project in $projects; do
  case $project in
    *)
      break;;
  esac
done

# 进入选择的项目目录
cd $project

# # 1. 删除 dist 目录
# rm -rf dist

# # 2. 执行 npm run build
# npm run build

# # 检查打包是否成功
# if [ $? -ne 0 ]; then
#   echo "打包失败"
#   exit 1
# fi

# echo "打包完成"

# # 3. 连接服务器
# echo "请输入服务器账号: "
# read username

# echo "请输入服务器密码: "
# read -s password

# # 4. 备份部署目录
# deployPath="/your/deploy/path"
# backupPath="$deployPath/backup/backup_$(date +'%Y%m%d%H%M%S')"
# cp -r $deployPath $backupPath

# echo "备份完成，备份路径：$backupPath"

# # 5. 删除部署目录下所有文件
# rm -rf $deployPath/*

# echo "删除部署目录下所有文件完成"

# # 6. 上传 dist 文件夹下所有文件到部署目录
# scp -r dist/* $username@your-server-ip:$deployPath/

# echo "文件上传完成"

# echo "任务完成"
