import Vue from 'vue'
import Router from 'vue-router'
import recommendationIndex from '@/views/recommendation/index'
import searchIndex from '@/views/search/index'
import hotIndex from '@/views/hot/index'
import songIndex from '@/views/song/index'
import playlistIndex from '@/views/playlist/index'
import artistIndex from '@/views/artist/index'
import albumIndex from '@/views/album/index'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'recommendation index',
      component: recommendationIndex
    },
    {
      path: '/search',
      name: 'search index',
      component: searchIndex
    },
    {
      path: '/hot',
      name: 'hot index',
      component: hotIndex
    },
    {
      path: '/song/:id',
      name: 'play song',
      component: songIndex
    },
    {
      path: '/playlist/:id',
      name: 'playlist index',
      component: playlistIndex
    },
    {
      path: '/artist/:id',
      name: 'artist index',
      component: artistIndex
    },
    {
      path: '/album/:id',
      name: 'album index',
      component: albumIndex
    },
  ]
})
