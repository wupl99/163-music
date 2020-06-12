<template>
    <div>
    	<div class="playlistTop" :style="{ backgroundImage: 'url(http://music.163.com/api/img/blur/'+playlist.pic_str+')' }">
    		<div class="playlistTop-wrap">
    			<h2>{{ playlist.name }}</h2>
    			<pre class="description">{{ playlist.description }}</pre>
    			<i class="fa fa-angle-right"></i>
    		</div>
    	</div>

    	<div class="list">歌曲列表</div>
    	<div class="playlistContent">
			<ul class="playlist">
				<li v-for="item,index in playlistData" :key="item.id" class="clearfix">
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

		<div class="comment-title">精彩评论</div>
		<div class="comment">
			<ul class="comment-list">
				<li v-for="item,index in playlistCommentData" :key="index">
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
</template>

<script>
import { parseDate } from '@/utils/date';
import { getPlaylist,getCommentPlaylist } from '@/api/playlist'

export default {
	data(){
		return{
			playlist: {
				pic_str: null,
				picUrl: null,
				name: '',
				description: '',
			},
			playlistData: [],
			playlistCommentData: [],
		};
	},
	created(){
		this.getPlaylist();
		this.getCommentPlaylist();
	},
	methods: {
		parseDate,
		getPlaylist(){
			var id = this.$route.params.id;
			getPlaylist({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				console.log(data,111);
				if(data.code == 200){
					this.playlist.picUrl = data.playlist.coverImgUrl;
					this.playlist.pic_str = data.playlist.coverImgId_str;
					this.playlist.name = data.playlist.name;
					this.playlist.description = data.playlist.description;
					this.playlistData = data.playlist.tracks;
				}
			});
		},
		getCommentPlaylist(){
			var id = this.$route.params.id;
			getCommentPlaylist({
				params: {
					id
				}
			}).then(res =>{
				var data = res.data;
				if(data.code == 200){
					this.playlistCommentData = data.hotComments;
				}
			});
		},
	},
	components: {

	}
}
</script>

<style lang="scss" scoped>
.playlistTop{
	height:420px;
	background-size: cover;
}
.playlistTop-wrap{
	position:relative;
	height:100%;
	padding:0 29px 0 54px;
	background: rgba(0, 0, 0, 0.25);
	&>h2{
		padding-top: 80px;
		padding-right:30px;
		color: #fefefe;
		font-size: 38px;/*px*/
		line-height: 54px;/*px*/
	}
	.description{
		position:absolute;
		left:54px;
		bottom:54px;
		overflow: hidden;
		-webkit-line-clamp: 2;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		color:#e9e0e4;
		font-size: 26px;/*px*/
		line-height: 42px;/*px*/
		font-family: '微软雅黑';
	}
	.fa-angle-right{
		position:absolute;
		right:29px;
		bottom:54px;
		color:#e9e0e4;
	}
}

.list{
	margin-left:20px;
	background: #eeeff0;
	color:#666;
	height:46px;
	line-height:46px;
	font-size:25px;/*px*/
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

.comment-title{
	background: #ebebeb;
	margin-left:20px;
	color:#666;
	height:46px;
	line-height:46px;
	font-size:25px;/*px*/
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
			color: #666;
			font-size: 24px;/*px*/
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
			padding-bottom:23px;
			border-bottom:1px solid #dfdfdf;/*no*/
			color: #333;
			font-size: 28px;/*px*/
			line-height: 40px;/*px*/
		}
	}
}
</style>