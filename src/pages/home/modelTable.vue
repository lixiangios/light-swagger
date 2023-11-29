<template>
  <el-table border :data="modelArr">
    <el-table-column label="title" width="200">
      <template #default="scope">
        <div class="lxCenterRow">
          <text selectable>{{ scope.row.title }}</text>
          <el-icon class="ml-6px" style="cursor: pointer;" @click="copy(scope.row.title)">
            <DocumentCopy />
          </el-icon>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="property">
      <template #default="scope">
        <div v-if="scope.row.propertyArr.length" class="lxCenterColumn">
          <div v-for="(item, index) in scope.row.propertyArr" :key="index" class="lxCenterRow mb-4px">
            <el-tag class="mr-3px">{{ item.type }}</el-tag>
            <text class="mr-3px" style="flex-shrink: 0;" selectable>{{ item.name }} // {{ item.description }}</text>
          </div>
        </div>
        <div v-else class="lxCenterC">-</div>
      </template>
    </el-table-column>
    <el-table-column label="swift model">
      <template #default="scope">
        <div class="lxCenterRow">
          <text selectable style="font-size: 11px;line-height:14px">{{ scope.row.swiftModel }}</text>
          <el-icon class="ml-6px" style="cursor: pointer;" @click="copy(scope.row.swiftModel)">
            <DocumentCopy />
          </el-icon>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
  props: {
    modelArr: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    copy(text) {
      this.handleCopyValue(text).then(() => {
        ElMessage({ message: '复制成功', type: 'success' })
      }).catch(() => {
        ElMessage({ message: `复制失败:${error}`, type: 'error' })
      })
    },

    handleCopyValue(text) {
      //浏览器禁用了非安全域的 navigator.clipboard 对象
      //在线上环境会报错 TypeError: Cannot read properties of undefined (reading 'writeText')
      if (!navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text)
      } else {
        // 判断是否支持拷贝
        if (!document.execCommand('copy')) return Promise.reject()
        // 创建标签，并隐藏
        const textArea = document.createElement('textarea')
        textArea.style.position = 'fixed'
        textArea.style.top = textArea.style.left = '-100vh'
        textArea.style.opacity = '0'
        textArea.value = text
        document.body.appendChild(textArea)
        // 聚焦、复制
        textArea.focus()
        textArea.select()
        return new Promise((resolve, reject) => {
          // 不知为何，必须写这个三目，不然copy不上
          document.execCommand('copy') ? resolve() : reject()
          textArea.remove()
        })
      }
    }
  }

}
</script>