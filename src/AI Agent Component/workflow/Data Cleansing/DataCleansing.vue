<template>
  <div class="data-cleansing-wrapper">
    <DataCleansingTool />
  </div>
</template>

<script>
import DataCleansingTool from './DataCleansingTool.vue';

export default {
  name: 'DataCleansing',
  components: {
    DataCleansingTool
  }
};
</script>

<style scoped>
.data-cleansing-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 0;
  box-shadow: none;
}
</style>
