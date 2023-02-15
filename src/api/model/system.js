import config from "@/config"
import http from "@/utils/request"

export default {
	menu: {
		myMenus: {
			url: `${config.API_URL}/system/menu/my/1.6.1`,
			name: "获取我的菜单",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/menu/list`,
			name: "获取菜单",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	dic: {
		tree: {
			url: `${config.API_URL_2}/system/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL_2}/system/dic/data/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		addDicType: {
			url: `${config.API_URL_2}/system/dic/addDicType`,
			name: "新增字典类型",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delTypeById: {
			url: `${config.API_URL_2}/system/dic/delTypeById`,
			name: "删除字典类型",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		add:{
			url: `${config.API_URL_2}/system/dic/data/add`,
			name: "新增字典数据",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		del:{
			url: `${config.API_URL_2}/system/dic/data/deleteById`,
			name: "新增字典数据",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		batchDel:{
			url: `${config.API_URL_2}/system/dic/data/batchDel`,
			name: "新增字典数据",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL_2}/system/role/list`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL_2}/system/role/save`,
			name: "获取角色列表",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		del: {
			url: `${config.API_URL_2}/system/role/deleteById`,
			name: "单个删除",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		batchDel:{
			url: `${config.API_URL_2}/system/role/batchDel`,
			name: "批量删除",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	dept: {
		list: {
			url: `${config.API_URL_2}/system/dept/list`,
			name: "获取部门列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		save: {
			url: `${config.API_URL_2}/system/dept/add`,
			name: "新增部门列表",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		del: {
			url: `${config.API_URL_2}/system/dept/deleteById`,
			name: "删除",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		batchDel: {
			url: `${config.API_URL_2}/system/dept/batchDel`,
			name: "删除",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		edit: {
			url: `${config.API_URL_2}/system/dept/edit`,
			name: "新增部门列表",
			post: async function(params){
				return await http.post(this.url, params);
			}
		}
	},
	user: {
		list: {
			url: `${config.API_URL}/system/user/list`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	app: {
		list: {
			url: `${config.API_URL}/system/app/list`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	log: {
		list: {
			url: `${config.API_URL}/system/log/list`,
			name: "日志列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
