(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{10:function(t,n,e){"use strict";var r=function(){var t=this.$createElement;return(this._self._c||t)("div",[this._v("\n    "+this._s(this.$route.params.id)+"\n")])},u=[];r._withStripped=!0,e.d(n,"a",function(){return r}),e.d(n,"b",function(){return u})},14:function(t,n,e){"use strict";e.r(n);var r=e(10),u=e(4);for(var i in u)"default"!==i&&function(t){e.d(n,t,function(){return u[t]})}(i);var a=e(0),s=Object(a.a)(u.default,r.a,r.b,!1,null,null,null);s.options.__file="views/article.vue",n.default=s.exports},4:function(t,n,e){"use strict";e.r(n);var r=e(5),u=e.n(r);for(var i in r)"default"!==i&&function(t){e.d(n,t,function(){return r[t]})}(i);n.default=u.a},5:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={data:function(){return{blog:[]}},mounted:function(){var t=this,n=new XMLHttpRequest;n.onreadystatechange=function(){if(4==n.readystate){var e=n.status;if(e>=200&&e<300||304==e){var r=JSON.parse(n.responseText);t.data=r}}},n.open("GET","/article_info/"+t.$route.params.id,!0),n.send(null)}}}}]);