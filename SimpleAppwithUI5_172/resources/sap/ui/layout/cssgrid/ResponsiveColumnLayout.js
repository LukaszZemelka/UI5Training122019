/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/layout/cssgrid/GridLayoutBase","sap/ui/layout/cssgrid/GridSettings","sap/ui/Device","sap/ui/layout/library"],function(G,a,D){"use strict";var R=G.extend("sap.ui.layout.cssgrid.ResponsiveColumnLayout",{metadata:{library:"sap.ui.layout",properties:{},events:{layoutChange:{parameters:{layout:{type:"string"}}}}}});R.prototype.isResponsive=function(){return true;};R.prototype.onGridAfterRendering=function(g){this._setActiveLayoutClassName(g,false);};R.prototype.getActiveGridSettings=function(){return null;};R.prototype.onGridResize=function(e){if(!e||e.size.width===0){return;}this._setActiveLayoutClassName(e.control,true);};R.prototype._setActiveLayoutClassName=function(g,t){var c=this._sCurrentLayoutClassName,$=g.$(),b=$.parent(),w=b.outerWidth(),r=D.media.getCurrentRange("StdExt",w),C=R.mSizeClasses[r.name];if(c===C){return;}this._sCurrentLayoutClassName=C;$.removeClass(c);$.addClass(C);if(t){this.fireLayoutChange({layout:r.name});}};R.mSizeClasses={"Phone":"sapUiLayoutCSSResponsiveColumnLayoutS","Tablet":"sapUiLayoutCSSResponsiveColumnLayoutM","Desktop":"sapUiLayoutCSSResponsiveColumnLayoutL","LargeDesktop":"sapUiLayoutCSSResponsiveColumnLayoutXL"};return R;});
