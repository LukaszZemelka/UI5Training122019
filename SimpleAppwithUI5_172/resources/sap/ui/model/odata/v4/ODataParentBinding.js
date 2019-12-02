/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataBinding","./SubmitMode","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/ChangeReason","sap/ui/thirdparty/jquery"],function(a,S,_,L,b,C,q){"use strict";function O(){a.call(this);this.mAggregatedQueryOptions={};this.bAggregatedQueryOptionsInitial=true;this.aChildCanUseCachePromises=[];this.iPatchCounter=0;this.bPatchSuccess=true;this.oReadGroupLock=undefined;this.oRefreshPromise=null;this.oResumePromise=undefined;}a(O.prototype);var c="sap.ui.model.odata.v4.ODataParentBinding";O.prototype.attachPatchCompleted=function(f,l){this.attachEvent("patchCompleted",f,l);};O.prototype.detachPatchCompleted=function(f,l){this.detachEvent("patchCompleted",f,l);};O.prototype.firePatchCompleted=function(s){if(this.iPatchCounter===0){throw new Error("Completed more PATCH requests than sent");}this.iPatchCounter-=1;this.bPatchSuccess=this.bPatchSuccess&&s;if(this.iPatchCounter===0){this.fireEvent("patchCompleted",{success:this.bPatchSuccess});this.bPatchSuccess=true;}};O.prototype.attachPatchSent=function(f,l){this.attachEvent("patchSent",f,l);};O.prototype.detachPatchSent=function(f,l){this.detachEvent("patchSent",f,l);};O.prototype.firePatchSent=function(){this.iPatchCounter+=1;if(this.iPatchCounter===1){this.fireEvent("patchSent");}};O.prototype._findEmptyPathParentContext=function(o){if(this.sPath===""&&this.oContext.getBinding){return this.oContext.getBinding()._findEmptyPathParentContext(this.oContext);}return o;};O.prototype.aggregateQueryOptions=function(Q,e){var A=q.extend(true,{},this.mAggregatedQueryOptions);function m(f,Q,i){var E,s;function g(j){if(f.$expand[j]){return m(f.$expand[j],Q.$expand[j],true);}if(e){return false;}f.$expand[j]=E[j];return true;}function h(j){if(f.$select.indexOf(j)<0){if(e){return!i;}f.$select.push(j);}return true;}E=Q.$expand;if(E){f.$expand=f.$expand||{};if(!Object.keys(E).every(g)){return false;}}s=Q.$select;if(s){f.$select=f.$select||[];if(!s.every(h)){return false;}}if(Q.$count){f.$count=true;}return Object.keys(Q).concat(Object.keys(f)).every(function(n){if(n==="$count"||n==="$expand"||n==="$select"||!i&&!(n in Q)){return true;}return Q[n]===f[n];});}if(m(A,Q)){this.mAggregatedQueryOptions=A;return true;}return false;};O.prototype.changeParameters=function(p){var B=q.extend(true,{},this.mParameters),s,k,t=this;function e(n){if(t.oModel.bAutoExpandSelect&&n in p){throw new Error("Cannot change $expand or $select parameter in "+"auto-$expand/$select mode: "+n+"="+JSON.stringify(p[n]));}}function u(n){if(n==="$filter"||n==="$search"){s=C.Filter;}else if(n==="$orderby"&&s!==C.Filter){s=C.Sort;}else if(!s){s=C.Change;}}if(!p){throw new Error("Missing map of binding parameters");}e("$expand");e("$select");if(this.hasPendingChanges()){throw new Error("Cannot change parameters due to pending changes");}for(k in p){if(k.indexOf("$$")===0){throw new Error("Unsupported parameter: "+k);}if(p[k]===undefined&&B[k]!==undefined){u(k);delete B[k];}else if(B[k]!==p[k]){u(k);if(typeof p[k]==="object"){B[k]=q.extend(true,{},p[k]);}else{B[k]=p[k];}}}if(s){this.createReadGroupLock(this.getGroupId(),true);this.applyParameters(B,s);}};O.prototype.checkUpdateInternal=function(f){var t=this;function u(){return b.all(t.getDependentBindings().map(function(D){return D.checkUpdateInternal();}));}if(f!==undefined){throw new Error("Unsupported operation: "+c+"#checkUpdateInternal must not"+" be called with parameters");}return this.oCachePromise.then(function(o){if(o&&t.bRelative){return t.fetchResourcePath(t.oContext).then(function(r){if(o.$resourcePath===r){return u();}return t.refreshInternal("");});}return u();});};O.prototype.createInCache=function(u,v,p,t,i,f,e,s){var g=this;return this.oCachePromise.then(function(o){if(o){return o.create(u,v,p,t,i,f,e,s).then(function(h){if(o.$resourcePath){delete g.mCacheByResourcePath[o.$resourcePath];}return h;});}return g.oContext.getBinding().createInCache(u,v,_.buildPath(g.oContext.iIndex,g.sPath,p),t,i,f,e,s);});};O.prototype.createReadGroupLock=function(g,l,i){var G,t=this;function e(){sap.ui.getCore().addPrerenderingTask(function(){i-=1;if(i>0){Promise.resolve().then(e);}else if(t.oReadGroupLock===G){L.debug("Timeout: unlocked "+G,null,c);t.removeReadGroupLock();}});}this.removeReadGroupLock();this.oReadGroupLock=G=this.lockGroup(g,l);if(l){i=2+(i||0);e();}};O.prototype.createRefreshPromise=function(){var p,r;p=new Promise(function(e){r=e;});p.$resolve=r;this.oRefreshPromise=p;return p;};O.prototype.deleteFromCache=function(g,e,p,E,f){var G;if(this.oCache===undefined){throw new Error("DELETE request not allowed");}if(this.oCache){G=g.getGroupId();if(!this.oModel.isAutoGroup(G)&&!this.oModel.isDirectGroup(G)){throw new Error("Illegal update group ID: "+G);}return this.oCache._delete(g,e,p,E,f);}return this.oContext.getBinding().deleteFromCache(g,e,_.buildPath(this.oContext.iIndex,this.sPath,p),E,f);};O.prototype.destroy=function(){this.aChildCanUseCachePromises=[];this.removeReadGroupLock();this.oResumePromise=undefined;a.prototype.destroy.apply(this);};O.prototype.fetchIfChildCanUseCache=function(o,s,e){var B=this.getBaseForPathReduction(),f,g,h,F,i=s[0]==="#",m=this.oModel.getMetaModel(),p,r=this.oModel.resolve(s,o),R=this.oModel.resolve(this.sPath,this.oContext),D=R.indexOf("(...)")>=0,t=this;function j(){if(i){return m.fetchObject(F.slice(0,F.lastIndexOf("/")+1));}return m.fetchObject(F).then(function(P){if(P&&P.$kind==="NavigationProperty"){return m.fetchObject(F+"/").then(function(){return P;});}return P;});}if(D||this.getRootBinding().isSuspended()){return b.resolve(r);}g=this.oCachePromise.isRejected()||this.oCachePromise.isFulfilled()&&(!this.oCache||this.oCache.bSentReadRequest);f=m.getMetaPath(o.getPath());F=m.getMetaPath(r);p=[this.doFetchQueryOptions(this.oContext),j(),e];h=b.all(p).then(function(k){var l,n=k[2],w,u=k[0],P=k[1],v=m.getReducedPath(r,B);if(s==="$count"||s.slice(-7)==="/$count"||s[0]==="@"){return b.resolve(v);}if(_.getRelativePath(v,R)===undefined){return t.oContext.getBinding().fetchIfChildCanUseCache(t.oContext,_.getRelativePath(r,t.oContext.getPath()),e);}l=_.getRelativePath(_.getMetaPath(v),f);if(t.bAggregatedQueryOptionsInitial){t.selectKeyProperties(u,f);t.mAggregatedQueryOptions=q.extend(true,{},u);t.bAggregatedQueryOptionsInitial=false;}if(i){w={"$select":[l.slice(1)]};return t.aggregateQueryOptions(w,g)?v:undefined;}if(l===""||P&&(P.$kind==="Property"||P.$kind==="NavigationProperty")){w=_.wrapChildQueryOptions(f,l,n,t.oModel.oRequestor.getModelInterface().fetchMetadata);if(w){return t.aggregateQueryOptions(w,g)?v:undefined;}return undefined;}if(l==="value"){return t.aggregateQueryOptions(n,g)?v:undefined;}L.error("Failed to enhance query options for auto-$expand/$select as the path '"+F+"' does not point to a property",JSON.stringify(P),c);return undefined;});this.aChildCanUseCachePromises.push(h);this.oCachePromise=b.all([this.oCachePromise,h]).then(function(k){var l=k[0];if(l&&!l.bSentReadRequest){l.setQueryOptions(q.extend(true,{},t.oModel.mUriParameters,t.mAggregatedQueryOptions));}return l;});this.oCachePromise.catch(function(E){t.oModel.reportError(t+": Failed to enhance query options for "+"auto-$expand/$select for child "+s,c,E);});return h;};O.prototype.getBaseForPathReduction=function(){var p,P;if(!this.isRoot()){p=this.oContext.getBinding();P=p.getUpdateGroupId();if(P===this.getUpdateGroupId()||this.oModel.getGroupProperty(P,"submit")!==S.API){return p.getBaseForPathReduction();}}return this.oModel.resolve(this.sPath,this.oContext);};O.prototype.getQueryOptionsForPath=function(p,o){if(Object.keys(this.mParameters).length){return _.getQueryOptionsForPath(this.mQueryOptions,p);}o=o||this.oContext;if(!this.bRelative||!o.getQueryOptionsForPath){return{};}return o.getQueryOptionsForPath(_.buildPath(this.sPath,p));};O.prototype.getResumePromise=function(){return this.oResumePromise;};O.prototype.hasPendingChangesInDependents=function(){var D=this.getDependentBindings();return D.some(function(o){var e=o.oCache,h;if(e!==undefined){if(e&&e.hasPendingChangesForPath("")){return true;}}else if(o.hasPendingChangesForPath("")){return true;}if(o.mCacheByResourcePath){h=Object.keys(o.mCacheByResourcePath).some(function(p){return o.mCacheByResourcePath[p].hasPendingChangesForPath("");});if(h){return true;}}return o.hasPendingChangesInDependents();})||this.oModel.withUnresolvedBindings("hasPendingChangesInCaches",this.oModel.resolve(this.sPath,this.oContext).slice(1));};O.prototype.isPatchWithoutSideEffects=function(){return this.mParameters.$$patchWithoutSideEffects||!this.isRoot()&&this.oContext&&this.oContext.getBinding().isPatchWithoutSideEffects();};O.prototype.isMeta=function(){return false;};O.prototype.refreshDependentBindings=function(r,g,e,k){return b.all(this.getDependentBindings().map(function(D){return D.refreshInternal(r,g,e,k);}));};O.prototype.removeReadGroupLock=function(){if(this.oReadGroupLock){this.oReadGroupLock.unlock(true);this.oReadGroupLock=undefined;}};O.prototype.refreshSuspended=function(g){if(g&&g!==this.getGroupId()){throw new Error(this+": Cannot refresh a suspended binding with group ID '"+g+"' (own group ID is '"+this.getGroupId()+"')");}this.setResumeChangeReason(C.Refresh);};O.prototype.resetChangesInDependents=function(p){this.getDependentBindings().forEach(function(D){p.push(D.oCachePromise.then(function(o){if(o){o.resetChangesForPath("");}D.resetInvalidDataState();}).unwrap());if(D.mCacheByResourcePath){Object.keys(D.mCacheByResourcePath).forEach(function(P){D.mCacheByResourcePath[P].resetChangesForPath("");});}D.resetChangesInDependents(p);});};O.prototype.resolveRefreshPromise=function(r){if(this.oRefreshPromise){this.oRefreshPromise.$resolve(r);this.oRefreshPromise=null;}return r;};O.prototype.resume=function(){var t=this;if(this.oOperation){throw new Error("Cannot resume an operation binding: "+this);}if(this.bRelative&&(!this.oContext||this.oContext.fetchValue)){throw new Error("Cannot resume a relative binding: "+this);}if(!this.bSuspended){throw new Error("Cannot resume a not suspended binding: "+this);}this.createReadGroupLock(this.getGroupId(),true,1);sap.ui.getCore().addPrerenderingTask(function(){t.bSuspended=false;if(t.oResumePromise){t.resumeInternal(true);t.oResumePromise.$resolve();t.oResumePromise=undefined;}});};O.prototype.selectKeyProperties=function(Q,m){_.selectKeyProperties(Q,this.oModel.getMetaModel().getObject(m+"/"));};O.prototype.suspend=function(){var r;if(this.oOperation){throw new Error("Cannot suspend an operation binding: "+this);}if(this.bRelative&&(!this.oContext||this.oContext.fetchValue)){throw new Error("Cannot suspend a relative binding: "+this);}if(this.bSuspended){throw new Error("Cannot suspend a suspended binding: "+this);}if(this.hasPendingChanges()){throw new Error("Cannot suspend a binding with pending changes: "+this);}this.bSuspended=true;this.oResumePromise=new b(function(e,f){r=e;});this.oResumePromise.$resolve=r;this.removeReadGroupLock();};O.prototype.updateAggregatedQueryOptions=function(n){var A=Object.keys(n),t=this;if(this.mAggregatedQueryOptions){A=A.concat(Object.keys(this.mAggregatedQueryOptions));A.forEach(function(N){if(N==="$select"||N==="$expand"){return;}if(n[N]===undefined){delete t.mAggregatedQueryOptions[N];}else{t.mAggregatedQueryOptions[N]=n[N];}});}};O.prototype.visitSideEffects=function(g,p,o,n,P,s){var D=o?this.oModel.getDependentBindings(o):this.getDependentBindings();D.forEach(function(e){var f=_.buildPath(s,_.getMetaPath(e.getPath())),h;if(e.oCache){h=_.stripPathPrefix(f,p);if(h.length){P.push(e.requestSideEffects(g,h));}}else if(n[f]){P.push(e.refreshInternal("",g));}else{e.visitSideEffects(g,p,null,n,P,f);}});};function d(p){if(this){O.apply(this,arguments);}else{q.extend(p,O.prototype);}}d.prototype.destroy=O.prototype.destroy;d.prototype.hasPendingChangesForPath=O.prototype.hasPendingChangesForPath;return d;},false);
