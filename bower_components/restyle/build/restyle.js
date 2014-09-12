/*! (C) Andrea Giammarchi Mit Style License */
var restyle=function(e){"use strict";function f(e,t,n,r,i){this.component=e,this.node=t,this.css=n,this.prefixes=r,this.doc=i}function l(e,t,n){return t+"-"+n.toLowerCase()}function c(e,t,n){var i=[],s=typeof t=="number"?"px":"",o=e.replace(r,l),u;for(u=0;u<n.length;u++)i.push("-",n[u],"-",o,":",t,s,";");return i.push(o,":",t,s,";"),i.join("")}function h(e,t){return e.length?e+"-"+t:t}function p(e,t,r,i){var s,u,a;for(s in r)if(n.call(r,s))if(typeof r[s]=="object")if(o(r[s])){u=r[s];for(a=0;a<u.length;a++)e.push(c(h(t,s),u[a],i))}else p(e,h(t,s),r[s],i);else e.push(c(h(t,s),r[s],i));return e.join("")}function d(e,t,r){var o=[],a,f,l,c,h,v,m,g,y,b;for(m in t)if(n.call(t,m)){a=m.charAt(0)==="@",v=a||!e.indexOf(m+" "),f=a&&s.test(m)?e:"",l=a&&!i.test(m),c=l?m.slice(1):m,g=u.concat(t[m]);for(y=0;y<g.length;y++){h=g[y];if(l){b=r.length;while(b--)o.push("@-",r[b],"-",c,"{",d(f,h,[r[b]]),"}");o.push(m,"{",d(f,h,r),"}")}else o.push(v?m:e+m,"{",p([],"",h,r),"}")}}return o.join("")}var t=e.toString,n=e.hasOwnProperty,r=/([a-z])([A-Z])/g,i=/^@(?:page|font-face)/,s=/^@(?:media)/,o=Array.isArray||function(e){return t.call(e)==="[object Array]"},u=[],a;return f.prototype={replace:function(e){e instanceof f||(e=a(this.component,e,this.prefixes,this.doc)),this.remove(),f.call(this,e.component,e.node,e.css,e.prefixes,e.doc)},remove:function(){var e=this.node,t=e.parentNode;t&&t.removeChild(e)},valueOf:function(){return this.css}},{"undefined":!0}[typeof document]?(a=function(e,t,n){return typeof e=="object"?(n=t,t=e,e=""):e+=" ",d(e,t,n||u)},a.restyle=a):a=function(e,t,n,r){typeof e=="object"?(r=n,n=t,t=e,i=e=""):i=e+" ";var i,s=r||(r=document),o=d(i,t,n||(n=a.prefixes)),u=s.head||s.getElementsByTagName("head")[0]||s.documentElement,l=u.insertBefore(s.createElement("style"),u.lastChild);return l.type="text/css",l.styleSheet?l.styleSheet.cssText=o:l.appendChild(s.createTextNode(o)),new f(e,l,o,n,r)},a.customElement=function(e,t,n){var r,i=Object.create(t.prototype);n&&n.css&&(n.css=a(e,n.css));for(r in n)i[r]=n[r];return document.registerElement(e,{prototype:i})},a.prefixes=["webkit","moz","ms","o"],a}({});