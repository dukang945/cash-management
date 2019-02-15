import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/common/Main'
import Dpjcxx from '@/components/basis/Dpjcxx'
import Pjsz from '@/components/basis/Pjsz'
import Zfsz from '@/components/basis/Zfsz'
import Spxx from '@/components/goods/Spxx'
import Zhgl from '@/components/Jurisdiction/Zhgl'
import Ddgl from '@/components/order/Ddgl'
import Login from '@/components/common/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main,
      name:'首页',
      children:[
        {
        path: '/dpjcxx',
        name: '店铺基础信息',
        component: Dpjcxx
      },
        {
        path: '/pjsz',
        name: '票据设置',
        component: Pjsz
      },
        {
        path: '/zfsz',
        name: '支付设置',
        component: Zfsz
      },
        {
        path: '/spxx',
        name: '商品信息',
        component: Spxx
      },
        {
        path: '/zhgl',
        name: '账户管理',
        component: Zhgl
      },
        {
        path: '/ddgl',
        name: '订单管理',
        component: Ddgl
      },
    ]
    },
    {
      path: '/login',
      component: Login,
      name:'登录',
    }
  ]
})
