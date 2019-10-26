<template>
  <div class="hello">
    <div class="from">
      <Item  v-for="item in itemsUnselected" :key="item.ItemIdd" :item="item">{{item}}</Item>

      <div style="clear:both;"></div>
    </div>
    <h1>Build cost {{price}} </h1>
    <div class="to" @dragover.prevent @drop="addItem()" >
      <item v-for="item in itemsSelected" :key="item.ItemId" :item="item"></Item>
      <div style="clear:both;" ></div>
    </div>
  </div>
</template>

<script>
  import Item from './Item';

  import {Ping, CreateSession, GetItems} from "../assets/js/api";

  export default {
    components: {Item},
    name: 'HelloWorld',
    data () {
      return {
        draggingItem:  null,
        rawItemsUnselected: [],
        itemsUnselected : {},
        itemsSelected : {},
        msg: 'Welcome to Your Vue.js App',
        price: 0
      }
    },
    created(){
      this.$on('dragging', (item) => {
        console.log(`dragging item`, item);
        this.draggingItem = item;

      })


      Ping();
      CreateSession();

      GetItems().then(response =>{
        this.rawItemsUnselected = response.data;
        this.rearrangeArray();
        console.log(`item`, response.data[0]);
      })
    },
    methods : {
      addToPrice(item){
        //so lets calculate what to add.
        //does this item have a child?
        if(item.ChildItemId > 0){
          //is his child in the selected list?
        }
        this.price += item.Price;
      },
      rearrangeArray(){
        console.log(`raw items`, this.rawItemsUnselected)
        this.rawItemsUnselected.forEach((item) =>{
          this.itemsUnselected[item.ItemId] = item;
        })

        this.$forceUpdate();
        console.log(`items`, this.itemsUnselected);
      },
      addItem(){
        //this.checkIfParentItemInSelected(this.draggingItem);
        //remove from unselected
        delete this.itemsUnselected[this.draggingItem.ItemId];


        this.checkIfChildItemInSelected(this.draggingItem);


        //add to selected and calculate new price
        this.itemsSelected[this.draggingItem.ItemId] = this.draggingItem;
        this.addToPrice(this.draggingItem);


        console.log('Finished dragging', this.draggingItem )
        console.log(`items selected: `, this.itemsSelected)
        this.$forceUpdate();
      },
      checkIfChildOrParentInItemSelected(item){
        switch(item.ItemTier){
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
        }
      },
      checkIfChildItemInSelected(item){
        //does this item have a child?
        if(item.ChildItemId > 0){
          //is his child in the selected list?
          if(this.itemsSelected[item.ChildItemId]){
            this.itemsUnselected[item.ChildItemId] = this.itemsSelected[item.ChildItemId];
            //delete it form the list if its there...
            delete this.itemsSelected[item.ChildItemId]
          }

          //if the child has a child (maximum 3 tiers so this is last)
          if(this.itemsUnselected[item.ChildItemId].ChildItemId > 0){
            //if its in the selected list
            if(this.itemsSelected[this.itemsUnselected[item.ChildItemId].ChildItemId]){
              //add it to unselected list
              this.itemsUnselected[this.itemsUnselected[item.ChildItemId].ChildItemId] = this.itemsSelected[this.itemsUnselected[item.ChildItemId].ChildItemId];
              //delete it from the list if its there
              delete this.itemsSelected[this.itemsUnselected[item.ChildItemId].ChildItemId];
            }
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .from{

    margin: 100px auto;
    border: 2px solid red;
    width: 920px;
    min-height: 200px;
    max-height: 300px;
    overflow: scroll;
  }

  .to{
    margin: 100px auto;
    border: 2px solid green;
    width: 920px;
    min-height: 200px;
  }

</style>
