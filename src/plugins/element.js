import Vue from 'vue'

// 导入弹窗提示
import { Message, Form, FormItem, Input, Button, Header, Container, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb , BreadcrumbItem ,Card , Row ,Col , Table , TableColumn, Switch ,Tooltip ,Pagination ,Dialog , MessageBox ,Tag ,Tree ,Select , Option ,Cascader} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
