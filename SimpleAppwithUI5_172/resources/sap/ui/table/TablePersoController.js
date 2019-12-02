/*
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObject',"sap/ui/core/syncStyleClass","sap/base/Log","sap/ui/thirdparty/jquery"],function(M,s,L,q){"use strict";var T=M.extend("sap.ui.table.TablePersoController",{constructor:function(i,S){M.apply(this,arguments);},metadata:{properties:{"autoSave":{type:"boolean",defaultValue:true},"persoService":{type:"any"},"customDataKey":{type:"string",defaultValue:"persoKey"}},associations:{"table":{type:"sap.ui.table.Table",multiple:false}},library:"sap.ui.table"}});T.prototype.init=function(){this._schemaProperty="_persoSchemaVersion";this._schemaVersion="1.0";this._oInitialPersoData=null;this._aTableEvents=["columnResize","columnMove","columnVisibility","sort","filter","group"];this._aColumnProperties=["visible","width","sorted","sortOrder","grouped","summed"];this._bSaveFilters=false;if(this._bSaveFilters){this._aTableEvents.push("filter");this._aColumnProperties.push("filtered");this._aColumnProperties.push("filterValue");}};T.prototype.exit=function(){var t=this._getTable();if(t){this._manageTableEventHandlers(t,false);}delete this._schemaProperty;delete this._schemaVersion;delete this._oInitialPersoData;if(this._oDialog){this._oDialog.destroy();delete this._oDialog;}};T.prototype.setPersoService=function(S){S=this.validateProperty("persoService",S);if(S&&(!q.isFunction(S.getPersData)||!q.isFunction(S.setPersData)||!q.isFunction(S.delPersData))){throw new Error("Value of property \"persoService\" needs to be null/undefined or an object that has the methods "+"\"getPersData\", \"setPersData\" and \"delPersData\".");}var o=this.getPersoService();this.setProperty("persoService",S,true);var n=this.getPersoService();if(n&&n!==o&&this._getTable()&&(this.getAutoSave()||!o)){this.refresh();}return this;};T.prototype.setAutoSave=function(a){var o=this.getAutoSave();this.setProperty("autoSave",a,true);var n=this.getAutoSave();if(n&&!o){this.savePersonalizations();}return this;};T.prototype.setTable=function(t){var o=this._getTable();if(o){o._oPersoController=undefined;}this.setAssociation("table",t,true);var n=this._getTable();if(n){n._oPersoController=this;}if(o){this._manageTableEventHandlers(o,false);}if(n&&n!==o){this._oInitialPersoData=this._getCurrentTablePersoData(true);this._manageTableEventHandlers(n,true);if(this.getPersoService()&&(this.getAutoSave()||!o)){this.refresh();}}else if(!n){this._oInitialPersoData=null;}return this;};T.prototype.setCustomDataKey=function(c){var o=this.getCustomDataKey();this.setProperty("customDataKey",c,true);var n=this.getCustomDataKey();if(o!==n&&this.getAutoSave()){this.savePersonalizations();}return this;};T.prototype._manageTableEventHandlers=function(t,a){for(var i=0,l=this._aTableEvents.length;i<l;i++){var f=t[(a?"attachEvent":"detachEvent")];f.apply(t,[this._aTableEvents[i],this._tableEventHandler,this]);}};T.prototype.refresh=function(){var t=this;var S=this.getPersoService();if(S){return S.getPersData().done(function(o){var D=(o&&Array.isArray(o.aColumns))?o:t._oInitialPersoData;t._adjustTable(D);}).fail(function(){L.error("Problem reading persisted personalization data.");});}else{L.error("The Personalization Service is not available!");var d=q.Deferred();d.reject();return d.promise();}};T.prototype.savePersonalizations=function(){var S=this.getPersoService();if(S){var d=this._getCurrentTablePersoData();d[this._schemaProperty]=this._schemaVersion;return S.setPersData(d).fail(function(){L.error("Problem persisting personalization data.");});}else{L.error("The Personalization Service is not available!");var D=q.Deferred();D.reject();return D.promise();}};T.prototype._adjustTable=function(d){var t=this._getTable();if(!t||!d||!Array.isArray(d.aColumns)){return;}var c={},C=t.getColumns();for(var i=0,l=C.length;i<l;i++){c[this._getColumnPersoKey(C[i])]=C[i];}var a=d.aColumns;for(var i=0,l=a.length;i<l;i++){var o=a[i];var b=c[o.id];if(b){if(t.indexOfColumn(b)!==o.order){t.removeColumn(b);t.insertColumn(b,o.order);}var m=b.getMetadata();for(var j=0,e=this._aColumnProperties.length;j<e;j++){var p=this._aColumnProperties[j];if(o[p]!==undefined){try{if(m.hasProperty(p)&&b.getProperty(p)!=o[p]){b.setProperty(p,o[p]);}}catch(f){L.error("sap.ui.table.TablePersoController: failed to apply the value \""+b[p]+"\" for the property + \""+p+"\".");}}}}}if(typeof t._onPersoApplied==="function"){t._onPersoApplied();}};T.prototype._tableEventHandler=function(e){if(this.getAutoSave()&&!this._iTriggerSaveTimeout){var t=this;this._iTriggerSaveTimeout=setTimeout(function(){t.savePersonalizations();t._iTriggerSaveTimeout=null;},0);}};T.prototype._getCurrentTablePersoData=function(f){var t=this._getTable(),c=t.getColumns();var d={aColumns:[]};for(var i=0,l=c.length;i<l;i++){var C=c[i];var p=this._getColumnPersoKey(C);var o={id:p,order:i};var m=C.getMetadata();for(var j=0,a=this._aColumnProperties.length;j<a;j++){var P=this._aColumnProperties[j];if(m.hasProperty(P)){o[P]=C.getProperty(P);}}if(f){o.text=C.getLabel()&&C.getLabel().getText()||p;}d.aColumns.push(o);}return d;};T.prototype._getTable=function(){return sap.ui.getCore().byId(this.getTable());};T.prototype._getColumnPersoKey=function(c){return this._getPersoKey(this._getTable())+"-"+this._getPersoKey(c);};T.prototype._getPersoKey=function(c){var p=c.data(this.getCustomDataKey());if(!p){p=c.getId();if(p.indexOf(sap.ui.getCore().getConfiguration().getUIDPrefix())===0){L.warning("Generated IDs should not be used as personalization keys! The stability cannot be ensured! (Control: \""+c.getId()+"\")");}}return p;};T.prototype.openDialog=function(S){var t=this;function _(){if(t._oDialog){s("sapUiSizeCompact",t._getTable(),t._oDialog._oDialog);t._oDialog.open();}}if(!this._oDialog){sap.ui.getCore().loadLibrary("sap.m",{async:true}).then(function(){sap.ui.require(["sap/m/TablePersoDialog"],function(a){t._oDialog=new a(t._getTable().getId()+"-PersoDialog",{persoService:t.getPersoService(),showSelectAll:true,showResetAll:true,hasGrouping:false,contentWidth:S&&S.contentWidth,contentHeight:S&&S.contentHeight||"20rem",initialColumnState:t._oInitialPersoData.aColumns,columnInfoCallback:function(o,p,P){return t._getCurrentTablePersoData(true).aColumns;},confirm:function(){t._adjustTable(this.retrievePersonalizations());if(t.getAutoSave()){t.savePersonalizations();}}});t._oDialog._oDialog.removeStyleClass("sapUiPopupWithPadding");_();});});}else{_();}};return T;});
