/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/delegate/ItemNavigation","sap/base/assert","sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes"],function(I,a,c,K){"use strict";var H=I.extend("sap.m.HeaderContainerItemNavigator");H.prototype._callParent=function(f,A){if(typeof I.prototype[f]==="function"){I.prototype[f].apply(this,A);}};H.prototype.onsaphome=function(e){if(this._skipNavigation(e)){return;}this._callParent("onsaphome",arguments);};H.prototype.onsapend=function(e){if(this._skipNavigation(e)){return;}this._callParent("onsapend",arguments);};H.prototype.onsapnext=function(e){if(this._skipNavigation(e)){return;}this._callParent("onsapnext",arguments);};H.prototype.onsapprevious=function(e){if(this._skipNavigation(e,true,false)){return;}this._callParent("onsapprevious",arguments);};H.prototype._skipNavigation=function(e){return Array.prototype.indexOf.call(this.aItemDomRefs,e.target)===-1;};return H;});
