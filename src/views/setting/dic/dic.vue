<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="330" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="left">
			<el-form-item label="编码" prop="dictType">
				<el-input v-model="form.dictType" clearable placeholder="字典编码"></el-input>
			</el-form-item>
			<el-form-item label="字典名称" prop="dictName">
				<el-input v-model="form.dictName" clearable placeholder="字典显示名称"></el-input>
			</el-form-item>
			<el-form-item label="父路径" prop="parentId">
				<el-cascader v-model="form.parentId" :options="dic" :props="dicProps" :show-all-levels="false" clearable></el-cascader>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增字典',
					edit: '编辑字典'
				},
				visible: false,
				isSaveing: false,
				form: {
					dictId:"",
					dictName: "",
					dictType: "",
					parentId: ""
				},
				rules: {
					dictType: [
						{required: true, message: '请输入编码'}
					],
					dictName: [
						{required: true, message: '请输入字典名称'}
					]
				},
				dic: [],
				dicProps: {
					value: "dictId",
					label: "dictName",
					emitPath: false,
					checkStrictly: true
				}
			}
		},
		mounted() {
			this.getDic()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this;
			},
			//获取字典列表
			async getDic(){
				var res = await this.$API.system.dic.tree.get();
				this.dic = res.data;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						var res = await this.$API.system.dic.addDicType.post(this.form);
						this.isSaveing = false;
						if(res.code == 200){
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			setData(data){
				/*this.form.id = data.id
				this.form.name = data.name
				this.form.code = data.code
				this.form.parentId = data.parentId*/

				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
