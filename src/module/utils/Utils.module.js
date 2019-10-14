import numeral from 'numeral';
import CircularJSON from 'circular-json-es6';
import NP from 'number-precision';
import CryptoJS from 'crypto-js';
let instance = null;
/**
 * 系统工具函数
 */
class Utils {
  constructor() {
    if (instance) {
      return instance;
    }
    this.locale = localStorage.getItem('i18n') || 'zh-Hans-CN';
    NP.enableBoundaryChecking(false);
    this.NP = NP;
    instance = this;
    return instance;
  }
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  types(data) {
    return Object.prototype.toString.call(data);
  }
  extend(data) {
    return CircularJSON.parse(CircularJSON.stringify(data));
  }
  $extend(...arg) {
    let [target, deep, i, clone, src, option, length, copy, isArray] = [];

    target = arg[0] || {};
    i = 1;
    deep = false;
    length = arg.length;

    if (typeof target === 'boolean') {
      deep = target;
      target = arg[i] || {};
      i++;
    }

    for (; i < length; i++) {
      if ((option = arg[i]) !== null) {
        for (let name in option) {
          copy = option[name];

          if (name === '__proto__' || target === copy) {
            continue;
          }

          if (deep && copy !== void 0 && ((isArray = this.types(copy) === '[object Array]') || this.types(copy) === '[object Object]')) {
            src = target[name];
            if (isArray && this.types(src) !== '[object Array]') {
              clone = [];
            } else if (!isArray && this.types(src) !== '[object Object]') {
              clone = {};
            } else {
              clone = src;
            }
            isArray = false;

            target[name] = this.extend(deep, clone, copy);
          } else if (this.types(copy) !== void 0) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }
  formatNumber(value, fixed = 2) {
    return numeral(value).format(`0,${(0).toFixed(fixed)}`);
  }
  // 获取时间戳(精确到秒) 根据服务器时间+时区偏移量
  getTimestamp2s(type, date = 86400) {
    if (type === 'end') {
      return Math.round(new Date(`${new Date().toLocaleDateString()} 23:59:59`) / 1000);
    } else if (type === 'early') {
      return Math.round(new Date(`${new Date().toLocaleDateString()} 23:59:59`) / 1000) + date;
    }
    return Math.round(new Date() / 1000);
  }
  // 获取时间戳(精确到毫秒) 根据服务器时间+时区偏移量
  getTimestamp2ms(type) {
    if (type === 'end') {
      return new Date(`${new Date().toLocaleDateString()} 23:59:59`).getTime();
    }
    return new Date().getTime();
  }
  getTime2s(date) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    return Math.round(new Date(date) / 1000);
  }
  // 获取时区偏移量
  getTimezoneOffset(date) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    return new Date(date).getTime() + new Date().getTimezoneOffset() * 60000; // 0时区毫秒
  }


  getTime2beijing_12hour(date) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    return new Date(date).getTime() - 4 * 60 * 60 * 1000;
  }
  // 获取年月日
  getDateString(date, flag) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    if (flag) {
      return new Date(date).toLocaleDateString();
    }
    return new Date(this.getTime2beijing_12hour(date)).toLocaleDateString();
  }
  // 通过规则获取格式化的日期
  getDateFormat(date, rule) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    return this.dateFormat(this.getTime2beijing_12hour(date), rule);
  }
  // 获取时分
  getTimeString(date, flag) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    try {
      if (flag) {
        return new Date(date)
          .toLocaleTimeString('chinese', { hour12: false })
          .split(':')
          .splice(0, 2)
          .join(':');
      }
      return new Date(this.getTime2beijing_12hour(date))
        .toLocaleTimeString('chinese', { hour12: false })
        .split(':')
        .splice(0, 2)
        .join(':');
    } catch (error) {
      if (flag) {
        return new Date(date)
          .toLocaleTimeString()
          .split(':')
          .splice(0, 2)
          .join(':');
      }
      return new Date(this.getTime2beijing_12hour(date))
        .toLocaleTimeString()
        .split(':')
        .splice(0, 2)
        .join(':');
    }
  }
  // 获取年月日 时分秒
  getDate2timeString(date) {
    if (typeof date === 'string') {
      // 针对低版本safari格式处理
      date = date.replace(/-/g, '/').replace(/T/, ' ');
    }
    try {
      return new Date(date).toLocaleString('chinese', { hour12: false });
    } catch (error) {
      return new Date(date)
        .toLocaleString()
        .toLocaleTimeString()
        .split(':')
        .splice(0, 2)
        .join(':');
    }
  }
  // 足球比赛时间转换
  formatSeconds(value) {
    var secondTime = parseInt(value);
    var minuteTime = 0;
    // var hourTime = 0;
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
    }
    var result = '' + parseInt(secondTime) < 10 ? '0' + parseInt(secondTime) : parseInt(secondTime);

    if (minuteTime > 0) {
      result = `${parseInt(minuteTime) < 10 ? '0' + parseInt(minuteTime) : parseInt(minuteTime)}:${result}`;
    } else {
      result = `00:${result}`;
    }

    return result;
  }
  debounce(fn, wait, options) {
    wait = wait || 0;
    var timerId;

    var debounced = (...arg) => {
      if (timerId) {
        clearTimeout(timerId);

        timerId = null;
      }
      timerId = setTimeout(() => {
        fn(...arg);
      }, wait);
    };
    return debounced;
  }
  throttle(fn, wait) {
    let _lastTime = null;

    return function() {
      let _nowTime = +new Date();
      if (_nowTime - _lastTime > wait || !_lastTime) {
        fn(...arguments);
        _lastTime = _nowTime;
      }
    };
  }
  // 域名后的斜杠处理
  getSplitUrl(url) {
    let res = {};
    if (/http:\/\//.test(url)) {
      res = {
        prefix: 'http://',
        suffix: url.replace(/http:\/\//, '')
      };
    } else if (/https:\/\//.test(url)) {
      res = {
        prefix: 'https://',
        suffix: url.replace(/https:\/\//, '')
      };
    } else if (/ftp:\/\//.test(url)) {
      res = {
        prefix: 'ftp://',
        suffix: url.replace(/ftp:\/\//, '')
      };
    } else {
      res = {
        prefix: '',
        suffix: url
      };
    }
    return res;
  }
  // 日期格式化
  dateFormat(date, format) {
    var dateTime = new Date(date);
    var o = {
      'M+': dateTime.getMonth() + 1, //month
      'd+': dateTime.getDate(), //day
      'h+': dateTime.getHours(), //hour
      'm+': dateTime.getMinutes(), //minute
      's+': dateTime.getSeconds(), //second
      'q+': Math.floor((dateTime.getMonth() + 3) / 3), //quarter
      S: dateTime.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      }
    }
    return format;
  }
  // 判断浏览器系统
  getUserAgent = () => {
    let u = window.navigator.userAgent;
    if (u.indexOf('MicroMessenger') > -1) {
      return 'weixin';
    } else if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
      return 'android';
    } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      return 'ios';
    } else if (u.match(/\sQQ/i) === 'qq') {
      return 'qq';
    } else {
      return '';
    }
  };
  // aes cbc 解密方式
  decrypt(word, keys = 'SoccerAES_201909', ivs) {
    try {
      if (!keys) throw new Error('aes key is required!');
      // if(!ivs) throw new Error('aes iv is required!')
      let key = CryptoJS.enc.Utf8.parse(keys); //十六位十六进制数作为密钥
      let iv = CryptoJS.enc.Utf8.parse(keys); //十六位十六进制数作为密钥偏移量

      let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // 解密时decrypt.toString(CryptoJS.enc.Utf8)这句代码可能会遇到报错 --> Error: Malformed UTF-8 data，如果解密报错直接返回空字符串，防止程序错误
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      // 如果无法解密或者解密失败都返回原始值
      if (decryptedStr.toString() === '') {
        return word;
      }
      return decryptedStr.toString();
    } catch (error) {
      return word;
    }
  }

  // aes cbc 加密方式
  encrypt(word, keys = 'SoccerAES_201909', ivs) {
    if (!keys) throw new Error('aes key is required!');
    // if(!ivs) throw new Error('aes iv is required!')
    let key = CryptoJS.enc.Utf8.parse(keys); //十六位十六进制数作为密钥
    let iv = CryptoJS.enc.Utf8.parse(keys); //十六位十六进制数作为密钥偏移量

    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
  }


  
  // 获取当前天是星期几
  getDayWeek(day) {
    const weekMap = {
      0: {
        'zh-Hans-CN': '星期日',
        'en-US': 'Sun'
      },
      1: {
        'zh-Hans-CN': '星期一',
        'en-US': 'Mon'
      },
      2: {
        'zh-Hans-CN': '星期二',
        'en-US': 'Tues'
      },
      3: {
        'zh-Hans-CN': '星期三',
        'en-US': 'Wed'
      },
      4: {
        'zh-Hans-CN': '星期四',
        'en-US': 'Thur'
      },
      5: {
        'zh-Hans-CN': '星期五',
        'en-US': 'Fri'
      },
      6: {
        'zh-Hans-CN': '星期六',
        'en-US': 'Sat'
      }
    };
    return weekMap[day][this.locale];
  }
  // 获取盘口值
  getHandicapMap(id) {
    const handicapMap = {
      1: {
        'zh-Hans-CN': '欧洲盘',
        'en-US': 'Europe'
      },
      2: {
        'zh-Hans-CN': '香港盘',
        'en-US': 'Hong Kong'
      },
      3: {
        'zh-Hans-CN': '马来盘',
        'en-US': 'Malay'
      },
      4: {
        'zh-Hans-CN': '印尼盘',
        'en-US': 'Indonesia'
      }
    };
    
    const handicapArrat = {
      'zh-Hans-CN': ['欧洲盘', '香港盘', '马来盘', '印尼盘', '取消'],
      'en-US': ['Europe', 'Hong Kong', 'Malay', 'Indonesia', 'Cancel']
    };

    if (!id) {
      return handicapArrat[this.locale];
    }
    return handicapMap[id][this.locale];
  }





/**
 * 千分位格式化  ----- linlin
 * @param {String} str 
 */
thousandBitForma(str) {
  return (str || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

/**
 *  返回转换后带小数位的值 ----- linlin
 * @param {*} num // 需要转换的数字
 * @param {*} float // 转换小数位 如：100为2位小数，1000为3位小数 
 */
decimalForma(num, float = '我就不传,咋滴!') {
  let f = float = '我就不传,咋滴!' ? 1 : float;
  let total = 0, // 预定义返回变量
      n = Math.floor(parseInt(num * f)) // 数值 * 转换的小数位
  let zs = (Math.floor(n * f) / f).toString(); // 整数部分
  let xs = zs.substring(zs.length - ((f.toString()).length - 1), zs.length) // 小数部分
      zs =  parseInt(zs / f)
      total =  f = '我就不传,咋滴!' ? this.thousandBitForma(zs) : this.thousandBitForma(zs) + '.' + this.thousandBitForma(xs)  // 返回保留两位小数的值
  return total // 返回转换后带小数位的值
}

/**
 * 获取星期几 ----- linlin
 * @param {*} date  例：let w1 = getMyDayWeek(new Date("2015-7-12")); ----- linlin
 */
getMyDayWeek(date) {
  let week;
  let d = new Date(date); 
      if(d.getDay()==0) week="星期日"
      if(d.getDay()==1) week="星期一"
      if(d.getDay()==2) week="星期二"
      if(d.getDay()==3) week="星期三"
      if(d.getDay()==4) week="星期四"
      if(d.getDay()==5) week="星期五"
      if(d.getDay()==6) week="星期六"
  return week;
}

/**
 * 获取n天以后的日期 例：2019-9-26 ----- linlin
 * @param {Number} n 第n天
 * @param {Date} data
 */
fun_date(n, data) {
  let d = data
  if(!d) {
    d = new Date()
  }
  let date1 = d,
      time1 = date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
  let date2 = new Date(date1);
      date2.setDate(date1.getDate() + n);       
  let time2 = date2.getFullYear()+"-"+ (date2.getMonth()+1)+"-"+date2.getDate();
  return time2
}

/**
 * 格式化时间 返回 例：2019-09-26 ----- linlin
 * @param {Date} d
 */
format_date(d) { // 格式化时间
  let year = d.getFullYear(),
      month = (d.getMonth()+1) < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1),
      day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  let time = year + "-" + month +"-" + day;//time表示当前时间
  return time
}

/**
 * 获取时区偏移量 + 日期补0 + 时区转换 返回 例：2019-09-26 ----- linlin
 * @param {Date | String} date // 转换前时间
 */
getTimezoneOffset4Hour(date, hour) {
  if (typeof date === 'string') {
    // 针对低版本safari格式处理
    date = date.replace(/-/g, '/').replace(/T/, ' ');
  }
  let h = hour * 60 * 60 * 1000
  let d = new Date(date).getTime() + (date.getTimezoneOffset() * 60000 + h), // 0时区毫秒
      dd = new Date(d).toLocaleDateString().replace(/\//g, '-'),
      ddd = dd.split('-')
      if(ddd[1].length < 2) {
        ddd[1] = '0' + ddd[1]
      }
  let str = ddd.join('-');
  return str; 
}

/**
 *  获取开始结束时间 ----- linlin
 * @param {Number} startOffsetHour 偏移0时区小时
 */
pramrDate(startOffsetHour, endOffsetHour) {
  let sHour = startOffsetHour,
      eHour = endOffsetHour
  if(!eHour) eHour = startOffsetHour
  let st = this.getTimezoneOffset4Hour(new Date(), sHour) + ' 00:00:00', // 开始时间
      et = this.getTimezoneOffset4Hour(new Date(), eHour) + ' 23:59:59', // 结束时间
      strTime = Date.parse(st.replace(/-/g, '/')) / 1000, // 开始时间
      endTime = Date.parse(et.replace(/-/g, '/')) / 1000 // 结束时间
  let time = {
        st: strTime, // 开始时间
        et: endTime // 结束时间
      }
  return time
}

}

Utils.of = function() {
  if (instance) {
    return instance;
  }
  return new Utils();
};

export default Utils;
