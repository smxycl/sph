<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Like></Like>
    <Floor
      v-for="floorItem in floorList"
      :key="floorItem.id"
      :floor="floorItem"
    ></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ListContainer from '@/views/Home/ListContainer'
import Recommend from '@/views/Home/Recommend'
import Like from '@/views/Home/Like'
import Brand from '@/views/Home/Brand'
import Floor from '@/views/Home/Floor'
import Rank from '@/views/Home/Rank'
export default {
  name: 'Home',
  components: {
    ListContainer,
    Recommend,
    Like,
    Brand,
    Rank,
    Floor,
  },
  mounted() {
    this.$store.dispatch('getFloorsList')
    // this.$store.dispatch('getUserInfo')
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
}
</script>

<style>
</style>