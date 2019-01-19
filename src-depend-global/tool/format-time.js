function fun (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
    var o = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }
    var week = {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d'
    }
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }

    // fmt=fmt.replace(/年/g,LAN.Y);
    // fmt=fmt.replace(/月/g,LAN.M);
    // fmt=fmt.replace(/日/g,LAN.D);

    return fmt
}

// 调用 tool.time() ; 返回当前时间 ;
export default function ( date , fmt='YYYY-MM-DD HH:mm:ss' ){
    // 默认当前时间 ;
    if(typeof date === 'object'){
        // 对象转换日期
        return fun( date , fmt );
    }else if(typeof date === 'number'){
        // 时间戳转日期
        return fun( new Date(date) , fmt );
    }else if(typeof date === 'string'){
        // 字符串转时间戳
        date = date.replace(/-/g,'/'); 
        return Date.parse( new Date(date) );
    }else if( !date ){
        // 什么都不传返回当前时间戳 ;
        return Date.parse(new Date())
    }   
}
