import en from './en';
import vn from './vn';

import _ from 'lodash';

const all = _.extend({}, {
	en,
	vn
});

let lang = localStorage.getItem('lang') || 'en';
export default {
	setLang(str){
		if(_.includes(['en', 'vn'], str)){
			lang = str;
		}
		else{
			throw new Error('invalid lang : '+str);
		}
	},
	getLang(){
		return lang;
	},

	get(key){
		return _.get(all[lang], key, _.get(all['en'], key, key));
	}
};
