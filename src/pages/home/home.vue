<template>
  <view class="home lxCenterC p-20px">
    <div style="width: 100%;display: flex;flex-direction: row-reverse;">
      <el-icon size="24" style="cursor: pointer;margin-right: 10px;" @click="goGithub()">
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em" data-v-6c8d2bba="">
          <path fill="currentColor"
            d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z">
          </path>
        </svg>
      </el-icon>
    </div>
    <el-dialog title="使用说明" v-model="showDoc" width="1010px">
      <image src="/static/eg.jpg" style="width: 990px;height: 616px;" />
    </el-dialog>
    <el-dialog :title="currentModelTitle" v-model="dialogTableVisible" width="80%">
      <!-- 当前模型 -->
      <modelTable :modelArr="currentModelArr" />
    </el-dialog>
    <!-- 模型列表 -->
    <modelTable v-if="modelArr.length > 0 && tableData.length === 0" :modelArr="modelArr" />
    <!-- 接口列表 -->
    <el-table border v-if="tableData.length" :data="tableData">
      <el-table-column prop="uri" label="uri">
        <template #default="scope">
          <div class="lxCenterRow">
            <el-tag v-if="scope.row.method === 'get'" class="mr-3px">GET</el-tag>
            <el-tag v-else-if="scope.row.method === 'post'" class="mr-3px" type="success">POST</el-tag>
            <el-tag v-else class="mr-3px" type="warning">{{ scope.row.method }}</el-tag>
            <text selectable>{{ scope.row.uri }}</text>
            <el-icon class="ml-6px" style="cursor: pointer;" @click="copy(scope.row.uri)">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="summary">
        <template #default="scope">
          <div class="lxCenterRow">
            <text selectable>{{ scope.row.summary }}</text>
            <el-icon class="ml-6px" style="cursor: pointer;" @click="copy(scope.row.summary)">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="parameters" label="parameters">
        <template #default="scope">
          <div v-if="scope.row.requestModel" class="lxCenterC">
            <text selectable class="likeBtn" @click="tapModel(scope.row.requestModel)">{{ scope.row.requestModel }}</text>
          </div>
          <div v-else-if="scope.row.parameters.length" class="lxCenterColumn">
            <div v-for="(item, index) in scope.row.parameters" :key="index" class="lxCenterRow mb-4px">
              <text class="mr-3px" v-if="item.required" style="color: red;">*</text>
              <el-tag class="mr-3px">{{ item.type }}</el-tag>
              <text class="mr-3px" style="flex-shrink: 0;" selectable>{{ item.name }} // {{ item.description }}</text>
            </div>
          </div>
          <div v-else class="lxCenterC">-</div>
        </template>
      </el-table-column>
      <el-table-column label="response">
        <template #default="scope">
          <text selectable class="likeBtn" @click="tapModel(scope.row.model)">{{ scope.row.model }}</text>
        </template>
      </el-table-column>
    </el-table>
    <!-- 首页搜索框 -->
    <div v-if="modelArr.length === 0 && tableData.length === 0" class="lxCenterC pb-60px h-70vh">
      <image src="/static/logo.png" style="width: 120px;height: 51px;border-radius: 5px;margin-bottom: 10px;" />
      <div style="width: 100%;">
        <div class="lxCenterRow mb-10px w-90px" style="cursor: pointer;" @click="onTap">
          <span class="mr-1px" style="color: #888888;font-size: 14px;">使用说明</span>
          <el-icon color="#888888">
            <QuestionFilled />
          </el-icon>
        </div>
      </div>
      <el-autocomplete class="w-45vw" clearable size="large" v-model="url" :fetch-suggestions="querySearch"
        :placeholder="plh" @select="handleSelect">
        <template #default="{ item }">
          <span>{{ item }}</span>
        </template>
      </el-autocomplete>
      <div class="mt-15px mb-60px lxCenterRow">
        <el-button :text="true" :bg="true" size="large" @click="apiList">接口列表</el-button>
        <el-button style="margin-left: 20px;" :text="true" :bg="true" size="large" @click="modelList">模型列表</el-button>
      </div>
    </div>
  </view>
</template>

<script>
import { ElMessageBox, ElMessage } from 'element-plus'
import modelTable from './modelTable.vue'
export default {
  components: {
    modelTable
  },
  data() {
    return {
      showDoc: false,
      dialogTableVisible: false,
      tableData: [],
      modelArr: [],
      currentModelTitle: '当前模型',
      currentModelArr: [],
      url: '',
      plh: '请输入swagger文档中获取api的接口地址 eg: http://swagger.com/api.json',
      apis: null,
      urls: [],
    }
  },

  onLoad() {
    if (getApp().globalData.urls.length) {
      this.urls = getApp().globalData.urls
    } else {
      this.urls = uni.getStorageSync('urls') || []
    }
  },

  methods: {
    clearData() {
      var urls = uni.getStorageSync('urls') || []
      if (urls.indexOf(this.url) === -1) {
        urls.unshift(this.url)
      }
      if (urls.length > 10) {
        urls = urls.slice(0, 10)
      }
      uni.setStorageSync('urls', urls)
      this.tableData = []
      this.modelArr = []
      uni.showLoading()
    },

    hideLoading() {
      setTimeout(() => {
        uni.hideLoading()
      }, 100);
    },

    handleErr(err) {
      this.hideLoading()
      if (err.errMsg === 'request:fail') {
        this.alert()
      }
      // console.log('❌', JSON.stringify(err, null, 2))
    },

    modelList() {
      if (this.url.indexOf('http') != 0) {
        ElMessage.error('请输入正确的接口地址')
        return
      }
      this.clearData()
      uni.request({
        url: this.url,
        success: res => {
          this.hideLoading()
          const data = res.data || {}
          const components = data.components || {}
          const schemas = components.schemas
          const definitions = data.definitions
          this.handleModelData(schemas || definitions || components)
        },
        fail: err => {
          this.handleErr(err)
        }
      })
    },

    apiList() {
      if (this.url.indexOf('http') != 0) {
        ElMessage.error('请输入正确的接口地址')
        return
      }
      this.clearData()
      uni.request({
        url: this.url,
        success: res => {
          this.hideLoading()
          const data = res.data || {}
          const components = data.components || {}
          const schemas = components.schemas
          const definitions = data.definitions
          this.handleModelData(schemas || definitions || components)
          this.handleData(data.paths)
        },
        fail: err => {
          this.handleErr(err)
        }
      })
    },

    handleSelect(item) {
      this.url = item
    },

    querySearch(queryString, cb) {
      var results = queryString ? this.urls.filter(this.createFilter(queryString)) : this.urls
      // console.log('⭕️', JSON.stringify(results, null, 2))
      cb(results)
    },

    createFilter(queryString) {
      return function (url) {
        return (
          url.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    alert() {
      ElMessageBox.confirm('请检查接口地址是否正确，如果是跨域问题，可以安装Chrome插件【Moesif Origin & CORS Changer】解决', '接口请求失败', {
        confirmButtonText: '去安装',
        cancelButtonText: '取消',
      }).then(() => {
        window.open('https://chromewebstore.google.com/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc', '_blank')
      }).catch(() => {
        // console.log('取消')
      })
    },

    copy(text) {
      navigator.clipboard.writeText(text).then(function () {
        ElMessage({ message: '复制成功', type: 'success' })
      }).catch(function (error) {
        ElMessage({ message: `复制失败:${error}`, type: 'error' })
      })
    },

    handleModelData(components) {
      let arr = []
      for (let key in components) {
        if (components.hasOwnProperty(key)) {
          const value = components[key]
          var propertyArr = []
          const properties = value.properties || []
          for (let smallKey in properties) {
            const smallValue = properties[smallKey]
            const property = {
              name: smallKey,
              type: smallValue.type || '未知类型',
              description: smallValue.description || '未知描述'
            }
            propertyArr.push(property)
          }
          delete value.properties
          value.propertyArr = propertyArr
          value.swiftModel = this.getSwiftModel(value)
          arr.push(value)
          //console.log('value :', '⭕️', JSON.stringify(value, null, 2))
        }
      }
      this.modelArr = arr
    },

    handleData(paths) {
      // console.log('⭕️  paths:', paths)
      try {
        this.handlePaths(paths)
      } catch (error) {
        ElMessageBox.alert(`JSON格式有误：${error}`, '请查看使用说明', {
          confirmButtonText: '确定'
        })
      }
    },

    handlePaths(paths) {
      let arr = []

      for (let key in paths) {
        if (paths.hasOwnProperty(key)) {
          const value = paths[key]
          const keys = Object.keys(value) || []
          const coreKey = keys[0] || ''
          const coreValue = value[coreKey]
          const requestBody = coreValue.requestBody || {}
          const requestBodyContent = requestBody.content || {}
          const requestJson = requestBodyContent['application/json'] || {}
          const requestSchema = requestJson.schema || {}
          const requestRef = requestSchema['$ref'] || ''
          if (requestRef.indexOf('/')) {
            value.requestModel = requestRef.substring(requestRef.lastIndexOf('/') + 1)
          } else {
            value.requestModel = requestRef
          }
          var parameters = coreValue.parameters || []
          parameters.forEach(item => {
            const schema = item.schema || {}
            item.type = schema.type || '未知类型'
            item.description = schema.description || '未知描述'
            // delete item.schema
            if (item.schema) {
              const bodyRef = item.schema['$ref'] || ''
              if (bodyRef.length > 0) {
                if (bodyRef.indexOf('/')) {
                  value.requestModel = bodyRef.substring(bodyRef.lastIndexOf('/') + 1)
                } else {
                  value.requestModel = bodyRef
                }
              }
            }
          })
          value.uri = key
          value.method = coreKey
          value.summary = coreValue.summary
          value.parameters = parameters
          const responses = coreValue.responses || {}
          const status200 = responses['200'] || {}
          const content = status200.content || {}
          const applicationJson = content['application/json'] || {}
          const schema = applicationJson.schema || status200.schema || {}
          const pathModel = schema['$ref'] || ''
          if (pathModel.indexOf('/')) {
            value.model = pathModel.substring(pathModel.lastIndexOf('/') + 1)
          } else {
            value.model = pathModel
          }
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
      // console.log('⭕️⭕️', JSON.stringify(arr, null, 2))
    },

    getSwiftModel(model) {
      var result = ''
      model.propertyArr.forEach(item => {
        const typeStr = item.type
        const key = item.name
        if (typeStr == "number") {
          if (item % 1 === 0) {
            let onePiece = `/// ${item.description}\nvar ${key}: Int = 0`;
            result = result + onePiece + "\n";
          } else {
            let onePiece = `/// ${item.description}\nvar ${key}: Double = 0`;
            result = result + onePiece + "\n";
          }
        } else if (typeStr == "string") {
          let onePiece = `/// ${item.description}\nvar ${key}: String = ''`;
          result = result + onePiece + "\n";
        } else if (typeStr == "integer") {
          let onePiece = `/// ${item.description}\nvar ${key}: Int = 0`;
          result = result + onePiece + "\n";
        } else if (typeStr == "boolean") {
          let onePiece = `/// ${item.description}\nvar ${key}: Bool = false`;
          result = result + onePiece + "\n";
        } else if (typeStr == "array") {
          let onePiece = `/// ${item.description}\nvar ${key}: [Any] = [Any]() // todo`;
          result = result + onePiece + "\n";
        } else if (typeStr == "object") {
          if (Array.isArray(item)) {
            let onePiece = `/// ${item.description}\nvar ${key}: [Any] = [Any]()`;
            result = result + onePiece + "\n";
          } else {
            if (item == null) {
              let onePiece = `/// ${item.description}\nvar ${key}: Any? // todo`;
              result = result + onePiece + "\n";
            } else {
              let onePiece = `/// ${item.description}\nvar ${key}: [String:Any] = [String:Any]()`;
              result = result + onePiece + "\n";
            }
          }
        } else {
          let onePiece = `/// ${item.description}\nvar ${key}: Any? // todo`;
          result = result + onePiece + "\n";
        }
      })
      return result
    },

    tapModel(modelTitle) {
      // console.log('modelTitle :', modelTitle);
      var arr = []
      for (let index = 0; index < this.modelArr.length; index++) {
        const model = this.modelArr[index]
        // console.log('model.title :', model.title);
        if (model.title === modelTitle) {
          this.currentModelTitle = modelTitle
          arr.push(model)
          break
        }
      }
      if (arr.length > 0) {
        this.currentModelArr = arr
        // console.log('arr :', '⭕️有了', JSON.stringify(arr, null, 2))
        this.dialogTableVisible = true
      } else {
        ElMessageBox.alert('请检查数据结构是否正常', '模型匹配失败', {
          confirmButtonText: '我知道了'
        })
      }
    },

    onTap() {
      this.showDoc = true
    },

    goGithub() {
      window.open('https://github.com/lixiangios/light-swagger', '_blank')
    },

  },
}
</script>
<style>
.home {
  background-color: white;
}

.likeBtn {
  color: #409EFF;
  cursor: pointer;
}
</style>