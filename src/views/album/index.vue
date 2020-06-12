<template>
    <div>
		<div class="Top" :style="{ backgroundImage: 'url('+albumData.picUrl+')' }">
    		<div class="Top-wrap">
	    		<div class="album">	    			
					<img :src="albumData.blurPicUrl" class="imgBg">
					<div class="albumContent"> 
						<router-link :to="`/artist/${albumData.artistId}`" class="albumContent-wrap">
							<p class="albumName">{{ albumData.album }}</p>
							<p class="artistName">歌手：<span class="artist">{{ albumData.artist }}</span></p>
							<p class="time">发行时间：{{ publishDate( albumData.publishTime ) }}</p>
						</router-link> 
					</div>
				</div>
    		</div>
    	</div>

    	<div class="albumDesc">
    		<div class="desc break" v-if="descShow">简介：{{ albumData.description }}</div>
    		<div class="break" v-else>简介：{{ albumData.description }}</div>
    		<div class="angle" v-if="descShow" @click="descShow = false"><i class="fa fa-angle-down"></i></div>
    		<div class="angle" v-else @click="descShow = true"><i class="fa fa-angle-up"></i></div>
    	</div>

    	<div class="title">歌曲列表</div>
    	<div class="playlistContent">
			<ul class="playlist">
				<li v-for="item,index in songsList" :key="item.id" class="clearfix">
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

		<div class="title">精彩评论</div>
		<ul class="comment-list">
			<li v-for="item,index in hotCommentsAlbumData" :key="index">
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
		<ul class="comment-list">
			<li v-for="item,index in commentsAlbumData" :key="index" v-if="isShow">
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
		<div class="commentFoot" @click="isShow=true" v-show="!isShow">
			<span class="commentView">查看全部{{ total }}条评论 <i class="fa fa-angle-right"></i></span>
		</div>

    </div>
</template>

<script>
import { publishDate,parseDate } from '@/utils/date';
import { getAlbum,getCommentAlbum } from '@/api/album'

export default {
	data(){
		return{
			albumData: {
				blurPicUrl: null,
				picUrl: null,
				album: '',
				artist: '',
				publishTime: null,
				description: '',
				artistId:'',
			},
			songsList: [],
			hotCommentsAlbumData: [],
			commentsAlbumData: [],
			total: '',
			descShow: true,
			isShow: false,
		};
	},
	created(){
		this.getAlbum();
		this.getCommentAlbum();
	},
	methods: {
		publishDate,
		parseDate,
		getAlbum(){
			var id = this.$route.params.id;
			getAlbum({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				console.log(data,22);
				if(data.code == 200){
					this.albumData.description = data.album.description;
					this.songsList = data.songs;
					this.albumData.picUrl = data.album.blurPicUrl;
					this.albumData.blurPicUrl = data.album.blurPicUrl;
					this.albumData.album = data.album.name;
					this.albumData.artist = data.album.artist.name;
					this.albumData.artistId = data.album.artist.id;
					this.albumData.publishTime = data.album.publishTime;
				}
			});
		},
		getCommentAlbum(){
			var id = this.$route.params.id;
			getCommentAlbum({
				params: {
					id,
					limit: 100,
				}
			}).then(res =>{
				var data = res.data;
				console.log(data,33);
				if(data.code == 200){
					this.hotCommentsAlbumData = data.hotComments;
					this.commentsAlbumData = data.comments;
					this.total = data.total;
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
	height:372px;
	background-size: cover;
}
.Top-wrap{
	position:relative;
	padding:60px 0 60px 30px;
	background: rgba(0, 0, 0, 0.25);
	color: #fff;	
	.album{
		position:relative;
		height:252px;
		background: url(//s3.music.126.net/mobile-new/img/album@2x.png?4d5d63fbc459c8e2f7dddead07514fba=) no-repeat 0 0;
		background-size: contain;
		img{
			position:absolute;
			left: 0;
			top: 0;
			width:252px;
			height:252px;
			border-radius: 8px;
		}
		.albumContent{
			position:absolute;
			left:304px;
			top: 26px;
			font-size:24px;/*px*/
			.albumContent-wrap{
				color:hsla(0,0%,100%,.5);
			}
			.albumName{
				color:#fefefe;
				font-size: 28px;/*px*/
				margin-bottom:58px;
			}
			.artistName{
				margin-bottom:22px;
			}
			.artist{
				color:#fefefe;
			}
		}
	}
}

.title{
	padding-left:30px;
	background: #eeeff0;
	color:#666;
	height:46px;
	line-height:46px;
	font-size:26px;/*px*/
}
.albumDesc{
	background:#fff;
	margin-top:20px;
	margin-left:30px;
	margin-right:40px;
	color:#666;
	font-size: 28px;/*px*/
	line-height: 38px;/*px*/
	.desc{
		overflow: hidden;
		-webkit-line-clamp: 3;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}
	.break{
		white-space: pre-wrap;
	}
	.angle{
		text-align: right;
		color:#666;
		font-size:26px;/*px*/
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
	.imgBg:after{

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

.comment-list{
	margin-top:4px;
	margin-left:30px;
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
			color: #666;
			font-size: 28px;/*px*/
			line-height: 36px;/*px*/
		}
		.time{
			color: #999;
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
			padding-bottom:25px;
			border-bottom:1px solid #dfdfdf;/*no*/
			font-size: 28px;/*px*/
			line-height: 40px;/*px*/
		}
	}
}

.commentFoot{
	height:110px;
	line-height:110px;
	text-align:center;
}
.commentView{
	text-align:center;
	padding-right:28px;
	color:#999;
}

</style>