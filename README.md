# 项目说明
这是一个模仿ARIS Process Mining（ARIS流程挖掘）的一个前端项目，用于学习其架构思路。数据均通过ARIS线上接口获取。

线上体验地址：http://120.79.199.221:3000/analyses/test

## 技术栈
+ next.js
+ tailwind-css
+ ahooks
+ echarts

## 项目开发
1. [注册ARIS Process Mining](https://shop.ariscloud.com/order/checkout.php?PRODS=30153557&PRICES30153557[EUR]=0&PHASH=b60c2ac7384ca6bf90208fee6f4b516f&CLEAN_CART=ALL&QTY=1&CART=1&CARD=2&SHORT_FORM=1&CLEAN_CART=ALL&COUPON=community&ADDITIONAL_campaignsource=ariscommunity&ADDITIONAL_campaignmedium=free&ADDITIONAL_campaignname=getfullaris)试用帐号
2. `mv .env.example .env`，将租户名（tenantName）、帐号（account）、密码（password）填写到.env中。
3. `pnpm i`安装依赖
4. `pnpm dev`启动开发环境
5. `pnpm start:loginServer`启动模拟登录服务