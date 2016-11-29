var guideTpl=require('../tpls/guide.string');

SPA.defineView('guide',{
	html:guideTpl,
	plugins:['delegated'],
	bindEvents:{
		show:function(){
			var mySwiper=new Swiper('#swiper-container');
		}
	},
	bindActions:{
		'go.index':function(){
			SPA.open('index');
		}
	}
})