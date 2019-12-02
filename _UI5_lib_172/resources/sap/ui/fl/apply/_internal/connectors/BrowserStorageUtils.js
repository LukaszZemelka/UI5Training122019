/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var F="sap.ui.fl.change";var a="sap.ui.fl.variant";return{forEachObjectInStorage:function(p,P){var r=p.storage.getItems&&p.storage.getItems()||p.storage;return Promise.resolve(r).then(function(r){var b=Object.keys(r).map(function(k){var i=k.includes(F)||k.includes(a);if(!i){return;}var s=r[k];var f=p.storage._itemsStoredAsObjects?s:JSON.parse(s);var S=true;if(p.reference){S=f.reference===p.reference||f.reference+".Component"===p.reference;}var c=true;if(p.layer){c=f.layer===p.layer;}if(!S||!c){return;}return P({changeDefinition:f,key:k});});return Promise.all(b);});},getAllFlexObjects:function(p){var f=[];return this.forEachObjectInStorage(p,function(m){f.push(m);}).then(function(){return f;});},createChangeKey:function(i){if(i){return F+"."+i;}},createVariantKey:function(i){if(i){return a+"."+i;}},createFlexObjectKey:function(f){if(f.fileType==="ctrl_variant"&&f.variantManagementReference){return this.createVariantKey(f.fileName);}return this.createChangeKey(f.fileName);}};});
