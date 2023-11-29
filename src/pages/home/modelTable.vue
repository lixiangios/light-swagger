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
      navigator.clipboard.writeText(text).then(function () {
        ElMessage({ message: '复制成功', type: 'success' })
      }).catch(function (error) {
        ElMessage({ message: `复制失败:${error}`, type: 'error' })
      })
    }
  }

}
</script>