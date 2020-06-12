<template>
    <div>
    	<app-nav :activeIndex="1"></app-nav>
		<div class="hotTop">
			<div class="hotTop-icon icon"></div>
			<div class="hotTop-time">
				更新日期：{{ uploadDate() }}
			</div>
		</div>

		<div class="hotContent">
			<ul class="hotSong-list">
				<li v-for="item,index in hotSongData" :key="item.id" class="clearfix" v-if="index < 20 || isShow == true">
					<div class="num"><div :class="{ red:( index < 3 ) }">{{ index+1 < 10 ? '0'+(index+1) : index+1 }}</div></div>
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

		<div class="hotFoot" @click="isShow=true" v-show="!isShow">
			<span class="hotView">查看完整榜单</span>
		</div>
    </div>
</template>

<script>
import appNav from '@/components/app-nav'
import { uploadDate } from '@/utils/date';
import { getHot } from '@/api/hot'

export default {
	data(){
		return{
			hotSongData: [],
			isShow: false,
		};
	},
	created(){
		this.getHot();
	},
	methods: {
		uploadDate,
		getHot(){
			getHot({}).then(res =>{
				var data = res.data;
				//console.log(data);
				if(data.code == 200){
					this.hotSongData = data.playlist.tracks;
				}
			});
		},
	},
	components: {
		appNav
	}
}
</script>

<style lang="scss" scoped>
.hotTop{
	height: 292px;
	background: url(https://s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252389c26bcf016816242eaa6aee=) 0 0 no-repeat;
	padding-left:40px;
	padding-top:51px;
}
.icon{
	background: url(https://s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=) no-repeat;
	background-size: 332px 194px;
}
.hotTop-icon{
	width: 284px;
	height: 134px;
	background-position: -48px -60px;
}
.hotTop-time{
	margin-top: 24px;
	color: #ecddd9;
	font-size: 24px;/*px*/
}

.hotSong-list{
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
		.red{
			color:#df3436;
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

.hotFoot{
	height:109px;
	line-height:109px;
	text-align:center;
}
.hotView{
	display:inline-block;
	padding-right:26px;
	background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAyMiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEgMWwxMCAxMEwxIDIxIi8+PC9zdmc+) 100% no-repeat;
	background-size: 12px 22px;
	color:#999;
}
</style>