<template>
  <div draggable="true" @dragstart="drag(item)"  class="item"><img :src="item.itemIcon_URL" /><h5>{{item.DeviceName}}</h5></div>
</template>

<script>

  export default {
      props: ['item'],
      name: "Item",
      methods: {
        drag(item){
          this.$parent.$emit('dragging', item);
        }
      }
    }
</script>

<style scoped>
  .item{
    width: 150px;
    height: 150px;
    background-color: purple;
    float: left;
    margin: 10px;
  }
</style>
