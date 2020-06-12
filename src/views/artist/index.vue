<template>
    <div>
		<div class="Top" :style="{ backgroundImage: 'url('+artistData.picUrl+')' }">
    		<div class="Top-wrap">
    			<div class="intro">
	    			<h2>{{ artistData.name }}</h2>
	    			<p class="rank">歌手榜华语地区 No.</p>
	    			<p class="nickName">昵称：</p>
	    			<p class="follow">关注 <span> 丨 </span>粉丝 </p>
	    			<p class="work"></p>
    			</div>
    		</div>
    	</div>

    	<div class="title">歌手简介</div>
    	<div class="artistDesc">
    		<p class="desc" v-if="descShow">{{ artistData.desc }}</p>
    		<p v-else>{{ artistData.desc }}</p>
    		<div class="angle" v-if="descShow" @click="descShow = false">完整歌手介绍<i class="fa fa-angle-down"></i></div>
    		<div class="angle" v-else @click="descShow = true">收起<i class="fa fa-angle-up"></i></div>
    	</div>

    	<div class="title">歌曲列表</div>
    	<div class="playlistContent">
			<ul class="playlist">
				<li v-for="item,index in hotSongs" v-if="index<5" :key="item.id" class="clearfix">
					<div class="num"><div>{{ index+1 }}</div></div>
					<router-link :to="'/song/'+item.id">
						<div class="text">
							<div class="name">{{ item.name }}<span>{{ item.alia[0] != null ? '(' + item.alia[0] + ')' : '' }}</span></div>
							<div class="singer">{{ item.ar[0].name != null ? item.ar[0].name : '' }} - {{ item.al.name }}</div>
						</div>
						<i class="fa fa-play-circle-o"></i>
					</router-link>
				</li>
			</ul>
		</div>

		<div class="title">最新音乐</div>
		<div class="newsMusic">
			<img :src="albumData.blurPicUrl" class="imgBg">
			<div class="albumContent"> 
				<p class="albumName">{{ albumData.name }}</p>
				<p class="artistName">{{ artistData.name }}</p>
				<p class="size">{{ albumData.size }}首 {{ publishDate( albumData.publishTime ) }}</p> 
			</div>
		</div>

		<div class="title">影响力 <i class="el-icon-warning-outline"></i></div>

    </div>
</template>

<script>
import { getArtists,getArtistAlbum } from '@/api/artist'
import { publishDate } from '@/utils/date';

export default {
	data(){
		return{
			artistData: {
				picUrl: null,
				name: '',
				desc: '',
			},
			hotSongs: [],
			albumData: [],
			descShow: true,
		};
	},
	created(){
		this.getArtists();
		this.getArtistAlbum();
	},
	methods: {
		publishDate,
		getArtists(){
			var id = this.$route.params.id;
			getArtists({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				console.log(data,222);
				if(data.code == 200){
					this.artistData.picUrl = data.artist.picUrl;
					this.artistData.desc = data.artist.briefDesc;
					this.artistData.name = data.artist.name;
					this.hotSongs = data.hotSongs;
				}
			});
		},
		getArtistAlbum(){
			var id = this.$route.params.id;
			getArtistAlbum({
				params: {
					id,
					limit: 1
				}
			}).then(res =>{
				var data = res.data;
				console.log(data,333);
				if(data.code == 200){
					this.albumData = data.hotAlbums[0];
				}
			});
		},
	},
	components: {

	}
}
</script>

<style lang="scss" scoped>
.Top{
	height:610px;
	background-size: cover;
}
.Top-wrap{
	position:relative;
	height:100%;
	padding-left: 30px;
	background: rgba(0, 0, 0, 0.25);
	color: #fff;
	font-size: 26px;/*px*/
	.intro{
		padding-top:258px;
	}
	&>h2{
		font-size: 36px;/*px*/
	}
	.rank{
		margin-top:40px;
		margin-bottom:36px;
	}
	.nickName,.follow{
		margin-bottom:20px;
	}
}

.title{
	margin-left:30px;
	background: #fff;
	color:#333;
	height:113px;
	line-height:112px;
	font-size:34px;/*px*/
	font-weight: 700;
}
.artistDesc{
	margin-left:30px;
	margin-right:40px;
	color:#666;
	font-size: 26px;/*px*/
	line-height: 42px;/*px*/
	.desc{
		overflow: hidden;
		-webkit-line-clamp: 3;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.angle{
		color:#666;
		font-size:26px;/*px*/
		text-align:center;
		height:110px;
		line-height: 110px;/*px*/
	}
}

.playlist{
	li{		
		.num{	
			position:relative;
			float:left;
			width:80px;
			height:111px;
			color:#999;
			&>div{
				position:absolute;
				left:50%;
				top:50%;
				transform: translate(-50%,-50%);
			}
		}
		&>a{
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between;
			border-bottom: #e2e2e3 1px solid;/*no*/
		}
		.text{
			padding:13px 0;
		}
		.name{
			font-size: 26px;/*px*/
			line-height: 48px;/*px*/
			&>span{
				color:#888;
			}
		}
		.singer{
			font-size:24px;/*px*/
			line-height: 36px;/*px*/
			color: #888;
		}
		.fa-play-circle-o{
			margin-right:20px;
			display: flex;
			align-items: center;
			font-size: 44px;/*px*/
			color: #aaa;
		}
	}
}

.newsMusic{
	margin-left:30px;
	margin-bottom:60px;
	height:160px;
	position:relative;
	background: url(https://s3.music.126.net/mobile-new/img/album@3x.png?0ec33f3%E2%80%A6) no-repeat 0 0;
	background-size: contain;
	&>img{
		position:absolute;
		left: 0;
		top: 0;
		width:160px;
		height:160px;
		border-radius: 8px;
	}
	.albumContent{
		position:absolute;
		left:212px;
		top: 10px;
		color:#888;
		.albumName{
			color:#333;
			font-size: 28px;/*px*/
			margin-bottom:16px;
		}
		.artistName{
			font-size:24px;/*px*/
			margin-bottom:30px;
		}
		.size{
			font-size:26px;/*px*/
		}
	}
}

</style>