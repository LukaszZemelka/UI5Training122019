/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/apply/connectors/BaseConnector","sap/ui/fl/apply/_internal/connectors/Utils","sap/base/util/restricted/_pick","sap/ui/dom/includeScript"],function(m,B,A,_,i){"use strict";var a=m({},B,{xsrfToken:undefined,_loadModules:function(f){return new Promise(function(r,b){i(f,undefined,r,b);});},loadFlexData:function(p){var P=_(p,["appVersion"]);var d=A.getUrl(this.ROUTES.DATA,p,P);return A.sendRequest(d,"GET",{xsrfToken:this.xsrfToken}).then(function(r){var R=r.response;if(r.xsrfToken){this.xsrfToken=r.xsrfToken;}R.changes=R.changes.concat(R.compVariants||[]);if(!R.loadModules){return R;}var M=A.getUrl(this.ROUTES.MODULES,p,P);return this._loadModules(M).then(function(){return R;});}.bind(this));}});return a;},true);
