/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device',"sap/ui/performance/trace/Passport","sap/base/Log"],function(D,P,L){"use strict";var E=(function(){var t=/sap-ui-xx-e2e-trace-level=(low|medium|high)/.exec(location.search);var d;if(t&&t.length>=2){d=t[1];}else{d="medium";}var s="/sap/bc/sdf/E2E_Trace_upl";var b;var a=false;var M=function(x){this.idx=x.xidx;this.dsrGuid=x.xDsrGuid;this.method=x.xmethod;this.url=x.xurl;this.reqHeader=x.xRequestHeaders;this.respHeader=x.getAllResponseHeaders();this.statusCode=x.status;this.status=x.statusText;this.startTimestamp=x.xstartTimestamp;this.firstByteSent=x.xfirstByteSent?x.xfirstByteSent:x.xstartTimestamp;this.lastByteSent=this.firstByteSent;this.firstByteReceived=x.xfirstByteReceived?x.xfirstByteReceived:x.xlastByteReceived;this.lastByteReceived=x.xlastByteReceived;this.sentBytes=0;this.receivedBytes=x.responseText.length;this.getDuration=function(){return this.lastByteReceived-this.startTimestamp;};this.getRequestLine=function(){return this.method+" "+this.url+" HTTP/?.?";};this.getRequestHeader=function(){var r=this.getRequestLine()+"\r\n";for(var i=0,l=this.reqHeader?this.reqHeader.length:0;i<l;i+=1){r+=this.reqHeader[i][0]+": "+this.reqHeader[i][1]+"\r\n";}r+="\r\n";return r;};this.getResponseHeader=function(){var r="HTTP?/? "+this.statusCode+" "+this.status+"\r\n";r+=this.respHeader;r+="\r\n";return r;};};var T=function(b,f,g,h){this.busTrx=b;this.trxStepIdx=f;this.name="Step-"+(f+1);this.date=g;this.trcLvl=h;this.messages=[];this.msgIdx=-1;this.pendingMessages=0;this.transactionStepTimeoutId=null;this.messageStarted=function(){this.msgIdx+=1;this.pendingMessages+=1;return this.msgIdx;};this.onMessageFinished=function(x,i){if(x.xurl===s){return;}L.info(i+", "+this.xidx+": MessageFinished");x.xlastByteReceived=i;this.messages.push(new M(x));this.pendingMessages-=1;if(this.pendingMessages===0){if(this.transactionStepTimeoutId){clearTimeout(this.transactionStepTimeoutId);}this.transactionStepTimeoutId=setTimeout(o,3000);}};this.getId=function(){return this.busTrx.id+"-"+this.trxStepIdx;};this.getTraceFlagsAsString=function(){return this.trcLvl[1].toString(16)+this.trcLvl[0].toString(16);};};var B=function(i,f,g,C){this.id=i;this.date=f;this.trcLvl=g;this.trxSteps=[];this.fnCallback=C;this.createTransactionStep=function(){var h=new T(this,this.trxSteps.length,new Date(),this.trcLvl);this.trxSteps.push(h);};this.getCurrentTransactionStep=function(){return this.trxSteps[this.trxSteps.length-1];};this.getBusinessTransactionXml=function(){var x="<?xml version=\"1.0\" encoding=\"UTF-8\"?><BusinessTransaction id=\""+this.id+"\" time=\""+c(this.date)+"\" name=\""+(window.document.title||"SAPUI5 Business Transaction")+"\">";for(var h=0,n=this.trxSteps.length;h<n;h+=1){var j=this.trxSteps[h];x+="<TransactionStep id=\""+j.getId()+"\" time=\""+c(j.date)+"\" name=\""+j.name+"\" traceflags=\""+j.getTraceFlagsAsString()+"\">";var m=j.messages;for(var k=0,l=m.length;k<l;k+=1){var p=m[k];x+="<Message id=\""+p.idx+"\" dsrGuid=\""+p.dsrGuid+"\">";x+="<x-timestamp>"+c(new Date(p.startTimestamp))+"</x-timestamp>";x+="<duration>"+Math.ceil(p.getDuration())+"</duration>";x+="<returnCode>"+p.statusCode+"</returnCode>";x+="<sent>"+p.sentBytes+"</sent>";x+="<rcvd>"+p.receivedBytes+"</rcvd>";if(p.firstByteSent&&p.lastByteReceived){x+="<firstByteSent>"+c(new Date(p.firstByteSent))+"</firstByteSent>";x+="<lastByteSent>"+c(new Date(p.lastByteSent))+"</lastByteSent>";x+="<firstByteReceived>"+c(new Date(p.firstByteReceived))+"</firstByteReceived>";x+="<lastByteReceived>"+c(new Date(p.lastByteReceived))+"</lastByteReceived>";}x+="<requestLine><![CDATA["+p.getRequestLine()+"]]></requestLine>";x+="<requestHeader><![CDATA["+p.getRequestHeader()+"]]></requestHeader>";x+="<responseHeader><![CDATA["+p.getResponseHeader()+"]]></responseHeader>";x+="</Message>";}x+="</TransactionStep>";}x+="</BusinessTransaction>";return x;};};var o=function(){if(b.getCurrentTransactionStep().pendingMessages===0&&b.getCurrentTransactionStep().messages.length>0){var r=confirm("End of transaction step detected.\nNumber of new message(s): "+b.getCurrentTransactionStep().messages.length+"\n\nDo you like to record another transaction step?");if(r){b.createTransactionStep();}else{var f=b.getBusinessTransactionXml();if(b.fnCallback&&typeof(b.fnCallback)==='function'){b.fnCallback(f);}var g="----------ieoau._._+2_8_GoodLuck8.3-ds0d0J0S0Kl234324jfLdsjfdAuaoei-----";var p=g+"\r\nContent-Disposition: form-data\r\nContent-Type: application/xml\r\n"+f+"\r\n"+g;var x=new window.XMLHttpRequest();x.open("HEAD",s,false);x.send();if(x.status==200){var h=new window.XMLHttpRequest();h.open("POST",s,false);h.setRequestHeader('Content-type','multipart/form-data; boundary="'+g+'"');h.send(p);alert(h.responseText);}else{try{var i=true;while(i){var u=window.prompt('Please enter a valid URL for the store server','http://<host>:<port>');if(u===''||u===null){break;}var j=new RegExp("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})");var R=j.test(u);if(R){var h=new window.XMLHttpRequest();h.open("POST",u+'/E2EClientTraceUploadW/UploadForm.jsp',false);h.setRequestHeader('Content-type','multipart/form-data; boundary="'+g+'"');h.send(p);break;}}}catch(k){L.error(k.name+": "+k.message,"","sap.ui.core.support.trace.E2eTraceLib");}}b=null;a=false;}}};var c=function(f){var u="";u+=f.getUTCDate()<10?"0"+f.getUTCDate():f.getUTCDate();u+="."+(f.getUTCMonth()<9?"0"+(f.getUTCMonth()+1):f.getUTCMonth()+1);u+="."+f.getUTCFullYear();u+=" "+(f.getUTCHours()<10?"0"+f.getUTCHours():f.getUTCHours());u+=":"+(f.getUTCMinutes()<10?"0"+f.getUTCMinutes():f.getUTCMinutes());u+=":"+(f.getUTCSeconds()<10?"0"+f.getUTCSeconds():f.getUTCSeconds());u+="."+(f.getUTCMilliseconds()<100?f.getUTCMilliseconds()<10?"00"+f.getUTCMilliseconds():"0"+f.getUTCMilliseconds():f.getUTCMilliseconds());u+=" UTC";return u;};(function(){var f,g;var h=function(n){L.info(n,"","E2ETraceLibIE");return n;};if(window.performance&&performance.timing&&performance.timing.navigationStart){if(D.browser.chrome&&D.browser.version>=49){h=function(n){L.info(n,"","E2ETraceLibCR");return performance.timing.navigationStart+n;};}else if(D.browser.firefox&&D.browser.version>=48){h=function(n){L.info(n,"","E2ETraceLibFF");return performance.timing.navigationStart+n;};}}function i(n){L.info(h(n.timeStamp)+", "+this.xidx+": loadstart");this.xfirstByteSent=h(n.timeStamp);}function j(n){L.info(h(n.timeStamp)+", "+this.xidx+": progress");if(n.loaded>0){if(!this.xfirstByteReceived){this.xfirstByteReceived=h(n.timeStamp);}this.xlastByteReceived=h(n.timeStamp);}}function k(n){var p=h(n.timeStamp);L.info(p+", "+this.xidx+": error");b.getCurrentTransactionStep().onMessageFinished(this,p);}function l(n){var p=h(n.timeStamp);L.info(p+", "+this.xidx+": abort");b.getCurrentTransactionStep().onMessageFinished(this,p);}function m(n){var p=h(n.timeStamp);L.info(p+", "+this.xidx+": load");b.getCurrentTransactionStep().onMessageFinished(this,p);}P.setActive(true);f=window.XMLHttpRequest.prototype.open;g=window.XMLHttpRequest.prototype.setRequestHeader;window.XMLHttpRequest.prototype.setRequestHeader=function(){g.apply(this,arguments);if(a){if(!this.xRequestHeaders){this.xRequestHeaders=[];}this.xRequestHeaders.push(arguments);}};window.XMLHttpRequest.prototype.open=function(){f.apply(this,arguments);if(a){var n=b.getCurrentTransactionStep().messageStarted();this.xidx=n;if(window.performance&&performance.timing.navigationStart&&performance.now!==undefined){this.xstartTimestamp=performance.timing.navigationStart+performance.now();}else{this.xstartTimestamp=Date.now();}this.xmethod=arguments[0];this.xurl=arguments[1];this.xDsrGuid=P.getTransactionId();this.setRequestHeader("X-CorrelationID",b.getCurrentTransactionStep().getId()+"-"+n);this.addEventListener("loadstart",i,false);this.addEventListener("progress",j,false);this.addEventListener("error",k,false);this.addEventListener("abort",l,false);this.addEventListener("load",m,false);n+=1;}};})();var e={start:function(f,C){if(!a){if(!f){f=d;}b=new B(P.getRootId(),new Date(),P.traceFlags(f),C);b.createTransactionStep();a=true;}},isStarted:function(){return a;}};if(/sap-ui-xx-e2e-trace=(true|x|X)/.test(location.search)){e.start();}return e;}());return E;},true);
