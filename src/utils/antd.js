
/**
* Description: 按需加载Ant-Design-Vue的组件库
* User: YuanFuTong
 */
import Vue from 'vue';
import {
  // General
  Button,
  Icon,
  // layout
  Row,
  Col,
  Layout,
  Space,

  // Navigation
  Breadcrumb,
  Dropdown,
  Pagination,

  // Data Entry
  Checkbox,
  DatePicker,
  Form,
  FormModel,
  Input,
  Radio,
  Select,

  // Data Display
  Empty,
  Table,
  Tooltip,
  Tree,

  // Feedback
  message,
  Modal,
  Progress,
  Spin,

  // Other
  ConfigProvider,
  Divider,
  LocaleProvider,
} from 'ant-design-vue';
Vue.use(Button);
Vue.use(Layout);
Vue.use(Space);
Vue.use(Breadcrumb);
Vue.use(DatePicker);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dropdown);
Vue.use(Pagination);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Empty);
Vue.use(Table);
Vue.use(Tooltip);
Vue.use(message);
Vue.use(Modal);
Vue.use(Progress);
Vue.use(Spin);
Vue.use(Divider);
Vue.use(ConfigProvider); //为组件提供统一的全局化配置。
Vue.use(LocaleProvider);
Vue.prototype.$message = message;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
// Vue.prototype.$destroyAll = Modal.destroyAll;
