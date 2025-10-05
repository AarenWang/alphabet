#!/bin/bash

# Alphabet 项目 Vercel 部署脚本
# 使用方法: ./deploy.sh [环境]
# 环境选项: dev, prod (默认: prod)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 函数：检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message $RED "错误: $1 未安装"
        exit 1
    fi
}

# 函数：检查文件是否存在
check_file() {
    if [ ! -f "$1" ]; then
        print_message $RED "错误: 文件 $1 不存在"
        exit 1
    fi
}

# 函数：检查目录是否存在
check_directory() {
    if [ ! -d "$1" ]; then
        print_message $RED "错误: 目录 $1 不存在"
        exit 1
    fi
}

# 主函数
main() {
    local environment=${1:-prod}
    
    print_message $BLUE "🚀 开始部署 Alphabet 项目到 Vercel"
    print_message $BLUE "环境: $environment"
    echo
    
    # 检查必要的命令
    print_message $YELLOW "📋 检查环境..."
    check_command "node"
    check_command "npm"
    check_command "vercel"
    print_message $GREEN "✅ 环境检查通过"
    echo
    
    # 检查项目文件
    print_message $YELLOW "📁 检查项目文件..."
    check_file "package.json"
    check_file "next.config.js"
    check_directory "public/audio"
    print_message $GREEN "✅ 项目文件检查通过"
    echo
    
    # 检查音频文件
    print_message $YELLOW "🎵 检查音频文件..."
    local audio_count=$(ls public/audio/greek_*.mp3 2>/dev/null | wc -l)
    if [ $audio_count -eq 0 ]; then
        print_message $RED "错误: 未找到希腊字母音频文件"
        exit 1
    fi
    print_message $GREEN "✅ 找到 $audio_count 个音频文件"
    echo
    
    # 安装依赖
    print_message $YELLOW "📦 安装依赖..."
    if [ -f "pnpm-lock.yaml" ]; then
        print_message $BLUE "使用 pnpm 安装依赖..."
        pnpm install
    else
        print_message $BLUE "使用 npm 安装依赖..."
        npm install
    fi
    print_message $GREEN "✅ 依赖安装完成"
    echo
    
    # 构建项目
    print_message $YELLOW "🔨 构建项目..."
    npm run build
    print_message $GREEN "✅ 项目构建完成"
    echo
    
    # 部署到 Vercel
    print_message $YELLOW "🚀 部署到 Vercel..."
    if [ "$environment" = "prod" ]; then
        print_message $BLUE "部署到生产环境..."
        vercel --prod --yes
    else
        print_message $BLUE "部署到预览环境..."
        vercel --yes
    fi
    print_message $GREEN "✅ 部署完成"
    echo
    
    # 显示部署信息
    print_message $GREEN "🎉 部署成功！"
    print_message $BLUE "项目已部署到 Vercel"
    print_message $YELLOW "请访问 Vercel Dashboard 查看部署详情"
    echo
    
    # 显示有用的命令
    print_message $BLUE "📚 有用的命令:"
    echo "  vercel --prod          # 部署到生产环境"
    echo "  vercel                 # 部署到预览环境"
    echo "  vercel logs            # 查看部署日志"
    echo "  vercel domains         # 管理域名"
    echo "  vercel env             # 管理环境变量"
}

# 显示帮助信息
show_help() {
    echo "Alphabet 项目 Vercel 部署脚本"
    echo
    echo "使用方法:"
    echo "  $0 [环境]"
    echo
    echo "环境选项:"
    echo "  dev     部署到预览环境"
    echo "  prod    部署到生产环境 (默认)"
    echo
    echo "示例:"
    echo "  $0        # 部署到生产环境"
    echo "  $0 prod   # 部署到生产环境"
    echo "  $0 dev    # 部署到预览环境"
    echo
    echo "前置要求:"
    echo "  - Node.js 18+"
    echo "  - npm 或 pnpm"
    echo "  - Vercel CLI"
    echo "  - 已登录 Vercel 账户"
}

# 检查参数
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

# 运行主函数
main "$@"
