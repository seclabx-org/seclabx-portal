# 第一阶段：构建环境
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./

# （可选）加速 npm
# RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY . .
RUN chmod +x node_modules/.bin/*
RUN npm run build


# 第二阶段：生产环境 (Nginx)
FROM nginx:alpine

# 复制构建产物到 Nginx 静态目录
COPY --from=builder /app/dist /usr/share/nginx/html

#（可选）自定义 nginx 配置
# COPY nginx.conf /etc/nginx/conf.d/seclabx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
