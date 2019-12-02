/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Bar','./Button','./InstanceManager','./library','./Title','./TitleAlignmentMixin','sap/ui/core/Control','sap/ui/core/Popup','sap/ui/core/delegate/ScrollEnablement','sap/ui/core/theming/Parameters','sap/ui/Device','sap/ui/base/ManagedObject',"sap/ui/core/util/ResponsivePaddingsEnablement",'sap/ui/core/library','sap/ui/core/Element','sap/ui/core/ResizeHandler','./PopoverRenderer',"sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/dom/getScrollbarSize","sap/ui/events/KeyCodes","sap/base/Log","sap/ui/dom/jquery/Focusable","sap/ui/dom/jquery/rect","sap/ui/dom/jquery/control"],function(B,a,I,l,T,b,C,P,S,c,D,M,R,d,E,f,g,h,q,i,K,L){"use strict";var j=l.PopupHelper;var O=d.OpenState;var k=l.PlacementType;var m=l.TitleAlignment;var s=20;var n=C.extend("sap.m.Popover",{metadata:{interfaces:["sap.ui.core.PopupInterface"],library:"sap.m",properties:{placement:{type:"sap.m.PlacementType",group:"Behavior",defaultValue:k.Right},showHeader:{type:"boolean",group:"Appearance",defaultValue:true},title:{type:"string",group:"Appearance",defaultValue:null},modal:{type:"boolean",group:"Behavior",defaultValue:false},offsetX:{type:"int",group:"Appearance",defaultValue:0},offsetY:{type:"int",group:"Appearance",defaultValue:0},showArrow:{type:"boolean",group:"Appearance",defaultValue:true},contentWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},contentMinWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:""},contentHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enableScrolling:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},verticalScrolling:{type:"boolean",group:"Misc",defaultValue:true},horizontalScrolling:{type:"boolean",group:"Misc",defaultValue:true},bounce:{type:"boolean",group:"Behavior",defaultValue:null},resizable:{type:"boolean",group:"Dimension",defaultValue:false},ariaModal:{type:"boolean",group:"Misc",defaultValue:true,visibility:"hidden"},titleAlignment:{type:"sap.m.TitleAlignment",group:"Misc",defaultValue:m.Auto}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},customHeader:{type:"sap.ui.core.Control",multiple:false},subHeader:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.ui.core.Control",multiple:false},_internalHeader:{type:"sap.m.Bar",multiple:false,visibility:"hidden"},beginButton:{type:"sap.ui.core.Control",multiple:false},endButton:{type:"sap.ui.core.Control",multiple:false}},associations:{leftButton:{type:"sap.m.Button",multiple:false,deprecated:true},rightButton:{type:"sap.m.Button",multiple:false,deprecated:true},initialFocus:{type:"sap.ui.core.Control",multiple:false},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"}}}},designtime:"sap/m/designtime/Popover.designtime"}});n._bIOS7=D.os.ios&&D.os.version>=7&&D.os.version<8&&D.browser.name==="sf";R.call(n.prototype,{header:{suffix:"intHeader"},subHeader:{selector:".sapMPopoverSubHeader .sapMIBar"},content:{suffix:"cont"},footer:{selector:".sapMPopoverFooter .sapMIBar"}});n.prototype.init=function(){this._arrowOffsetThreshold=4;this._marginTopInit=false;this._marginTop=48;this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._minDimensions={width:100,height:32};this._$window=q(window);this._initialWindowDimensions={};this.oPopup=new P();this.oPopup.setShadow(true);this.oPopup.setAutoClose(true);this.oPopup.setAnimations(q.proxy(this._openAnimation,this),q.proxy(this._closeAnimation,this));this._placements=[k.Top,k.Right,k.Bottom,k.Left,k.Vertical,k.Horizontal,k.Auto,k.VerticalPreferedTop,k.VerticalPreferedBottom,k.HorizontalPreferedLeft,k.HorizontalPreferedRight,k.VerticalPreferredTop,k.VerticalPreferredBottom,k.HorizontalPreferredLeft,k.HorizontalPreferredRight,k.PreferredRightOrFlip,k.PreferredLeftOrFlip,k.PreferredTopOrFlip,k.PreferredBottomOrFlip];this._myPositions=["center bottom","begin center","center top","end center"];this._atPositions=["center top","end center","center bottom","begin center"];this._offsets=["0 -18","18 0","0 18","-18 0"];this._arrowOffset=18;this._followOfTolerance=32;this._scrollContentList=["sap.m.NavContainer","sap.m.Page","sap.m.ScrollContainer","sap.m.SimpleFixFlex"];this._fnAdjustPositionAndArrow=q.proxy(this._adjustPositionAndArrow,this);this._fnOrientationChange=q.proxy(this._onOrientationChange,this);this._fnFollowOf=q.proxy(function(e){var o=e.lastOfRect,r=e.currentOfRect;if(!D.system.desktop||(Math.abs(o.top-r.top)<=this._followOfTolerance&&Math.abs(o.left-r.left)<=this._followOfTolerance)||(Math.abs(o.top+o.height-r.top-r.height)<=this._followOfTolerance&&Math.abs(o.left+o.width-r.left-r.width)<=this._followOfTolerance)){this.oPopup._applyPosition(this.oPopup._oLastPosition,true);}else{this.close();}},this);this.setFollowOf(true);this._initResponsivePaddingsEnablement();this._oRestoreFocusDelegate={onBeforeRendering:function(){var A=q(document.activeElement),o=A.control(0);this._sFocusControlId=o&&o.getId();},onAfterRendering:function(){if(this._sFocusControlId&&!h(this.getDomRef(),document.activeElement)){sap.ui.getCore().byId(this._sFocusControlId).focus();}}};var t=this;this.oPopup._applyPosition=function(p,F){var e=this.getOpenState(),o;if(e===O.CLOSING||e===O.CLOSED){return;}if(F){t._storeScrollPosition();}t._clearCSSStyles();var r=t._placements.indexOf(t.getPlacement());if(r>3&&!t._bPosCalced){t._calcPlacement();return;}t._bPosCalced=false;if(t._oOpenBy instanceof E){p.of=t._getOpenByDomRef();}if(!p.of){L.warning("sap.m.Popover: in function applyPosition, the openBy element doesn't have any DOM output. "+t);return;}if(!h(document.documentElement,p.of)&&p.of.id){o=q(document.getElementById(p.of.id));if(o){p.of=o;}else{L.warning("sap.m.Popover: in function applyPosition, the openBy element's DOM is already detached from DOM tree and can't be found again by the same id. "+t);return;}}var u=q(p.of).rect();if(F&&t._$window.height()==t._initialWindowDimensions.height&&(u.top+u.height<=0||u.top>=t._$window.height()||u.left+u.width<=0||u.left>=t._$window.width())){t.close();return;}var v=t.getDomRef("scroll");if(!D.system.desktop){q(window).scrollLeft(0);}t._deregisterContentResizeHandler();P.prototype._applyPosition.call(this,p);t._fnAdjustPositionAndArrow();t._restoreScrollPosition();t._registerContentResizeHandler(v);};this.oPopup.close=function(e){var o=typeof e==="boolean";var p=t.oPopup.getOpenState();if(e!==true&&(this.touchEnabled||!this._isFocusInsidePopup())&&this.isOpen()&&!(p===O.CLOSED||p===O.CLOSING)){t.fireBeforeClose({openBy:t._oOpenBy});}t._deregisterContentResizeHandler();P.prototype.close.apply(this,o?[]:arguments);t.removeDelegate(t._oRestoreFocusDelegate);};};n.prototype.onBeforeRendering=function(){var N,p;if(!this._initialWindowDimensions.width||!this._initialWindowDimensions.height){this._initialWindowDimensions={width:this._$window.width(),height:this._$window.height()};}if(!this.getHorizontalScrolling()&&!this.getVerticalScrolling()){this._forceDisableScrolling=true;}else if(!this._bVScrollingEnabled&&!this._bHScrollingEnabled&&this._hasSingleScrollableContent()){this._forceDisableScrolling=true;L.info("VerticalScrolling and horizontalScrolling in sap.m.Popover with ID "+this.getId()+" has been disabled because there's scrollable content inside");}else{this._forceDisableScrolling=false;}if(!this._forceDisableScrolling){if(!this._oScroller){this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling()});}}if(this._bContentChanged){this._bContentChanged=false;N=this._getSingleNavContent();p=this._getSinglePageContent();if(N&&!this.getModal()&&!D.system.phone&&!q.sap.simulateMobileOnDesktop){N.attachEvent("afterNavigate",function(e){var o=this.getDomRef();if(o){var F=this.$().firstFocusableDomRef()||o;F.focus();}},this);}if(N||p){p=p||N.getCurrentPage();if(p&&p._getAnyHeader){this.addStyleClass("sapMPopoverWithHeaderCont");}if(N){N.attachEvent("navigate",function(e){var o=e.getParameter("to");if(o instanceof C&&o.isA("sap.m.Page")){this.$().toggleClass("sapMPopoverWithHeaderCont",!!o._getAnyHeader());}},this);}}}};n.prototype.onAfterRendering=function(){var $,e,o;if(!this._marginTopInit&&this.getShowArrow()){this._marginTop=2;if(this._oOpenBy){$=q(this._getOpenByDomRef());if(!($.closest("header.sapMIBar").length>0)){e=$.closest(".sapMPage");if(e.length>0){o=e.children("header.sapMIBar");if(o.length>0){this._marginTop+=o.outerHeight();}}}this._marginTopInit=true;}}};n.prototype.exit=function(){this._deregisterContentResizeHandler();D.resize.detachHandler(this._fnOrientationChange);I.removePopoverInstance(this);this.removeDelegate(this._oRestoreFocusDelegate);this._oRestoreFocusDelegate=null;if(this.oPopup){this.oPopup.detachClosed(this._handleClosed,this);this.oPopup.destroy();this.oPopup=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._internalHeader){this._internalHeader.destroy();this._internalHeader=null;}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null;}};n.prototype.openBy=function(o,e){var p=this.oPopup,r=this.oPopup.getOpenState(),F=this._getInitialFocusId(),t,u,v,w;t=(o.getDomRef&&o.getDomRef())||o;w=q(t).closest(".sapUiSizeCompact");v=c.get("_sap_m_Popover_ForceCompactArrowOffset")==="true";this._bSizeCompact=l._bSizeCompact||!!w.length||this.hasStyleClass("sapUiSizeCompact");this._bUseCompactArrow=this._bSizeCompact||v;this._adaptPositionParams();if(r===O.OPEN||r===O.OPENING){if(this._oOpenBy===o){return this;}else{var x=function(){p.detachClosed(x,this);this.openBy(o);};p.attachClosed(x,this);this.close();return this;}}if(!o){return this;}if(D.support.touch){D.resize.attachHandler(this._fnOrientationChange);}if(!this._oOpenBy||o!==this._oOpenBy){this._oOpenBy=o;}this.fireBeforeOpen({openBy:this._oOpenBy});p.attachOpened(this._handleOpened,this);p.attachClosed(this._handleClosed,this);p.setInitialFocusId(F);u=this._placements.indexOf(this.getPlacement());if(u>-1){t=this._getOpenByDomRef();if(!t){L.error("sap.m.Popover id = "+this.getId()+": is opened by a control which isn't rendered yet.");return this;}p.setAutoCloseAreas([o]);p.setContent(this);if(u<=3){p.setPosition(this._myPositions[u],this._atPositions[u],t,this._calcOffset(this._offsets[u]),"fit");}else{p._oPosition.of=t;}var y=this;var z=function(){if(p.bIsDestroyed){return;}if(p.getOpenState()===O.CLOSING){if(y._sOpenTimeout){clearTimeout(y._sOpenTimeout);y._sOpenTimeout=null;}y._sOpenTimeout=setTimeout(z,150);}else{y._oPreviousFocus=P.getCurrentFocusInfo();p.open();y.addDelegate(y._oRestoreFocusDelegate,y);if(!e){I.addPopoverInstance(y);}}};z();}else{L.error(this.getPlacement()+"is not a valid value! It can only be top, right, bottom or left");}return this;};n.prototype.close=function(){var e=this.oPopup.getOpenState(),o,A;if(e===O.CLOSED||e===O.CLOSING){return this;}this.fireBeforeClose({openBy:this._oOpenBy});this.oPopup.close(true);if(this._oPreviousFocus){A=document.activeElement||{};o=(this._oPreviousFocus.sFocusId===sap.ui.getCore().getCurrentFocusedControlId())||(this._oPreviousFocus.sFocusId===A.id);if(!o){P.applyFocusInfo(this._oPreviousFocus);this._oPreviousFocus=null;}}return this;};n.prototype.isOpen=function(){return this.oPopup&&this.oPopup.isOpen();};n.prototype.setFollowOf=function(v){if(v){this.oPopup.setFollowOf(this._fnFollowOf);}else{this.oPopup.setFollowOf(false);}return this;};n.prototype._clearCSSStyles=function(){var o=this.getDomRef().style,$=this.$("cont"),e=$.children(".sapMPopoverScroll"),p=$[0].style,r=e[0].style,t=this.getContentWidth(),u=this.getContentHeight(),v=this.$("arrow"),w,W;if(t.indexOf("%")>0){w=this._$window.width();t=j.calcPercentageSize(t,w);}if(u.indexOf("%")>0){W=this._$window.height();u=j.calcPercentageSize(u,W);}p.width=t||"";p.height=u||"";p.maxWidth="";p.maxHeight="";o.left="";o.right="";o.top="";o.bottom="";o.width="";o.height="";o.overflow="";r.width="";r.display="";v.removeClass("sapMPopoverArrRight sapMPopoverArrLeft sapMPopoverArrDown sapMPopoverArrUp sapMPopoverCrossArr sapMPopoverFooterAlignArr sapMPopoverHeaderAlignArr sapContrast sapContrastPlus");v.css({left:"",top:""});};n.prototype._onOrientationChange=function(){var e=this.oPopup.getOpenState();if(!(e===O.OPEN||e===O.OPENING)){return;}this.oPopup._applyPosition(this.oPopup._oLastPosition,true);this._includeScrollWidth();};n.prototype._includeScrollWidth=function(){var e=this.getContentWidth(),$=this.$(),o=Math.floor(window.innerWidth*0.9),p=this.$('cont');if(!p[0]){return;}if(D.system.desktop&&!D.browser.chrome){var H=p[0].clientHeight<p[0].scrollHeight;if(H&&(!e||e==='auto')&&p.width()<o){$.addClass("sapMPopoverVerticalScrollIncluded");p.css({"padding-right":s});}else{$.removeClass("sapMPopoverVerticalScrollIncluded");p.css({"padding-right":""});}}};n.prototype._handleOpened=function(){var t=this;this.oPopup.detachOpened(this._handleOpened,this);if(!D.support.touch){setTimeout(function(){!t.bIsDestroyed&&D.resize.attachHandler(t._fnOrientationChange);},0);}var F=this._getInitialFocusId(),o=sap.ui.getCore().byId(F),e=(F?window.document.getElementById(F):null);if(o&&o.getFocusDomRef()){o.getFocusDomRef().focus();}else if(!o&&e){e.focus();}this.fireAfterOpen({openBy:this._oOpenBy});};n.prototype._handleClosed=function(){this.oPopup.detachClosed(this._handleClosed,this);D.resize.detachHandler(this._fnOrientationChange);I.removePopoverInstance(this);if(!this.oPopup._bModal&&!D.system.desktop&&document.activeElement&&!q(document.activeElement).is(":visible")){document.activeElement.blur();}this.fireAfterClose({openBy:this._oOpenBy});};n.prototype.onfocusin=function(e){var o=e.target,$=this.$();if(o.id===this.getId()+"-firstfe"){var p=$.lastFocusableDomRef();if(p){p.focus();}}else if(o.id===this.getId()+"-lastfe"){var F=$.firstFocusableDomRef();if(F){F.focus();}}};n.prototype.onkeydown=function(e){var o=K,p=e.which||e.keyCode,A=e.altKey;if(p===o.ESCAPE||(A&&p===o.F4)){if(e.originalEvent&&e.originalEvent._sapui_handledByControl){return;}this.close();e.stopPropagation();e.preventDefault();}};n.prototype.onmousedown=function(o){var r=sap.ui.getCore().getConfiguration().getRTL();if(!o.target.classList.contains("sapMPopoverResizeHandle")){return;}var $=q(document);var p=this.$();var t=this;p.addClass('sapMPopoverResizing');o.preventDefault();o.stopPropagation();var u={x:o.pageX,y:o.pageY,width:p.width(),height:p.height()};$.on("mousemove.sapMPopover",function(e){var w,v;if(r){w=u.width+u.x-e.pageX;v=u.height+(u.y-e.pageY);}else{w=u.width+e.pageX-u.x;v=u.height+(u.y-e.pageY);}t.setContentWidth(Math.max(w,t._minDimensions.width)+'px');t.setContentHeight(Math.max(v,t._minDimensions.height)+'px');});$.on("mouseup.sapMPopover",function(){p.removeClass("sapMPopoverResizing");$.off("mouseup.sapMPopover, mousemove.sapMPopover");});};n.prototype._hasSingleNavContent=function(){return!!this._getSingleNavContent();};n.prototype._getSingleNavContent=function(){var e=this._getAllContent();while(e.length===1&&e[0]instanceof C&&e[0].isA("sap.ui.core.mvc.View")){e=e[0].getContent();}if(e.length===1&&e[0]instanceof C&&e[0].isA("sap.m.NavContainer")){return e[0];}else{return null;}};n.prototype._getSinglePageContent=function(){var e=this._getAllContent();while(e.length===1&&e[0]instanceof C&&e[0].isA("sap.ui.core.mvc.View")){e=e[0].getContent();}if(e.length===1&&e[0]instanceof C&&e[0].isA("sap.m.Page")){return e[0];}else{return null;}};n.prototype._hasSinglePageContent=function(){var e=this._getAllContent();while(e.length===1&&e[0]instanceof C&&e[0].isA("sap.ui.core.mvc.View")){e=e[0].getContent();}if(e.length===1&&e[0]instanceof C&&e[0].isA("sap.m.Page")){return true;}else{return false;}};n.prototype._hasSingleScrollableContent=function(){var e=this._getAllContent();while(e.length===1&&e[0]instanceof C&&e[0].isA("sap.ui.core.mvc.View")){e=e[0].getContent();}if(e.length===1&&e[0]instanceof C&&e[0].isA(this._scrollContentList)){return true;}return false;};n.prototype._getOffsetX=function(){var F=this.getPlacement(),e=0;if(this._bHorizontalFlip){var p=this._getOpenByDomRef();var H=p!==undefined;var o=H?p.getBoundingClientRect().width:0;e=F===k.PreferredRightOrFlip?Math.abs(o):-Math.abs(o);}var r=sap.ui.getCore().getConfiguration().getRTL();var t=e*(r?-1:1)+this.getOffsetX()*(r?-1:1);return t;};n.prototype._getOffsetY=function(){var F=this.getPlacement(),e=0;if(this._bVerticalFlip){var p=this._getOpenByDomRef();var H=p!==undefined;var o=H?p.getBoundingClientRect().height:0;e=F==="PreferredTopOrFlip"?-Math.abs(o):Math.abs(o);}return e+this.getOffsetY();};n.prototype._calcOffset=function(o){var e=this._getOffsetX(),p=this._getOffsetY();var r=o.split(" ");var o=(parseInt(r[0])+e)+" "+(parseInt(r[1])+p);return o;};n.prototype._calcPlacement=function(){var p=this.getPlacement();var o=this._getOpenByDomRef();switch(p){case k.Auto:this._calcAuto();break;case k.Vertical:case k.VerticalPreferedTop:case k.VerticalPreferredTop:case k.VerticalPreferedBottom:case k.VerticalPreferredBottom:case k.PreferredTopOrFlip:case k.PreferredBottomOrFlip:this._calcVertical();break;case k.Horizontal:case k.HorizontalPreferedLeft:case k.HorizontalPreferredLeft:case k.HorizontalPreferedRight:case k.HorizontalPreferredRight:case k.PreferredRightOrFlip:case k.PreferredLeftOrFlip:this._calcHorizontal();break;}this._bPosCalced=true;var e=this._placements.indexOf(this._oCalcedPos);this.oPopup.setPosition(this._myPositions[e],this._atPositions[e],o,this._calcOffset(this._offsets[e]),"fit");};n.prototype._getDocHeight=function(){var e=document.body,o=document.documentElement;return Math.max(e.scrollHeight,e.offsetHeight,o.clientHeight,o.offsetHeight);};n.prototype._calcVertical=function(){var $=q(this._getOpenByDomRef());var H=$[0]!==undefined;var p=this.getPlacement()===k.VerticalPreferedTop||this.getPlacement()===k.VerticalPreferredTop;var e=this.getPlacement()===k.VerticalPreferedBottom||this.getPlacement()===k.VerticalPreferredBottom;var o=this.getPlacement()===k.PreferredTopOrFlip;var r=this.getPlacement()===k.PreferredBottomOrFlip;var t=H?$[0].getBoundingClientRect().top:0;var u=H?$[0].getBoundingClientRect().height:0;var v=this._getOffsetY();var w=t-this._marginTop+v;var x=this.$().outerHeight();var y=this._getDocHeight()-($.offset().top+u+this._marginBottom+v);if(p&&w>x+this._arrowOffset){this._bVerticalFlip=false;this._oCalcedPos=k.Top;}else if(o){if(w>x+this._arrowOffset){this._bVerticalFlip=false;this._oCalcedPos=k.Top;}else{this._bVerticalFlip=true;this._oCalcedPos=k.Bottom;}}else if(e&&y>x+this._arrowOffset){this._oCalcedPos=k.Bottom;this._bVerticalFlip=false;}else if(r){if(y>x+this._arrowOffset){this._bVerticalFlip=false;this._oCalcedPos=k.Bottom;}else{this._bVerticalFlip=true;this._oCalcedPos=k.Top;}}else if(w>y){this._oCalcedPos=k.Top;}else{this._oCalcedPos=k.Bottom;}};n.prototype._calcHorizontal=function(){var $=q(this._getOpenByDomRef());var H=$[0]!==undefined;var p=this.getPlacement()===k.HorizontalPreferedLeft||this.getPlacement()===k.HorizontalPreferredLeft;var e=this.getPlacement()===k.HorizontalPreferedRight||this.getPlacement()===k.HorizontalPreferredRight;var o=H?$[0].getBoundingClientRect().left:0;var r=H?$[0].getBoundingClientRect().width:0;var t=this._getOffsetX();var u=o-this._marginLeft+t;var v=o+r;var w=this._$window.width()-v-this._marginRight-t;var x=this.$().outerWidth();var y=this.getPlacement()===k.PreferredLeftOrFlip;var z=this.getPlacement()===k.PreferredRightOrFlip;var A=sap.ui.getCore().getConfiguration().getRTL();if(p&&u>x+this._arrowOffset){this._bHorizontalFlip=false;this._oCalcedPos=A?k.Right:k.Left;}else if(y){if(u>x+this._arrowOffset){this._bHorizontalFlip=false;this._oCalcedPos=A?k.Right:k.Left;}else{this._bHorizontalFlip=true;this._oCalcedPos=A?k.Left:k.Right;}}else if(e&&w>x+this._arrowOffset){this._bHorizontalFlip=false;this._oCalcedPos=A?k.Left:k.Right;}else if(z){if(w>x+this._arrowOffset){this._bHorizontalFlip=false;this._oCalcedPos=A?k.Left:k.Right;}else{this._bHorizontalFlip=true;this._oCalcedPos=A?k.Right:k.Left;}}else if(u>w){this._oCalcedPos=A?k.Right:k.Left;}else{this._oCalcedPos=A?k.Left:k.Right;}};n.prototype._calcAuto=function(){if(this._$window.width()>this._$window.height()){if(this._checkHorizontal()){this._calcHorizontal();}else if(this._checkVertical()){this._calcVertical();}else{this._calcBestPos();}}else{if(this._checkVertical()){this._calcVertical();}else if(this._checkHorizontal()){this._calcHorizontal();}else{this._calcBestPos();}}};n.prototype._checkHorizontal=function(){var $=q(this._getOpenByDomRef());var H=$[0]!==undefined;var p=H?$[0].getBoundingClientRect().left:0;var e=H?$[0].getBoundingClientRect().width:0;var o=this._getOffsetX();var r=p-this._marginLeft+o;var t=p+e;var u=this._$window.width()-t-this._marginRight-o;var v=this.$();var w=v.outerWidth()+this._arrowOffset;if((w<=r)||(w<=u)){return true;}};n.prototype._checkVertical=function(){var $=q(this._getOpenByDomRef());var H=$[0]!==undefined;var p=H?$[0].getBoundingClientRect().top:0;var e=H?$[0].getBoundingClientRect().height:0;var o=this._getOffsetY();var t=p-this._marginTop+o;var r=this._getDocHeight()-$.offset().top-e-this._marginBottom-o;var u=this.$();var v=u.outerHeight()+this._arrowOffset;if((v<=t)||(v<=r)){return true;}};n.prototype._calcBestPos=function(){var $=this.$();var H=$.outerHeight();var w=$.outerWidth();var r=sap.ui.getCore().getConfiguration().getRTL();var e=q(this._getOpenByDomRef());var o=e[0]!==undefined;var p=o?e[0].getBoundingClientRect().left:0;var t=o?e[0].getBoundingClientRect().top:0;var u=o?e[0].getBoundingClientRect().width:0;var v=o?e[0].getBoundingClientRect().height:0;var x=this._getOffsetX();var y=this._getOffsetY();var z=t-this._marginTop+y;var A=this._getDocHeight()-e.offset().top-v-this._marginBottom-y;var F=p-this._marginLeft+x;var G=p+u;var J=this._$window.width()-G-this._marginRight-x;var N=H*w;var Q;var U;if((this._$window.height()-this._marginTop-this._marginBottom)>=H){Q=H;}else{Q=this._$window.height()-this._marginTop-this._marginBottom;}if((this._$window.width()-this._marginLeft-this._marginRight)>=w){U=w;}else{U=this._$window.width()-this._marginLeft-this._marginRight;}var V=(Q*(F))/N;var W=(Q*(J))/N;var X=(U*(z))/N;var Y=(U*(A))/N;var Z=Math.max(V,W);var _=Math.max(X,Y);if(Z>_){if(Z===V){this._oCalcedPos=r?k.Right:k.Left;}else if(Z===W){this._oCalcedPos=r?k.Left:k.Right;}}else if(_>Z){if(_===X){this._oCalcedPos=k.Top;}else if(_===Y){this._oCalcedPos=k.Bottom;}}else if(_===Z){if(this._$window.height()>this._$window.width()){if(_===X){this._oCalcedPos=k.Top;}else if(_===Y){this._oCalcedPos=k.Bottom;}}else{if(Z===V){this._oCalcedPos=r?k.Right:k.Left;}else if(Z===W){this._oCalcedPos=r?k.Left:k.Right;}}}};n.outerWidth=function(e,o){if(typeof window.SVGElement!=="undefined"&&e instanceof window.SVGElement){return e.getBoundingClientRect().width;}return q(e).outerWidth(!!o);};n.outerHeight=function(e,o){if(typeof window.SVGElement!=="undefined"&&e instanceof window.SVGElement){return e.getBoundingClientRect().height;}return q(e).outerHeight(!!o);};n.prototype._getPositionParams=function($,e,o,p){var r=window.getComputedStyle($[0]),t=window.getComputedStyle(o[0]),u=this.getDomRef().clientHeight!=this.getDomRef().scrollHeight?i().width:0,v={};v._$popover=$;v._$parent=q(this._getOpenByDomRef());v._$arrow=e;v._$content=o;v._$scrollArea=p;v._$header=$.children(".sapMPopoverHeader");v._$subHeader=$.children(".sapMPopoverSubHeader");v._$footer=$.children(".sapMPopoverFooter");v._fWindowTop=this._$window.scrollTop();v._fWindowRight=this._$window.width();v._fWindowBottom=(n._bIOS7&&D.orientation.landscape&&window.innerHeight)?window.innerHeight:this._$window.height();v._fWindowLeft=this._$window.scrollLeft();v._fDocumentWidth=v._fWindowLeft+v._fWindowRight;v._fDocumentHeight=v._fWindowTop+v._fWindowBottom;v._fArrowHeight=e.outerHeight(true);v._fWidth=n.outerWidth($[0]);v._fWidthInner=v._$scrollArea?(v._$scrollArea.width()+u):0;v._fHeight=n.outerHeight($[0]);v._fHeaderHeight=v._$header.length>0?v._$header.outerHeight(true):0;v._fSubHeaderHeight=v._$subHeader.length>0?v._$subHeader.outerHeight(true):0;v._fFooterHeight=v._$footer.length>0?v._$footer.outerHeight(true):0;v._fOffset=$.offset();v._fOffsetX=this._getOffsetX();v._fOffsetY=this._getOffsetY();v._fMarginTop=v._fWindowTop+this._marginTop;v._fMarginRight=this._marginRight;v._fMarginBottom=this._marginBottom;v._fMarginLeft=v._fWindowLeft+this._marginLeft;v._fPopoverBorderTop=parseFloat(r.borderTopWidth);v._fPopoverBorderRight=parseFloat(r.borderRightWidth);v._fPopoverBorderBottom=parseFloat(r.borderBottomWidth);v._fPopoverBorderLeft=parseFloat(r.borderLeftWidth);v._fContentMarginTop=parseFloat(t.marginTop);v._fContentMarginBottom=parseFloat(t.marginBottom);return v;};n.prototype._recalculateMargins=function(e,p){var r=sap.ui.getCore().getConfiguration().getRTL();switch(e){case k.Left:if(r){p._fMarginLeft=p._$parent.offset().left+n.outerWidth(p._$parent[0],false)+this._arrowOffset-p._fOffsetX;}else{p._fMarginRight=p._fDocumentWidth-p._$parent.offset().left+this._arrowOffset-p._fOffsetX;}break;case k.Right:if(r){p._fMarginRight=p._fDocumentWidth-n.outerWidth(p._$parent[0],false)-p._$parent.offset().left+this._arrowOffset;}else{p._fMarginLeft=p._$parent.offset().left+n.outerWidth(p._$parent[0],false)+this._arrowOffset+p._fOffsetX;}break;case k.Top:p._fMarginBottom=p._fDocumentHeight-p._$parent.offset().top+this._arrowOffset-p._fOffsetY;break;case k.Bottom:p._fMarginTop=p._$parent.offset().top+n.outerHeight(p._$parent[0],false)+this._arrowOffset+p._fOffsetY;break;}};n.prototype._getPopoverPositionCss=function(p){var e,r,t,o,u=p._fDocumentWidth-p._fOffset.left-p._fWidth,v=p._fDocumentHeight-p._fOffset.top-p._fHeight,w=(p._fDocumentWidth-p._fMarginRight-p._fMarginLeft)<p._fWidth,x=(p._fDocumentHeight-p._fMarginTop-p._fMarginBottom)<p._fHeight,y=p._fOffset.left<p._fMarginLeft,z=this.getVerticalScrolling()&&(p._fWidth!==p._fWidthInner)?i().width:0,A=u<(p._fMarginRight+z),F=p._fOffset.top<p._fMarginTop,G=v<p._fMarginBottom,H=sap.ui.getCore().getConfiguration().getRTL();if(w){e=p._fMarginLeft;r=p._fMarginRight;}else{if(y){e=p._fMarginLeft;if(H){r="";}}else if(A){r=p._fMarginRight;e="";}}if(x){t=p._fMarginTop;o=p._fMarginBottom;}else{if(F){t=p._fMarginTop;}else if(G){o=p._fMarginBottom;t="";}}var J={top:t,bottom:o-p._fWindowTop,left:e,right:typeof r==="number"?r-p._fWindowLeft:r};return J;};n.prototype._getContentDimensionsCss=function(p){var o={},A=p._$content.height(),e=this._getMaxContentWidth(p),r=this._getMaxContentHeight(p);r=Math.max(r,0);o["max-width"]=e+"px";if(this.getContentHeight()||(A>r)){o["height"]=Math.min(r,A)+"px";}else{o["height"]="";o["max-height"]=r+"px";}if((A>r)&&this._hasSingleScrollableContent()){o["max-height"]=Math.min(r,A)+"px";}return o;};n.prototype._getMaxContentWidth=function(p){return p._fDocumentWidth-p._fMarginLeft-p._fMarginRight-p._fPopoverBorderLeft-p._fPopoverBorderRight;};n.prototype._getMaxContentHeight=function(p){return p._fDocumentHeight-p._fMarginTop-p._fMarginBottom-p._fHeaderHeight-p._fSubHeaderHeight-p._fFooterHeight-p._fContentMarginTop-p._fContentMarginBottom-p._fPopoverBorderTop-p._fPopoverBorderBottom;};n.prototype._isHorizontalScrollbarNeeded=function(p){return this.getHorizontalScrolling()&&(p._$scrollArea.outerWidth(true)<=p._$content.width());};n.prototype._getArrowOffsetCss=function(e,p){var o,r=sap.ui.getCore().getConfiguration().getRTL();p._fWidth=p._$popover.outerWidth();p._fHeight=p._$popover.outerHeight();if(e===k.Left||e===k.Right){o=p._$parent.offset().top-p._$popover.offset().top-p._fPopoverBorderTop+p._fOffsetY+0.5*(n.outerHeight(p._$parent[0],false)-p._$arrow.outerHeight(false));o=Math.max(o,this._arrowOffsetThreshold);o=Math.min(o,p._fHeight-this._arrowOffsetThreshold-p._$arrow.outerHeight());return{"top":o};}else if(e===k.Top||e===k.Bottom){if(r){o=p._$popover.offset().left+n.outerWidth(p._$popover[0],false)-(p._$parent.offset().left+n.outerWidth(p._$parent[0],false))+p._fPopoverBorderRight+p._fOffsetX+0.5*(n.outerWidth(p._$parent[0],false)-p._$arrow.outerWidth(false));o=Math.max(o,this._arrowOffsetThreshold);o=Math.min(o,p._fWidth-this._arrowOffsetThreshold-p._$arrow.outerWidth(false));return{"right":o};}else{o=p._$parent.offset().left-p._$popover.offset().left-p._fPopoverBorderLeft+p._fOffsetX+0.5*(n.outerWidth(p._$parent[0],false)-p._$arrow.outerWidth(false));o=Math.max(o,this._arrowOffsetThreshold);o=Math.min(o,p._fWidth-this._arrowOffsetThreshold-p._$arrow.outerWidth(false));return{"left":o};}}};n.prototype._getArrowPositionCssClass=function(e){switch(e){case k.Left:return"sapMPopoverArrRight";case k.Right:return"sapMPopoverArrLeft";case k.Top:return"sapMPopoverArrDown";case k.Bottom:return"sapMPopoverArrUp";}};n.prototype._getArrowStyleCssClass=function(p){var A=p._$arrow.position(),F=p._$footer.position(),N=this._getSingleNavContent(),o=this._getSinglePageContent(),e=0;if(N||o){o=o||N.getCurrentPage();if(o){e=o._getAnyHeader().$().outerHeight();}}if((A.top+p._fArrowHeight)<(p._fHeaderHeight+p._fSubHeaderHeight)||((A.top+p._fArrowHeight)<e)){return"sapMPopoverHeaderAlignArr";}else if((A.top<(p._fHeaderHeight+p._fSubHeaderHeight))||(A.top<e)||(p._$footer.length&&((A.top+p._fArrowHeight)>F.top)&&(A.top<F.top))){return"sapMPopoverCrossArr";}else if(p._$footer.length&&(A.top>F.top)){return"sapMPopoverFooterAlignArr";}};n.prototype._getCalculatedPlacement=function(){return this._oCalcedPos||this.getPlacement();};n.prototype._adjustPositionAndArrow=function(){var e=this.oPopup.getOpenState();if(!(e===O.OPEN||e===O.OPENING)){return;}var $=this.$(),o=this.$("arrow"),p=this.$("cont"),r=this.$("scroll"),t=this._getCalculatedPlacement(),u=this._getPositionParams($,o,p,r);this._recalculateMargins(t,u);var v=this._getPopoverPositionCss(u),w=this._getContentDimensionsCss(u),H=this._isHorizontalScrollbarNeeded(u);$.css(v);p.css(w);if(H){r.css("display","block");}if(this.getShowArrow()){var A=this._getArrowOffsetCss(t,u),x=this._getArrowPositionCssClass(t),y,U;o.removeAttr("style");o.css(A);o.addClass(x);if(t===k.Top&&u._$footer&&u._$footer.size()){U=true;}if(t===k.Left||t===k.Right){y=this._getArrowStyleCssClass(u);if(y){o.addClass(y);if(y==="sapMPopoverFooterAlignArr"){U=true;}}}if(U){o.addClass("sapContrast sapContrastPlus");}$.css("overflow","visible");}this._afterAdjustPositionAndArrowHook();};n.prototype._adaptPositionParams=function(){if(this.getShowArrow()){this._marginLeft=10;this._marginRight=10;this._marginBottom=10;this._arrowOffset=18;this._offsets=["0 -18","18 0","0 18","-18 0"];if(this._bUseCompactArrow){this._arrowOffset=9;this._offsets=["0 -9","9 0","0 9","-9 0"];}this._myPositions=["center bottom","begin center","center top","end center"];this._atPositions=["center top","end center","center bottom","begin center"];}else{this._marginTop=0;this._marginLeft=0;this._marginRight=0;this._marginBottom=0;this._arrowOffset=0;this._offsets=["0 0","0 0","0 0","0 0"];this._myPositions=["begin bottom","begin center","begin top","end center"];this._atPositions=["begin top","end center","begin bottom","begin center"];}};n.prototype._afterAdjustPositionAndArrowHook=function(){};n.prototype._isPopupElement=function(o){var p=this._getOpenByDomRef();return!!(q(o).closest(sap.ui.getCore().getStaticAreaRef()).length)||!!(q(o).closest(p).length);};n.prototype._getAnyHeader=function(){if(this.getCustomHeader()){return this.getCustomHeader();}else{if(this.getShowHeader()){this._createInternalHeader();return this._internalHeader;}}};n.prototype._createInternalHeader=function(){if(!this._internalHeader){var t=this;this._internalHeader=new B(this.getId()+"-intHeader");this._setupBarTitleAlignment(this._internalHeader,this.getId()+"_internalHeader");this.setAggregation("_internalHeader",this._internalHeader);this._internalHeader.addEventDelegate({onAfterRendering:function(){t._restoreFocus();}});return true;}else{return false;}};n.prototype._animation=function(A,r){var t=null;var e=function(){r.off("webkitTransitionEnd transitionend");clearTimeout(t);setTimeout(function(){A();});};r.on("webkitTransitionEnd transitionend",e);t=setTimeout(e,this._getAnimationDuration());};n.prototype._getAnimationDuration=function(){return 300;};n.prototype._openAnimation=function(r,e,o){var t=this;setTimeout(function(){r.css("display","block");t._includeScrollWidth();t._animation(function(){if(!t.oPopup||t.oPopup.getOpenState()!==O.OPENING){return;}o();},r);},D.browser.firefox?50:0);};n.prototype._closeAnimation=function(r,e,o){r.addClass("sapMPopoverTransparent");this._animation(function(){o();r.removeClass("sapMPopoverTransparent");},r);};n.prototype._getInitialFocusId=function(){return this.getInitialFocus()||this._getFirstVisibleButtonId()||this._getFirstFocusableContentElementId()||this.getId();};n.prototype._getFirstVisibleButtonId=function(){var o=this.getBeginButton(),e=this.getEndButton(),p="";if(o&&o.getVisible()){p=o.getId();}else if(e&&e.getVisible()){p=e.getId();}return p;};n.prototype._getFirstFocusableContentElementId=function(){var r="";var $=this.$("cont");var F=$.firstFocusableDomRef();if(F){r=F.id;}return r;};n.prototype._restoreFocus=function(){if(this.isOpen()){var F=this._getInitialFocusId(),o=sap.ui.getCore().byId(F),e=(F?window.document.getElementById(F):null);if(o&&o.getFocusDomRef()){o.getFocusDomRef().focus();}else if(!o&&e){e.focus();}}};n.prototype._registerContentResizeHandler=function(o){if(!this._sResizeListenerId){this._sResizeListenerId=f.register(o||this.getDomRef("scroll"),this._fnOrientationChange);}};n.prototype._deregisterContentResizeHandler=function(){if(this._sResizeListenerId){f.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};n.prototype._storeScrollPosition=function(){var $=this.$("cont");if($.length>0){this._oScrollPosDesktop={x:$.scrollLeft(),y:$.scrollTop()};}};n.prototype._restoreScrollPosition=function(){if(!this._oScrollPosDesktop){return;}var $=this.$("cont");if($.length>0){$.scrollLeft(this._oScrollPosDesktop.x).scrollTop(this._oScrollPosDesktop.y);this._oScrollPosDesktop=null;}};n.prototype._repositionOffset=function(){var e=this.oPopup.getOpenState(),o,p;if(!(e===O.OPEN)){return this;}o=this.oPopup._oLastPosition;p=this._placements.indexOf(this.getPlacement());if(p===-1){return this;}if(p<4){o.offset=this._calcOffset(this._offsets[p]);this.oPopup._applyPosition(o);}else{this._calcPlacement();}return this;};n.prototype._getOpenByDomRef=function(){if(!this._oOpenBy){return null;}if(this._oOpenBy instanceof E){return(this._oOpenBy.getPopupAnchorDomRef&&this._oOpenBy.getPopupAnchorDomRef())||this._oOpenBy.getFocusDomRef();}else{return this._oOpenBy;}};n.prototype._getAccessibilityOptions=function(){var A,e={},H=this._getAnyHeader();e.role="dialog";e.modal=this.getProperty("ariaModal");if(this.getShowHeader()&&H&&H.getVisible()){A=Array.prototype.concat(H.getId(),this.getAssociation("ariaLabelledBy",[]));e.labelledby=A.join(' ');}return e;};n.prototype.setPlacement=function(p){this.setProperty("placement",p,true);this._bVerticalFlip=false;this._bHorizontalFlip=false;var e=this._placements.indexOf(p);if(e<=3){this._oCalcedPos=p;}return this;};n.prototype.setTitle=function(t){this.setProperty("title",t,true);if(this._headerTitle){this._headerTitle.setText(t);}else{this._headerTitle=new T(this.getId()+"-title",{text:this.getTitle(),level:"H2"});this._createInternalHeader();this._internalHeader.addContentMiddle(this._headerTitle);}return this;};n.prototype.setBeginButton=function(o){var e=this.getBeginButton();if(e===o){return this;}this._createInternalHeader();this._beginButton=o;if(o){if(e){this._internalHeader.removeAggregation("contentLeft",e,true);}this._internalHeader.addAggregation("contentLeft",o);}else{this._internalHeader.removeContentLeft(e);}return this;};n.prototype.setEndButton=function(o){var e=this.getEndButton();if(e===o){return this;}this._createInternalHeader();this._endButton=o;if(o){if(e){this._internalHeader.removeAggregation("contentRight",e,true);}this._internalHeader.insertAggregation("contentRight",o,1,true);this._internalHeader.invalidate();}else{this._internalHeader.removeContentRight(e);}return this;};n.prototype.setLeftButton=function(v){if(!(v instanceof a)){v=sap.ui.getCore().byId(v);}this.setBeginButton(v);return this.setAssociation("leftButton",v);};n.prototype.setRightButton=function(v){if(!(v instanceof a)){v=sap.ui.getCore().byId(v);}this.setEndButton(v);return this.setAssociation("rightButton",v);};n.prototype.setShowHeader=function(v){if(v===this.getShowHeader()||this.getCustomHeader()){return this;}if(v){if(this._internalHeader){this._internalHeader.$().show();}}else{if(this._internalHeader){this._internalHeader.$().hide();}}this.setProperty("showHeader",v,true);return this;};n.prototype.setModal=function(e,o){if(e===this.getModal()){return this;}this.oPopup.setModal(e,("sapMPopoverBLayer "+(o||"")).trim());this.setProperty("modal",e,true);return this;};n.prototype.setOffsetX=function(v){this.setProperty("offsetX",v,true);return this._repositionOffset();};n.prototype.setOffsetY=function(v){this.setProperty("offsetY",v,true);return this._repositionOffset();};n.prototype.setEnableScrolling=function(v){this.setHorizontalScrolling(v);this.setVerticalScrolling(v);var o=this.getEnableScrolling();if(o===v){return this;}this.setProperty("enableScrolling",v,true);return this;};n.prototype.setVerticalScrolling=function(v){this._bVScrollingEnabled=v;var o=this.getVerticalScrolling();if(o===v){return this;}this.$().toggleClass("sapMPopoverVerScrollDisabled",!v);this.setProperty("verticalScrolling",v,true);if(this._oScroller){this._oScroller.setVertical(v);}return this;};n.prototype.setHorizontalScrolling=function(v){this._bHScrollingEnabled=v;var o=this.getHorizontalScrolling();if(o===v){return this;}this.$().toggleClass("sapMPopoverHorScrollDisabled",!v);this.setProperty("horizontalScrolling",v,true);if(this._oScroller){this._oScroller.setHorizontal(v);}return this;};n.prototype.setResizable=function(v){if(!D.system.desktop){v=false;}return this.setProperty("resizable",v,true);};n.prototype._setAriaModal=function(v){return this.setProperty("ariaModal",v);};n.prototype.getScrollDelegate=function(){return this._oScroller;};n.prototype.setAggregation=function(A,o,e){if(A==="beginButton"||A==="endButton"){var F="set"+A.charAt(0).toUpperCase()+A.slice(1);return this[F](o);}else{return C.prototype.setAggregation.apply(this,arguments);}};n.prototype.getAggregation=function(A,o){if(A==="beginButton"||A==="endButton"){var e=this["_"+A];return e||o||null;}else{return C.prototype.getAggregation.apply(this,arguments);}};n.prototype.destroyAggregation=function(A,e){var o=q(document.activeElement).control(0);if(A==="beginButton"||A==="endButton"){var p=this["_"+A];if(p){p.destroy();this["_"+A]=null;}}else{C.prototype.destroyAggregation.apply(this,arguments);}o&&o.getDomRef()?o.focus():this.focus();return this;};n.prototype.invalidate=function(o){if(this.isOpen()){C.prototype.invalidate.apply(this,arguments);}return this;};n.prototype.addAggregation=function(A,o,e){if(A==="content"){this._bContentChanged=true;}C.prototype.addAggregation.apply(this,arguments);};n.prototype._getAllContent=function(){return this.getContent();};n.prototype._applyContextualSettings=function(){M.prototype._applyContextualSettings.call(this,M._defaultContextualSettings);};b.mixInto(n.prototype);return n;});