import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var store = new Vuex.Store({
	state: {//放数据的
		song: {//歌曲数据
			id: null,
			url: '',//歌曲地址
			name:'',//歌名
			isPlay: false,
			picUrl: '',
			pic_str: '',
			lyric: [],
			activeIndex: 0,
		},
		songList: [],//需要播放歌的id集合
	},
	getters: {//在组件中得到state
		song: state => state.song,
		songList: state => state.songList,
	},
	mutations: {//同步处理state
		updateSong(state,playload){
			state.song = playload;
		},
		updateSongList(state,playload){
			state.songList = [...new Set(state.songList.concat(playload))];
		},
	},
	actions: {//异步处理

	},
})

export default store;