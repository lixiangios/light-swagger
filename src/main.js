import { createSSRApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App)
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component)
	}
	app.use(ElementPlus)
	return {
		app,
	};
}
