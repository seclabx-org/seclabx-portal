# 第一阶段：构建环境
FROM node18-alpine as builder
WORKDIR app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：生产环境 (Nginx)
FROM nginxalpine
# 复制构建好的文件到 Nginx 目录
COPY --from=builder appdist usrsharenginxhtml
# (可选) 如果有自定义 nginx 配置，取消下面注释
# COPY nginx.conf etcnginxconf.ddefault.conf
EXPOSE 80
CMD [nginx, -g, daemon off;]