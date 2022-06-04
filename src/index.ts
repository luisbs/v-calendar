import { App } from 'vue';
import setup from './utils/setup';
import { setVueInstance } from './utils/config/index';
import { Defaults } from './utils/defaults';
import './styles/main.css';

import { Calendar, DatePicker, Popover, PopoverRow } from './components/index';
const components = { Calendar, DatePicker, Popover, PopoverRow };

const install = (app: App, defaults: Defaults = {}) => {
  setVueInstance(app);
  app.use(setup, defaults);
  const prefix = app.config.globalProperties.$VCalendar.componentPrefix;
  for (const componentKey in components) {
    const component = (components as any)[componentKey];
    app.component(`${prefix}${component.name}`, component);
  }
};

export default { install };
export * from './components';
export { setup as SetupCalendar };
export { default as Screens } from './utils/screens';
