<template>
  <view class="home lxCenterC p-20px">
    <el-table border v-if="tableData.length" :data="tableData" style="width: 100%;height: 100%;">
      <el-table-column prop="uri" label="uri" />
      <el-table-column prop="summary" label="summary" />
      <el-table-column prop="method" label="method" />
      <el-table-column prop="parameters" label="parameters" />
      <el-table-column prop="model" label="model" />
    </el-table>
    <div v-else class="lxCenterC pb-60px">
      <div class="lxCenterRow mb-10px" style="width: 100%;">
        <span class="mr-1px" style="color: #888888;font-size: 14px;">使用说明</span>
        <el-icon color="#888888">
          <QuestionFilled />
        </el-icon>
      </div>
      <el-input class="w-60vw" :rows="20" v-model="textarea" type="textarea" placeholder="请输入JSON字符串" />
      <el-button class="mt-15px mb-60px" type="primary" @click="onSubmit">确定</el-button>
    </div>
  </view>
</template>

<script>
import { ElMessageBox } from 'element-plus'
export default {
  data() {
    return {
      tableData: [],
      textarea: '',
      apis: null,
    }
  },

  onLoad() {

  },

  methods: {
    onSubmit() {
      try {
        const apis = JSON.parse(this.textarea)
        if (apis && typeof apis === 'object' && Array.isArray(apis) === false) {
          this.apis = apis
          this.handleApis()
        } else {
          ElMessageBox.alert('请查看使用说明', 'JSON格式有误', {
            confirmButtonText: '我知道了'
          })
        }
      } catch (error) {
        ElMessageBox.alert(`JSON格式有误：${error}`, '请查看使用说明', {
          confirmButtonText: '确定'
        })
      }
    },

    handleApis() {
      let arr = []

      for (let key in this.apis) {
        if (this.apis.hasOwnProperty(key)) {
          const value = this.apis[key]
          const keys = Object.keys(value) || []
          const coreKey = keys[0] || ''
          const coreValue = value[coreKey]
          var parameters = coreValue.parameters || []
          parameters.forEach(item => {
            const schema = item.schema || {}
            item.type = schema.type
            item.description = schema.description
            delete item.schema
          })
          value.uri = key
          value.method = coreKey
          value.summary = coreValue.summary
          value.parameters = JSON.stringify(parameters, null, 2)
          const responses = coreValue.responses || {}
          const status200 = responses['200'] || {}
          const content = status200.content || {}
          const applicationJson = content['application/json'] || {}
          const schema = applicationJson.schema || {}
          const modelName = schema['$ref'] || ''
          value.model = modelName
          delete value[coreKey]
          arr.push(value)
        }
      }
      if (arr.length === 0) {
        ElMessageBox.alert('请查看使用说明', 'JSON格式有误', {
          confirmButtonText: '我知道了'
        })
      }
      this.tableData = arr
      console.log('⭕️⭕️', JSON.stringify(arr, null, 2))
    }
  },
}
</script>

<style>
.home {
  background-color: white;
}
</style>
