/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/Control",'sap/ui/core/delegate/ItemNavigation',"sap/f/GridContainer","sap/f/GridContainerSettings","sap/f/ProductSwitchItem","sap/f/ProductSwitchRenderer"],function(C,a,I,G,b,P,c){"use strict";var d=a.extend("sap.f.ProductSwitch",{metadata:{library:"sap.f",aggregations:{_gridContainer:{type:"sap.f.GridContainer",visibility:"hidden",multiple:false},items:{type:"sap.f.ProductSwitchItem",multiple:true,singularName:"item",forwarding:{getter:"_getGridContainer",aggregation:"items"}}},associations:{selectedItem:{type:"sap.f.ProductSwitchItem",multiple:false}},events:{change:{parameters:{itemPressed:{type:"sap.f.ProductSwitchItem"}}}}}});d.COLUMNS={THREE_COLUMNS:3,FOUR_COLUMNS:4};d.prototype.init=function(){this._oCurrentSelectedItem=null;};d.prototype.exit=function(){this._oCurrentSelectedItem=null;this._destroyItemNavigation();};d.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null;}};d.prototype.onAfterRendering=function(){var D,e=[];if(!this._oItemNavigation){this._oItemNavigation=new I(null,null);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]});this.addEventDelegate(this._oItemNavigation);}D=this.getDomRef();this._oItemNavigation.setRootDomRef(D);e=this.getItems().map(function(i){return i.getDomRef();});this._oItemNavigation.setItemDomRefs(e);};d.prototype._gridContainerItemsUpdate=function(){var l=this._getGridContainer().getLayout();l.setColumns(this.getItems().length<=6?d.COLUMNS.THREE_COLUMNS:d.COLUMNS.FOUR_COLUMNS);};d.prototype._changeLayoutHandler=function(e){var E=e.getParameter("layout"),i=E==="layoutS"||E==="layoutXS";this._getGridContainer().toggleStyleClass("sapFProductSwitch-Popover-CTX",!i);};d.prototype._getGridContainer=function(){var g=this.getAggregation("_gridContainer");if(!g){g=new G({layoutChange:this._changeLayoutHandler.bind(this)}).setLayout(new b({columnSize:"11.25rem",rowSize:"7rem",gap:"0.5rem",columns:4})).setLayoutM(new b({columnSize:"11.25rem",rowSize:"7rem",gap:"0.5rem",columns:3})).setLayoutS(new b({columnSize:"100%",rowSize:"5rem",gap:"0",columns:1}));this.setAggregation("_gridContainer",g);}return g;};d.prototype._onItemPress=function(e){this.setSelectedItem(e.oSource);this.fireChange({itemPressed:e.oSource});};d.prototype._setSelection=function(i){if(this._oCurrentSelectedItem){this._oCurrentSelectedItem.removeStyleClass("sapFPSItemSelected");}this._oCurrentSelectedItem=i;if(this._oCurrentSelectedItem){this._oCurrentSelectedItem.addStyleClass("sapFPSItemSelected");}};d.prototype.setSelectedItem=function(i){if(typeof i==="string"){i=C.byId(i);}if(!(i instanceof P)&&i!==null){return this;}this._setSelection(i);return this.setAssociation("selectedItem",i);};d.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_itemPress",this._onItemPress,this);}this._gridContainerItemsUpdate();return this;};d.prototype.insertItem=function(i,e){this.insertAggregation("items",i,e);if(i){i.attachEvent("_itemPress",this._onItemPress,this);}this._gridContainerItemsUpdate();return this;};d.prototype.removeItem=function(i){var r=this.removeAggregation("items",i).detachEvent("_itemPress",this._onItemPress,this);this._gridContainerItemsUpdate();return r;};d.prototype.removeAllItems=function(){var i=this.getItems(),r;i.forEach(function(o){o.detachEvent("_itemPress",this._onItemPress,this);},this);r=this.removeAllAggregation("items");this._gridContainerItemsUpdate();return r;};d.prototype.destroyItems=function(){var i=this.getItems(),D;i.forEach(function(o){o.detachEvent("_itemPress",this._onItemPress,this);},this);D=this.destroyAggregation("items");this._gridContainerItemsUpdate();return D;};return d;},true);
