var homeTpl=require('../tpls/home.string');
var util=require('../utils/commonutil');

SPA.defineView('home',{
	html:homeTpl,
	plugins:['delegated',{
		name:'avalon',
		options:function(vm){
			//vm是avalon的实例
			// vm.msg='hello';
			// vm.say=function(){
			// 	alert('hello')
			// }
			vm.arr=['足球生活','足球现场','足球美女'];
			 vm.liveDate=[];
			// vm.originDate=[];
			// vm.moreDate=[];
			// vm.oriDate=[];
		}
	}],
	init:{
		originDate:[],
		mainSwiper:null,
		dataFormat:function(data){
			var arr=[];
			for(var i=0;i<Math.ceil(data.length/2);i++){
				arr[i]=[];
				arr[i].push(data[i*2]);
				data[i*2+1] && arr[i].push(data[i*2+1]);
			}
			return arr;
		}
	},
	bindEvents:{
		beforeShow:function(){
			var _this=this;
			this.vm=this.getVM();
			$.ajax({
				url:'/api/getlive.php',
				type:'get',
				data:{
					action:'origin'
				},
				success:function(result){
					_this.vm.liveDate=_this.dataFormat(result.data);
					//_this.vm.originDate=result.data;
					//console.log(_this.vm.liveDate)
					_this.originDate=result.data;
				}
			})
		},
		show:function(){
			var _this=this;
			var vm=_this.getVM();
			var containerSwiper=new Swiper('#swiper-container',{
				onSlideChangeStart:function(swiper){
			    	//划过之后触发的回调
			    	var $li=$('#title span').eq(swiper.activeIndex)
			    	util.setFocus($li);
			    }
			})
			_this.mainSwiper=new Swiper('#swiper-main',{
				onSlideChangeStart:function(swiper){
					var $li=$('#nav li').eq(swiper.activeIndex);
					util.setFocus($li);
				}
			})
			//$('#main-scroll').data('scroll-id').refresh();
			//实现上拉刷新 和 下拉加载 
			var mainScroll=this.widgets.mainScroll;    //可以获取iscroll的实例
			//console.log(mainScroll)
			var scrollSize = 30;
			// 隐藏下拉刷新
			mainScroll.scrollBy(0,-scrollSize);
			
			// 获取head中的img及head当前的状态
			var headImg = $(".head img");
			var topImgHasClass = headImg.hasClass("up");
			var footImg = $(".foot img");
			var bottomImgHasClass = footImg.hasClass("down");

			// 当滚动的时候
			mainScroll.on("scroll",function(){
			    // 获取当前滚动条的位置
			    var y = this.y;
			    // 计算最大的滚动范围
			    var maxY = this.maxScrollY - y;
			    
			    // 如果是下拉
			    if(y>=0){
			       !topImgHasClass && headImg.addClass("up");
			       return "";
			    }
			    // 如果是上拉
			    if(maxY>=0){
			       !bottomImgHasClass && footImg.addClass("down");
			       return "";
			    }
			})
			
			// 当滚动结束刷新数据时
			mainScroll.on("scrollEnd",function(){
			    if(this.y >= -scrollSize && this.y < 0){
			        mainScroll.scrollTo(0,-scrollSize);
			        headImg.removeClass("up");
			    }else if(this.y>=0){
			        headImg.attr("src","/football/images/ajax-loader.gif");
			        
			        $.ajax({
			        	url:'/api/getlive.php',
			        	type:'get',
			        	data:{
			        		action:'refresh'
			        	},
			        	success:function(result){
			        		setTimeout(function(){
			        			// _this.vm.oriDate=result.data;
				        		// _this.vm.originDate=result.data.concat(_this.vm.originDate)
				        		// _this.vm.liveDate=_this.dataFormat(_this.vm.originDate)
				        		var data=result.data.concat(_this.originDate);
				        		vm.liveDate=_this.dataFormat(data);
				        		mainScroll.scrollTo(0,-scrollSize);
				        		headImg.removeClass('up');
				        		headImg.attr('src','/football/images/arrow.png')
				        		//console.log(_this.vm.liveDate.length)
				        		mainScroll.refresh();

			        		},1000)
			        	}
			        })
			       
			    }
			    // 计算最大的滚动范围
			    var maxY = this.maxScrollY - this.y;
			    var self = this;
			    if(maxY>-scrollSize && maxY<0){
			        mainScroll.scrollTo(0,this.maxScrollY+scrollSize);
			        footImg.removeClass("down");
			    }else if(maxY>=0){
			       footImg.attr("src","/football/images/ajax-loader.gif");
			       $.ajax({
			       		url:'/api/getlive.php',
			       		type:'get',
			       		data:{
			       			action:'more'
			       		},
			       		success:function(result){
			       			setTimeout(function(){
			       				// _this.vm.moreDate=_this.vm.originDate.concat(result.data,_this.vm.oriDate)
				       			// _this.vm.liveDate=_this.dataFormat(_this.vm.moreDate)
				       			var data=_this.originDate.concat(result.data);
				       			vm.liveDate=_this.dataFormat(data);
			     			   	footImg.removeClass("down");
				      			footImg.attr('src','/football/images/arrow.png');
				      			mainScroll.refresh();
			       			},1000)
			       		}
			       })
			    }
			      
			})
		}
	},
	bindActions:{
		'tap.slide':function(e){
			//swiper.划过效果，可以用e.el  来获取当前点击的下标
			//来改变swiper的下标
			var index=$(e.el).index();
			this.mainSwiper.slideTo(index);
		}
	}
})
