import {createApp} from 'vue'
import {createPinia} from 'pinia'
import router from './router/index.js'
import './utils/slogans.js'
import './style/index.less'
import App from './App.vue'
import {
    Button,
    Form,
    Input,
    InputNumber,
    Menu,
    Card,
    Breadcrumb,
    ConfigProvider,
    Modal,
    Table,
    Pagination,
    Tag,
    Upload,
    Select,
    DatePicker,
    Tabs,
    Row,
    Col,
    Space
} from 'ant-design-vue'

const app = createApp(App)
const pinia = createPinia()

app.config.productionTip = false
app.use(router)
app.use(pinia)
app.use(Button)
    .use(Form)
    .use(Input)
    .use(InputNumber)
    .use(Menu)
    .use(Card)
    .use(Breadcrumb)
    .use(ConfigProvider)
    .use(Modal)
    .use(Table)
    .use(Pagination)
    .use(Tag)
    .use(Upload)
    .use(Select)
    .use(DatePicker)
    .use(Tabs)
    .use(Row)
    .use(Col)
    .use(Space)
app.mount('#app')