import Vue from 'vue'
import SvgIcon from '@/components/svgIcon/SvgIcon.view'// svg组件
 
// register globally
Vue.component('svg-icon', SvgIcon)
 
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)