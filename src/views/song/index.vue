<template>
    <div class="song" :style="{ backgroundImage: 'url(http://music.163.com/api/img/blur/'+song.pic_str+')' }">
	    <div class="song-wrap">
		    <div class="clearfix" @click="songFun" :style="{ height: screen.height+'px' }">
		    	<div class="song-player" ref="songPlayerNode">
					<i class="pointer" :style="{ transform: song.isPlay ? 'rotate(20deg)' : 'rotate(0deg)'}"></i>
					<i class="img-bg" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }"></i>	
		    		<div class="img" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }">
		    			<img :src="song.picUrl" alt="">
		    			<i class="status" v-show="!song.isPlay"></i>
		    		</div>
		    	</div>

		    	<div class="lyric" :style="{ height: screen.lyricHeight+'px' }">
		    		<div class="lyric-wrap">
		    			<ul ref="lyricNode" class="lyric-list" :style="{ 'transition-duration' : transitionDurationTime, transform: 'translate(0,'+ -getLiPosY() +'px)' }">
		    				<li :class="{ active: index ==activeIndex }" v-for="item,index in song.lyric" :key="index">{{ item.content }}</li>
		    			</ul>
		    		</div>
		    	</div>
	    	</div>


			<div class="simiSong">
		    	
		    		<div class="title">喜欢这首歌的人也听 <a class="fa fa-play-circle-o" @click="pushSongs" href="javascript:;">一键收听</a></div>   		
					<ul class="simiSong-list">
						<li v-for="item in simiSongData" :key="item.id">
							<router-link :to="'/song/'+item.id">
								<img :src="item.picUrl" alt="">	
								<div class="text">
									<div class="name">{{ item.name }}</div>
									<div class="singer">{{ item.artist }} - {{ item.albumName }}</div>
								</div>
								<i class="fa fa-play-circle-o"></i>
							</router-link>
						</li>
					</ul>
		    	
		    </div>

		    <div class="comment">
		    	<div class="comment-wrap">
		    		<div class="title">精彩评论</div>
		    		<ul class="comment-list">
		    			<li v-for="item,index in song.commentMusicData" :key="index">
		    				<img :src="item.user.avatarUrl" alt="">
		    				<div class="meta">
			    				<div class="text">
			    					<div class="name">{{ item.user.nickname }}</div>
			    					<div class="time">{{ parseDate(item.time) }}</div>
			    				</div>
			    				<div class="like">
			    					{{ item.likedCount }}
			    					<i class="fa fa-thumbs-o-up"></i>
			    				</div>
		    				</div>
		    				<div class="content">
		    					{{ item.content }}		
		    				</div>
		    			</li>
		    		</ul>
		    	</div>
		    </div>
    	</div>
    </div>
</template>

<script>
import { getSongUrl,getSongDetail,getLyric,getSimiSong,getCommentMusic } from '@/api/song';
import { parseDate } from '@/utils/date';
import { Toast } from 'mint-ui'

export default {
	data(){
		return{
			song: {
				id: null,
				isPlay: true,
				url: null,
				name: '',
				picUrl: '',
				pic_str: '',
				lyric: [],//{ time: 0, content: '歌词',  }
				activeIndex: 0,
				commentMusicData: [],
			},
			simiSongData: [],

			screen: {
				height: null,//屏幕的高度,以px为单位
				lyricHeight: null,//歌词高度
			},
			transitionDurationTime: 0,//过渡的动画时间			
		};
	},
	created(){
		this.init();
	},
	mounted(){
		var dpr = document.documentElement.getAttribute('data-dpr');
		var windowResize = () =>{
			this.screen.height = window.screen.height * dpr;
			this.screen.lyricHeight = this.screen.height - this.$refs.songPlayerNode.clientHeight - this.$refs.songPlayerNode.offsetTop;//可视高度 + this.$refs.songPlayerNode.offsetTop
		};
		window.onresize = windowResize;
		windowResize(); 
	},
	methods: {
		parseDate,
		async init(){
			await this.getSongDetail();	//同步
			await this.getLyric();
			this.getSimiSong();
		    this.getCommentMusic();
			this.getSongUrl();

			this.song.id = Number(this.$route.params.id);
		},
		songFun(){
			this.song.isPlay = !this.song.isPlay;
			this.$store.commit('updateSong',this.song);
			this.$store.commit('updateSongList',this.song.id);
		},
		getLiPosY(){
			if(this.$refs.lyricNode){
				var liNode = this.$refs.lyricNode.querySelector('li:nth-child(' + (this.activeIndex + 1) + ')');
				if(liNode){
					var offsetTop = liNode.offsetTop
					return offsetTop
				}
				else{
					return 0;
				}
			}
			else{
				return 0;
			}
		},
		pushSongs(){
			//一键收听，将歌曲id加入播放器列表
			var playload = this.simiSongData.map((item) => item.id);//等价this.simiSong.map(itme =>{ return itme.id;});
			Toast('收听成功！');
			this.$store.commit('updateSongList',playload);
		},
		getSongUrl(){
			var id = this.$route.params.id;
			getSongUrl({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				if(data.code == 200){
					var song = data.data[0];
					if(song){
						if(this.url != song.url){//对同一首歌曲进入不做重新播放处理
							this.song.url = song.url;
							this.songFun();
						}
					}
				}
			});
		},
		getSongDetail(){//歌曲详情
			return new Promise((resolve,reject) =>{
				var ids = this.$route.params.id;
				getSongDetail({
					params: {
						ids
					}
				}).then(res =>{
					var data = res.data;
					if(data.code == 200){					
						var songData = data.songs[0];
						if(songData){
							var al = songData.al;
							this.song.name = al.name;
							this.song.picUrl = al.picUrl;
							this.song.pic_str = al.pic_str;
						}
					}
					resolve(true);
				});
			});			
		},
		getLyric(){//歌词
			return new Promise((resolve,reject) =>{
				var id = this.$route.params.id;
				getLyric({
					params: {
						id
					}
				}).then(res =>{
					var data = res.data;
					if(data.code == 200){					
						var lyric = data.lrc.lyric;
						if(lyric){
							var lyricArr = lyric.split(/\n/);
							var newLyricArr = lyricArr.map(item =>{
								var arrItem = item.split(']');
								var arrTime = arrItem[0].slice(1).split(':');
								var time = arrTime[0]*60+Number(arrTime[1]);
								var content = arrItem[1];
								return {
									time,
									content
								};
							});
							this.song.lyric = newLyricArr;
						}
					}
					resolve(true);
				});
			});
			
		},
		transitionDuration(){//过渡时间
			var activeLyric = this.song.lyric[this.activeIndex];//当前歌词
			var nextIndex = this.activeIndex + 1;//下一个索引
			while(true){//优化，找到下一句有个词的时间
				var nextLyric = this.song.lyric[nextIndex];
				if(nextLyric){
					if(nextLyric.content == ''){
						nextIndex++;
					}
					else{
						this.transitionDurationTime = (nextLyric.time - activeLyric.time) + 's';
						break;
					}	
				}
				else{
					this.transitionDurationTime = 0;
					break;
				}
			}
		},
		getSimiSong(){//相似歌曲
			var id = this.$route.params.id;
			getSimiSong({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				if(data.code == 200){
					this.simiSongData = data.songs.map((item) =>{
						return {
							id: item.id,
							name: item.name,
							picUrl: item.album.picUrl,
							albumName: item.album.name,
							artist: item.artists[0] ? item.artists[0].name : ''
						}
					});
				}	
			});
		},
		getCommentMusic(){//歌曲评论
			var id = this.$route.params.id;
			getCommentMusic({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				if(data.code == 200){
					this.song.commentMusicData = data.hotComments;
				}	
			});
		},
	},
	computed: {
		activeIndex(){
			return this.songStore.activeIndex;
		},
		songStore(){
			return this.$store.getters.song;
		},
		url(){
			return this.songStore.url;
		},
		isPlay(){
			return this.songStore.isPlay;
		},
	},
	watch: {
		isPlay(newval){
			this.song.isPlay = newval;
		},
		activeIndex(newval){
			this.transitionDuration();
		},
		['$route'](newval,oldval){
			this.init()
		}
	},
	components: {

	},
}
</script>

<style lang="scss" scoped>
/* clearfix消除外边距重叠 */
@keyframes circle{
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
.song{
	background: #484848 no-repeat center 0 / auto 100%;
}
.song-wrap{
	background: rgba(0, 0, 0, 0.5);
	overflow-x:hidden;
	.lyric{
		box-sizing: border-box;
		padding: 46px 0;
		display: flex;
	}
	.lyric-wrap{
		width: 100%;
		text-align: center;
		color: 	rgba(255, 255, 255, 0.4);
		font-size: 34px;/*px*/
		overflow: hidden;
		.lyric-list{
			transition-property: transform
		}
		li{
			min-height:80px;//至少高度
			line-height: 80px;
		}
		.active{
			color:	rgba(255, 255, 255, 1);
		}
	}
}
.song-player{
	display:flex;
	justify-content: center;
	align-items: center;
	position: relative;
	width: 585px;
	height:585px;
	margin:175px auto 0;
	.pointer{
		position:absolute;
		left: 50%;
		top:-185px;
		z-index:8;
		width:207px;
		height:315px;
		background:url('~@/assets/img/needle.png') no-repeat center 0 / 168px 244px;
		transition: transform 0.5s;
		transform-origin:80px 0;
	}
	.img-bg{
		position: absolute;
		left: 0;
		top: 0;
		z-index:2;
		width: 100%;
		height: 100%;
		background: url('~@/assets/img/disc.png') no-repeat 0 0 / 100% 100%;
		animation: circle 5s linear infinite;
	}
	.img{
		position:relative;
		z-index: 5;
		width:370px;
		height:370px;
		border-radius: 50%;
		overflow: hidden;
		background:#000;
		animation: circle 5s linear infinite;
	}
	.status{
		position:absolute;
		left:50%;
		top:50%;
		margin:-50px 0 0 -50px;
		width:100px;
		height:100px;
		background:url('~@/assets/img/play-icon.png') no-repeat 0 0 / 100% 100%;
	}
}

.simiSong{
	padding:40px 30px 0;	
}
.title{
	color: #fff;
	font-size: 34px;/*px*/
	line-height:50px;/*px*/
	display: flex;
	justify-content: space-between;
	align-items: center;
	.fa-play-circle-o {
		border: 1px solid #fff; /*no*/
	    border-radius: 24px;
	    padding: 0 16px;
	    color: #fff;
	    line-height: 48px;
	    font-size: 26px; /*px*/
	}
}	
.simiSong-list{
	margin-top: 24px;	
	li{
		height:120px;
		&>a{
			position:relative;
			display: flex;
			justify-content: space-between;
		}
		img{
			padding:18px 0;
			width: 84px;
			height: 84px;
			border-radius: 6px;
			overflow:hidden;
		}
		.text{
			position:absolute;
			left:104px;
			top: 18px;
		}
		.name{
			font-size: 30px;/*px*/
			line-height: 44px;/*px*/
			color:#fff;
		}
		.singer{
			font-size:24px;/*px*/
			line-height: 30px;/*px*/
			color: rgba(255, 255, 255, 0.6);
		}
		.fa-play-circle-o{
			display: flex;
			align-items: center;
			font-size: 44px;/*px*/
			color: #766c62;
		}
	}
}

.comment{
	padding-top: 52px;
	padding-left: 30px;
}
.comment-list{
	margin-top:4px;
	li{
		margin-top:32px;
		img{
			width:64px;
			height:64px;
			border-radius:50%;
		}
		.meta{
			width:608px;
			display:inline-flex;
			justify-content: space-between;
			padding-left:18px;
		}
		.name{
			color: rgba(255, 255, 255, 0.7);
			font-size: 24px;/*px*/
			line-height: 36px;/*px*/
		}
		.time{
			color: rgba(255, 255, 255, 0.3);
			font-size: 20px;/*px*/
			line-height: 28px;/*px*/
		}
		.like{
			color: #999;
			margin-top: 10px;
			font-size:24px;/*px*/
		}
		.content{
			margin:12px 30px 0 83px;
			padding-bottom:23px;
			border-bottom:3px solid #5b4d44;/*no*/
			color: #fff;
			font-size: 28px;/*px*/
			line-height: 40px;/*px*/
		}
	}
}
</style>