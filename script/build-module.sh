#! /bin/bash
# 1. 后退到根目录
cd ..
cd ..
current_dir=`pwd`
echo "当前的路径是：$current_dir  命令参数: $1"

# 2. 修改package.json的build:module命令(jq需要安装 brew install jq);
# 2.1 首先要确保有build:module这个指令
# 2.2 将输出重定向到新文件中，防止覆盖原有文件   > tmp.$$.json && mv tmp.$$.json package.json
# 2.3 写法：.[0].scripts.build就可以,但是jq不认识-、：等特殊字符；因此要改成： .[0].scripts["build:module"]
jq -s '.[0].scripts["build:module"] = "rollup -c --environment TARGET:'$1',TYPES:true,LOCALDIR:undefined" | .[0]' ./package.json  > tmp.$$.json && mv tmp.$$.json package.json

# 3. 打包这个模块
yarn build:module

