/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/uxap/library"],function(l){"use strict";return{name:{singular:function(){return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("LAYOUT_CONTROL_NAME");},plural:function(){return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("LAYOUT_CONTROL__PLURAL");}},aggregations:{sections:{domRef:function(e){return e.$("sectionsContainer").get(0);},childNames:{singular:function(){return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_CONTROL_NAME");},plural:function(){return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_CONTROL_NAME_PLURAL");}},actions:{move:"moveControls"},beforeMove:function(O){if(O){O._suppressScroll();}},afterMove:function(O){if(O){O.attachEventOnce("onAfterRenderingDOMReady",function(){O._resumeScroll(false);});}}},headerContent:{domRef:function(e){return e._getHeaderContent()?e._getHeaderContent().getDomRef():null;},actions:{move:function(e){if(!e||e.getMetadata().getName()!=='sap.uxap.ObjectPageSection'){return"moveControls";}}}},footer:{propagateMetadata:function(e){if(e.isA("sap.m.IBar")){return{isVisible:function(e){return e.getParent().isA("sap.uxap.ObjectPageLayout")&&e.getParent().getShowFooter();}};}}}},scrollContainers:[{domRef:"> .sapUxAPObjectPageWrapper",aggregations:function(e){if((!e._hasDynamicTitle()&&e.getAlwaysShowContentHeader())||(e._hasDynamicTitle()&&(e.getPreserveHeaderStateOnScroll()||e._bPinned))){return["sections"];}else{return["sections","headerContent"];}}},{domRef:function(e){return e.$("vertSB-sb").get(0);}}],templates:{create:"sap/uxap/designtime/ObjectPageLayout.create.fragment.xml"}};},false);
