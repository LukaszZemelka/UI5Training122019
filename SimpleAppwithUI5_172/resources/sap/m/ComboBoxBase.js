/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Dialog','./ComboBoxTextField','./Input','./GroupHeaderListItem','./SuggestionsPopover','sap/ui/core/SeparatorItem','sap/ui/core/InvisibleText','sap/base/Log','./library','sap/ui/Device','sap/ui/core/library','./ComboBoxBaseRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery","sap/base/security/encodeXML","sap/base/strings/escapeRegExp"],function(D,C,I,G,S,a,b,L,l,c,d,e,f,K,q,g,h){"use strict";var P=l.PlacementType;var j=["value","enabled","name","placeholder","editable","textAlign","textDirection","valueState","valueStateText"];var k=C.extend("sap.m.ComboBoxBase",{metadata:{library:"sap.m","abstract":true,defaultAggregation:"items",properties:{showSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"}},events:{loadItems:{}},dnd:{draggable:false,droppable:true}}});k.DEFAULT_TEXT_FILTER=function(i,o,p){var s,m,M;if(!o[p]){return false;}s=o[p]().toLowerCase();m=i.toLowerCase();M=new RegExp('(^|\\s)'+h(m)+".*",'g');return M.test(s);};k.prototype.oncompositionstart=function(){this._bIsComposingCharacter=true;};k.prototype.oncompositionend=function(E){this._bIsComposingCharacter=false;this._sComposition=E.target.value;if(!c.browser.edge&&!c.browser.firefox){C.prototype.handleInput.apply(this,arguments);this.handleInputValidation(E,this.isComposingCharacter());}};k.prototype.isComposingCharacter=function(){return this._bIsComposingCharacter;};k.prototype.updateItems=function(r){this.bItemsUpdated=false;this.destroyItems();this.updateAggregation("items");this.bItemsUpdated=true;if(this.hasLoadItemsEventListeners()){this.onItemsLoaded();}};k.prototype.setFilterFunction=function(F){if(F===null||F===undefined){this.fnFilter=null;return this;}if(typeof(F)!=="function"){L.warning("Passed filter is not a function and the default implementation will be used");}else{this.fnFilter=F;}return this;};k.prototype.highLightList=function(v,i,B){if(B&&typeof B==="function"){B(i,v);}else{this._oSuggestionPopover.highlightSuggestionItems(i,v,true);}};k.prototype._highlightList=function(v){var i=[],m=[],o,n,p;this._getList().getItems().forEach(function(r){n=r.getDomRef();p=n&&n.getElementsByClassName("sapMSLITitleOnly")[0];if(p){i.push(p);o=n.querySelector(".sapMSLIInfo");if(o&&r.getInfo){m.push(o);}}});this.highLightList(v,i);this.highLightList(v,m);};k.prototype._modifyPopupInput=function(i){this.setTextFieldHandler(i);return i;};k.prototype.setTextFieldHandler=function(t){var i=this,T=t._handleEvent;t._handleEvent=function(E){T.apply(this,arguments);if(/keydown|sapdown|sapup|saphome|sapend|sappagedown|sappageup|input/.test(E.type)){i._handleEvent(E);}};};k.prototype.refreshItems=function(){this.bItemsUpdated=false;this.refreshAggregation("items");};k.prototype.loadItems=function(i,o){var m=typeof i==="function";if(this.hasLoadItemsEventListeners()&&(this.getItems().length===0)){this._bOnItemsLoadedScheduled=false;if(m){o=q.extend({action:i,busyIndicator:true,busyIndicatorDelay:300},o);this.aMessageQueue.push(o);if((this.iLoadItemsEventInitialProcessingTimeoutID===-1)&&(o.busyIndicator)){this.iLoadItemsEventInitialProcessingTimeoutID=setTimeout(function onItemsNotLoadedAfterDelay(){this.setInternalBusyIndicatorDelay(0);this.setInternalBusyIndicator(true);}.bind(this),o.busyIndicatorDelay);}}if(!this.bProcessingLoadItemsEvent){this.bProcessingLoadItemsEvent=true;this.fireLoadItems();}}else if(m){i.call(this);}};k.prototype.onItemsLoaded=function(){this.bProcessingLoadItemsEvent=false;clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);if(this.bInitialBusyIndicatorState!==this.getBusy()){this.setInternalBusyIndicator(this.bInitialBusyIndicatorState);}if(this.iInitialBusyIndicatorDelay!==this.getBusyIndicatorDelay()){this.setInternalBusyIndicatorDelay(this.iInitialBusyIndicatorDelay);}for(var i=0,m,n,o;i<this.aMessageQueue.length;i++){m=this.aMessageQueue.shift();i--;o=(i+1)===this.aMessageQueue.length;n=o?null:this.aMessageQueue[i+1];if(typeof m.action==="function"){if((m.name==="input")&&!o&&(n.name==="input")){continue;}m.action.call(this);}}};k.prototype.hasLoadItemsEventListeners=function(){return this.hasListeners("loadItems");};k.prototype._scheduleOnItemsLoadedOnce=function(){if(!this._bOnItemsLoadedScheduled&&!this.isBound("items")&&this.hasLoadItemsEventListeners()&&this.bProcessingLoadItemsEvent){this._bOnItemsLoadedScheduled=true;setTimeout(this.onItemsLoaded.bind(this),0);}};k.prototype.getPickerInvisibleTextId=function(){return b.getStaticId("sap.m","COMBOBOX_AVAILABLE_OPTIONS");};k.prototype._getGroupHeaderInvisibleText=function(){if(!this._oGroupHeaderInvisibleText){this._oGroupHeaderInvisibleText=new b();this._oGroupHeaderInvisibleText.toStatic();}return this._oGroupHeaderInvisibleText;};k.prototype._getItemByListItem=function(o){return this._getItemBy(o,"ListItem");};k.prototype._getItemBy=function(o,s){s=this.getRenderer().CSS_CLASS_COMBOBOXBASE+s;for(var i=0,m=this.getItems(),n=m.length;i<n;i++){if(m[i].data(s)===o){return m[i];}}return null;};k.prototype._isListInSuggestMode=function(){return this._getList().getItems().some(function(o){return!o.getVisible()&&this._getItemByListItem(o).getEnabled();},this);};k.prototype.getListItem=function(i){return i?i.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"ListItem"):null;};k.prototype.getSelectable=function(i){return i._bSelectable;};k.prototype.init=function(){C.prototype.init.apply(this,arguments);this.setPickerType(c.system.phone?"Dialog":"Dropdown");this.bItemsUpdated=false;this.bOpenedByKeyboardOrButton=false;this._bShouldClosePicker=false;this._oPickerValueStateText=null;this.bProcessingLoadItemsEvent=false;this.iLoadItemsEventInitialProcessingTimeoutID=-1;this.aMessageQueue=[];this.bInitialBusyIndicatorState=this.getBusy();this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();this._bOnItemsLoadedScheduled=false;this._bDoTypeAhead=true;this.getIcon().addEventDelegate({onmousedown:function(E){this._bShouldClosePicker=this.isOpen();}},this);this.getIcon().attachPress(this._handlePopupOpenAndItemsLoad.bind(this,true));this._sComposition="";this.fnFilter=null;};k.prototype._handlePopupOpenAndItemsLoad=function(o){var p;if(!this.getEnabled()||!this.getEditable()){return;}if(this._bShouldClosePicker){this._bShouldClosePicker=false;this.close();return;}this.loadItems();this.bOpenedByKeyboardOrButton=o;if(this.isPlatformTablet()){this.syncPickerContent();p=this.getPicker();p.setInitialFocus(p);}this.open();};k.prototype.exit=function(){C.prototype.exit.apply(this,arguments);if(this._getList()){this._getList().destroy();this._oList=null;}if(this._getGroupHeaderInvisibleText()){this._getGroupHeaderInvisibleText().destroy();this._oGroupHeaderInvisibleText=null;}clearTimeout(this.iLoadItemsEventInitialProcessingTimeoutID);this.aMessageQueue=null;this.fnFilter=null;};k.prototype.onsapshow=function(E){if(!this.getEnabled()||!this.getEditable()){return;}E.setMarked();if(E.keyCode===K.F4){this.onF4(E);}if(this.isOpen()){this.close();return;}this.selectText(0,this.getValue().length);this.loadItems();this.bOpenedByKeyboardOrButton=true;this.open();};k.prototype.onF4=function(E){E.preventDefault();};k.prototype.onsapescape=function(E){if(this.getEnabled()&&this.getEditable()&&this.isOpen()){E.setMarked();E.preventDefault();this.close();}else{C.prototype.onsapescape.apply(this,arguments);}};k.prototype.onsaphide=k.prototype.onsapshow;k.prototype.onsapfocusleave=function(E){if(!E.relatedControlId){C.prototype.onsapfocusleave.apply(this,arguments);return;}var r=sap.ui.getCore().byId(E.relatedControlId);if(r===this){return;}var p=this.getPicker(),F=r&&r.getFocusDomRef();if(p&&f(p.getFocusDomRef(),F)){return;}C.prototype.onsapfocusleave.apply(this,arguments);};k.prototype.getPopupAnchorDomRef=function(){return this.getDomRef();};k.prototype.addContent=function(p){};k.prototype.getList=function(){L.warning("[Warning]:","You are attempting to use deprecated method 'getList()', please refer to SAP note 2746748.",this);return this._getList();};k.prototype._getList=function(){if(this.bIsDestroyed){return null;}return this._oList;};k.prototype.setPickerType=function(p){this._sPickerType=p;};k.prototype.getPickerType=function(){return this._sPickerType;};k.prototype._updateSuggestionsPopoverValueState=function(){var s=this._getSuggestionsPopover();if(s){s.updateValueState(this.getValueState(),this.getValueStateText(),this.getShowValueStateMessage());}};k.prototype.setValueState=function(v){C.prototype.setValueState.apply(this,arguments);this._updateSuggestionsPopoverValueState();return this;};k.prototype.setValueStateText=function(v){C.prototype.setValueStateText.apply(this,arguments);this._updateSuggestionsPopoverValueState();return this;};k.prototype.setShowValueStateMessage=function(s){C.prototype.setShowValueStateMessage.apply(this,arguments);this._updateSuggestionsPopoverValueState();return this;};k.prototype.shouldValueStateMessageBeOpened=function(){var s=C.prototype.shouldValueStateMessageBeOpened.apply(this,arguments);return(s&&!this.isOpen());};k.prototype.onPropertyChange=function(o,i){var n=o.getParameter("newValue"),p=o.getParameter("name"),m="set"+p.charAt(0).toUpperCase()+p.slice(1),r=(i&&i.srcControl)||this.getPickerTextField();if(this.getInputForwardableProperties().indexOf(p)>-1&&r&&(typeof r[m]==="function")){r[m](n);}};k.prototype.getInputForwardableProperties=function(){return j;};k.prototype.isPickerDialog=function(){return this.getPickerType()==="Dialog";};k.prototype.isPlatformTablet=function(){var n=!c.system.combi,t=c.system.tablet&&n;return t;};k.prototype.createPickerTextField=function(){var i=new I({width:"100%",showValueStateMessage:false});return i;};k.prototype.getDropdownSettings=function(){return{showArrow:false,placement:P.VerticalPreferredBottom,offsetX:0,offsetY:0,bounce:false,ariaLabelledBy:this.getPickerInvisibleTextId()||undefined};};k.prototype._configureList=function(){};k.prototype.createPicker=function(p){var o=this.getAggregation("picker");if(o){return o;}this._oSuggestionPopover=this._createSuggestionsPopover();o=this._oSuggestionPopover._oPopover;this.setAggregation("picker",o,true);this.configPicker(o);return o;};k.prototype.configPicker=function(p){};k.prototype._hasShowSelectedButton=function(){return false;};k.prototype._createSuggestionsPopover=function(){var u=this.isPickerDialog(),s;s=new S(this);if(u){var i=this.createPickerTextField();s._oPopupInput=this._modifyPopupInput(i);}s._createSuggestionPopup({showSelectedButton:this._hasShowSelectedButton()});s._createSuggestionPopupContent(false,false,false);this.forwardEventHandlersToSuggPopover(s);this._updateSuggestionsPopoverValueState();this._oList=s._oList;this._configureList(this._oList);return s;};k.prototype.forwardEventHandlersToSuggPopover=function(s){s.setOkPressHandler(this._handleOkPress.bind(this));s.setCancelPressHandler(this._handleCancelPress.bind(this));s.setInputLabels(this.getLabels.bind(this));};k.prototype._handleOkPress=function(){var t=this,T=t.getPickerTextField();t.updateDomValue(T.getValue());t.onChange();t.close();};k.prototype._handleCancelPress=function(){this.close();this.revertSelection();};k.prototype.setSelectable=function(i,s){if(this.indexOfItem(i)<0){return;}i._bSelectable=s;var o=this.getListItem(i);if(o){o.setVisible(s);}};k.prototype.onBeforeClose=function(){this.bOpenedByKeyboardOrButton=false;};k.prototype.getPicker=function(){var p=this.getAggregation("picker");if(p&&!p.bIsDestroyed&&!this.bIsDestroyed){return p;}return null;};k.prototype._getSuggestionsPopover=function(){return this._oSuggestionPopover;};k.prototype.getPickerTextField=function(){var p=this.getPicker(),s=p&&p.getSubHeader();return s&&s.getContent()[0]||null;};k.prototype.getPickerTitle=function(){var p=this.getPicker(),H=p&&p.getCustomHeader();if(this.isPickerDialog()&&H){return H.getContentMiddle()[0];}return null;};k.prototype.getRoleComboNodeDomRef=function(){var F=this.getFocusDomRef();if(!F){return null;}return F.parentNode;};k.prototype.revertSelection=function(){};k.prototype.hasContent=function(){return this.getItems().length>0;};k.prototype.syncPickerContent=function(){};k.prototype.findFirstEnabledItem=function(m){m=m||this.getItems();for(var i=0;i<m.length;i++){if(m[i].getEnabled()){return m[i];}}return null;};k.prototype.findLastEnabledItem=function(i){i=i||this.getItems();return this.findFirstEnabledItem(i.reverse());};k.prototype.open=function(){var p=this.getPicker();if(p){this._updateSuggestionsPopoverValueState();p.open();}return this;};k.prototype.getVisibleItems=function(){for(var i=0,o,m=this.getItems(),v=[];i<m.length;i++){o=this.getListItem(m[i]);if(o&&o.getVisible()){v.push(m[i]);}}return v;};k.prototype.isItemSelected=function(){};k.prototype.getKeys=function(m){m=m||this.getItems();for(var i=0,n=[];i<m.length;i++){n[i]=m[i].getKey();}return n;};k.prototype.getSelectableItems=function(){return this.getEnabledItems(this.getVisibleItems());};k.prototype.findItem=function(p,v){var m="get"+p.charAt(0).toUpperCase()+p.slice(1);for(var i=0,n=this.getItems();i<n.length;i++){if(n[i][m]()===v){return n[i];}}return null;};k.prototype.getItemByText=function(t){return this.findItem("text",t);};k.prototype.scrollToItem=function(i){var p=this.getPicker(),o=p.getDomRef("cont"),m=i&&i.getDomRef();if(!p||!o||!m){return;}var n=o.scrollTop,r=m.offsetTop,s=o.clientHeight,t=m.offsetHeight;if(n>r){o.scrollTop=r;}else if((r+t)>(n+s)){o.scrollTop=Math.ceil(r+t-s);}};k.prototype.clearFilter=function(){this.getItems().forEach(function(i){var o=this.getListItem(i);if(o){o.setVisible(i.getEnabled()&&this.getSelectable(i));}},this);};k.prototype.onItemChange=function(o){};k.prototype.clearSelection=function(){};k.prototype.setInternalBusyIndicator=function(B){this.bInitialBusyIndicatorState=this.getBusy();return this.setBusy.apply(this,arguments);};k.prototype.setInternalBusyIndicatorDelay=function(i){this.iInitialBusyIndicatorDelay=this.getBusyIndicatorDelay();return this.setBusyIndicatorDelay.apply(this,arguments);};k.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_change",this.onItemChange,this);}if(this._getList()){this._getList().addItem(this._mapItemToListItem(i));}return this;};k.prototype.insertItem=function(i,m){this.insertAggregation("items",i,m,true);if(i){i.attachEvent("_change",this.onItemChange,this);}if(this._getList()){this._getList().insertItem(this._mapItemToListItem(i),m);}this._scheduleOnItemsLoadedOnce();return this;};k.prototype.getItemAt=function(i){return this.getItems()[+i]||null;};k.prototype.getFirstItem=function(){return this.getItems()[0]||null;};k.prototype.getLastItem=function(){var i=this.getItems();return i[i.length-1]||null;};k.prototype.getEnabledItems=function(i){i=i||this.getItems();return i.filter(function(o){return o.getEnabled();});};k.prototype.getItemByKey=function(s){return this.findItem("key",s);};k.prototype.addItemGroup=function(o,H,s){H=H||new a({text:o.text||o.key});this.addAggregation("items",H,s);if(this._getList()&&H.isA("sap.ui.core.SeparatorItem")){this._getList().addItem(this._mapItemToListItem(H));}return H;};k.prototype._mapSeparatorItemToGroupHeader=function(s,o){var i=new G({title:s.getText(),ariaLabelledBy:this._getGroupHeaderInvisibleText().getId()});i.addStyleClass(o.CSS_CLASS_COMBOBOXBASE+"NonInteractiveItem");if(s.getText&&!s.getText()){i.addStyleClass(o.CSS_CLASS_COMBOBOXBASE+"SeparatorItemNoText");}return i;};k.prototype.isOpen=function(){var p=this.getPicker();return!!(p&&p.isOpen());};k.prototype.close=function(){var p=this.getPicker();if(p){p.close();}return this;};k.prototype.removeItem=function(i){i=this.removeAggregation("items",i);if(i){i.detachEvent("_change",this.onItemChange,this);}return i;};k.prototype.removeAllItems=function(){var m=this.removeAllAggregation("items");this.clearSelection();for(var i=0;i<m.length;i++){m[i].detachEvent("_change",this.onItemChange,this);}return m;};k.prototype.intersectItems=function(i,o){return i.filter(function(m){return o.map(function(O){return O.getId();}).indexOf(m.getId())!==-1;});};k.prototype.showItems=function(F){var i=this.fnFilter,m=function(){if(!this.getItems().length){return;}this.detachLoadItems(m);this.setFilterFunction(F||function(){return true;});this.applyShowItemsFilters();this._handlePopupOpenAndItemsLoad(false);this.setFilterFunction(i);}.bind(this);if(!this.getEnabled()||!this.getEditable()){return;}this.attachLoadItems(m);this.loadItems(m);};k.prototype.applyShowItemsFilters=function(){};return k;});
