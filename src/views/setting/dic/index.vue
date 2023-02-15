<template>
	<el-container>
		<el-aside width="300px" v-loading="showDicloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="dicFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="dic" class="menu" node-key="dictId" :data="dicList" :props="dicProps" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="dicFilterNode" @node-click="dicClick">
						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">{{ node.label }}</span>
								<span class="code">{{ data.dictType }}</span>
								<span class="do">
									<el-button-group>
										<el-button icon="el-icon-edit" size="small" @click.stop="dicEdit(data)"></el-button>
										<el-button icon="el-icon-delete" size="small" @click.stop="dicDel(node, data)"></el-button>
									</el-button-group>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" style="width: 100%;" @click="addDic">字典分类</el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="addInfo"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="listApi" row-key="dictCode" :params="listApiParams" @selection-change="selectionChange" stripe :paginationLayout="'prev, pager, next'">
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="" width="60">
						<template #default>
							<el-tag class="move" style="cursor: move;"><el-icon-d-caret style="width: 1em; height: 1em;"/></el-tag>
						</template>
					</el-table-column>
					<el-table-column label="名称" prop="dictLabel" width="150"></el-table-column>
					<el-table-column label="键值" prop="dictValue" width="150"></el-table-column>
					<el-table-column label="是否有效" prop="status" width="100">
						<template #default="scope">
							<el-switch v-model="scope.row.status" :active-value="0" :inactive-value="1" disabled></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="right" width="120">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
								<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button text type="primary" size="small">删除</el-button>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>

	<dic-dialog v-if="dialog.dic" ref="dicDialog" @success="handleDicSuccess" @closed="dialog.dic=false"></dic-dialog>

	<list-dialog v-if="dialog.list" ref="listDialog" @success="handleListSuccess" @closed="dialog.list=false"></list-dialog>

</template>

<script>
	import dicDialog from './dic'
	import listDialog from './list'
	import Sortable from 'sortablejs'

	export default {
		name: 'dic',
		components: {
			dicDialog,
			listDialog
		},
		data() {
			return {
				dialog: {
					dic: false,
					info: false
				},
				showDicloading: true,
				dicType:null,
				dicList: [],
				dicFilterText: '',
				dicProps: {
					label: 'dictName'
				},
				listApi: null,
				listApiParams: {},
				selection: []
			}
		},
		watch: {
			dicFilterText(val) {
				this.$refs.dic.filter(val);
			}
		},
		mounted() {
			this.getDic()
			this.rowDrop()
		},
		methods: {
			//加载树数据
			async getDic(){
				var res = await this.$API.system.dic.tree.get();
				this.showDicloading = false;
				this.dicList = res.data;
				//获取第一个节点,设置选中 & 加载明细列表
				const firstNode = this.dicList[0];
				if(firstNode){
					this.dicType = firstNode.dictType;
					this.$nextTick(() => {
						this.$refs.dic.setCurrentKey(firstNode.dictId)
					})
					this.listApiParams = {
						dictType: firstNode.dictType
					}
					this.listApi = this.$API.system.dic.list;
				}
			},
			//树过滤
			dicFilterNode(value, data){
				if (!value) return true;
				var targetText = data.dictName + data.dictType;
				return targetText.indexOf(value) !== -1;
			},
			//树增加
			addDic(){
				this.dialog.dic = true
				this.$nextTick(() => {
					this.$refs.dicDialog.open()
				})
			},
			//编辑树
			dicEdit(data){
				this.dialog.dic = true
				this.$nextTick(() => {
					/*var editNode = this.$refs.dic.getNode(data.dictId);
					var editNodeParentId =  editNode.parentId==0?undefined:editNode.parent.data.parentId
					data.parentId = editNodeParentId*/
					this.$refs.dicDialog.open('edit').setData(data)
				})
			},
			//树点击事件
			dicClick(data){
				this.dicType = data.dictType;
				this.$refs.table.reload({
					dictType: data.dictType
				})
			},
			//删除树
			dicDel(node, data){
				this.$confirm(`确定删除 ${data.dictName} 项吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					this.showDicloading = true;
					//删除节点是否为高亮当前 是的话 设置第一个节点高亮
					const dicCurrentKey = this.$refs.dic.getCurrentKey();
					const reqData = {dictId: data.dictId};
					const res = await this.$API.system.dic.delTypeById.post(reqData);
					if(res.code == 200){
						this.$refs.dic.remove(data.dictId)
						if (dicCurrentKey == data.dictId) {
							var firstNode = this.dicList[0];
							if (firstNode) {
								this.$refs.dic.setCurrentKey(firstNode.dictId);
								this.$refs.table.upData({
									dictType: firstNode.dictType
								})
							} else {
								this.listApi = null;
								this.$refs.table.tableData = []
							}
						}
						this.showDicloading = false;
						this.$message.success("操作成功")
					}else{
						this.$alert(res.message, "提示", {type: 'error'})
					}
				}).catch(() => {

				})
			},
			//行拖拽
			rowDrop(){
				const _this = this
				const tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody')
				Sortable.create(tbody, {
					handle: ".move",
					animation: 300,
					ghostClass: "ghost",
					onEnd({ newIndex, oldIndex }) {
						const tableData = _this.$refs.table.tableData
						const currRow = tableData.splice(oldIndex, 1)[0]
						tableData.splice(newIndex, 0, currRow)
						_this.$message.success("排序成功")
					}
				})
			},
			//添加明细
			addInfo(){
				this.dialog.list = true
				this.$nextTick(() => {
					const data = {
						dictType: this.dicType
					}
					this.$refs.listDialog.open().setData(data)
				})
			},
			//编辑明细
			table_edit(row){
				this.dialog.list = true
				this.$nextTick(() => {
					this.$refs.listDialog.open('edit').setData(row)
				})
			},
			//删除明细
			async table_del(row, index){
				var reqData = {dictCode: row.dictCode}
				var res = await this.$API.system.dic.del.post(reqData);
				if(res.code == 200){
					this.$refs.table.tableData.splice(index, 1);
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					const loading = this.$loading();
					var res = await this.$API.system.dic.batchDel.post(this.selection);
					console.info(res)
					this.$refs.table.refresh()
					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//本地更新数据
			handleDicSuccess(data, mode){
				if(mode=='add'){
					data.id = new Date().getTime()
					if(this.dicList.length > 0){
						this.$refs.table.upData({
							code: data.code
						})
					}else{
						this.listApiParams = {
							code: data.code
						}
						this.listApi = this.$API.dic.info;
					}
					this.$refs.dic.append(data, data.parentId[0])
					this.$refs.dic.setCurrentKey(data.id)
				}else if(mode=='edit'){
					var editNode = this.$refs.dic.getNode(data.dictId);
					//判断是否移动？
					var editNodeParentId =  editNode.parentId==0?undefined:editNode.parentId
					if(editNodeParentId != data.parentId){
						var obj = editNode.data;
						this.$refs.dic.remove(data.dictId)
						this.$refs.dic.append(obj, data.parentId[0])
					}
					Object.assign(editNode.data, data)
				}
			},
			//本地更新数据
			handleListSuccess(data, mode){
				if(mode=='add'){
					this.$refs.table.refresh()
				}else if(mode=='edit'){
					this.$refs.table.refresh()
				}
			}
		}
	}
</script>

<style scoped>
	.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 24px;height:100%;}
	.custom-tree-node .code {font-size: 12px;color: #999;}
	.custom-tree-node .do {display: none;}
	.custom-tree-node:hover .code {display: none;}
	.custom-tree-node:hover .do {display: inline-block;}
</style>
