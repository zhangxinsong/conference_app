import ajax from './ajax';
import md5  from './md5' ;
import time from './format-time';
import friendlyTime from './friendly-time';
import htmlDecode   from './html-decode';
import filterEmoji  from './filter-emoji';
import iscroll from './iscroll-listen';
import swiper  from './swiper/swiper';
// import echarts from './echarts.min.js';
import './swiper/swiper.css';
import filterFace from './filter-face';


export default {
	ajax,
	md5,
	time,
	friendlyTime,
	htmlDecode,
	filterEmoji,
	iscroll,
	swiper,
	// echarts,
	filterFace ,
	clone:( data )=>{
		return JSON.parse( JSON.stringify(data) )
	},
	type:( x )=>{
		var str = Object.prototype.toString.call( x );
		return str.match(/\s(.*)\]/[1]);
	},
	trigger:( eName , dom )=>{
		try{
			var event = document.createEvent('Event');
				event.initEvent( eName , true, true);
				dom.dispatchEvent(event);
		}catch(e){ console.log(e) };
	},
	// encodeURIComponent 不编码的字符  !， '，(，)，*，-，.，_，~，0-9，a-z，A-Z
	getLocationParams:()=>{
		let url = location.href ;
		let obj = {} ;
		let arr = url.match(/\w+=[%\w]+/g);
			arr.map( v=>{
				let val = v.match(/(\w+)=([%\w]+)/) ;
				obj[val[1]]=val[2];
			})
		return obj ;
	}
}