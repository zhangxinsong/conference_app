import { MessageBox, Toast} from 'mint-ui';
import Loading from './global.loading';

// mint-ui
export default {
	MessageBox:MessageBox,
	alert: MessageBox.alert ,
	confirm:(str='',yes,no)=>{
		MessageBox({
			message: str,
			showCancelButton: true,
			// showConfirmButton: true,
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		}).then(action=>{
			action=='confirm' ? (yes&&yes()) : (no&&no()) ;
		})
	},
	success:( str='操作成功' , time=1000 )=>{
		Loading.hideAll();
		Toast({
			message: str ,
			duration: time ,
			iconClass: 'icon-checkmark'
		})	
	},
	say:( str='' , time=1200 , )=>{
		Loading.hideAll();
		Toast({
			message: str ,
			duration: time ,
		})		
	},
	loading:Loading,
}

