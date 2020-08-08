import Vue from 'vue'

// 导入弹窗提示
import {Message , Form , FormItem , Input , Button} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.prototype.$message = Message
