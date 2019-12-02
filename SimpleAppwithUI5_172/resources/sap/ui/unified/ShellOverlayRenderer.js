/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var S={};S.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUiUfdShellOvrly");if(c._opening){r.addClass("sapUiUfdShellOvrlyCntntHidden");r.addClass("sapUiUfdShellOvrlyOpening");}if(c._getAnimActive()){r.addClass("sapUiUfdShellOvrlyAnim");}r.writeClasses();if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAccessibilityState(c,{role:"dialog"});}r.write("><span id='",c.getId(),"-focfirst' tabindex='0'></span><div id='",c.getId(),"-inner'>");r.write("<header class='sapUiUfdShellOvrlyHead'>");r.write("<hr class='sapUiUfdShellOvrlyBrand'/>");r.write("<div class='sapUiUfdShellOvrlyHeadCntnt'");if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("role","toolbar");}r.write("><div id='"+c.getId()+"-hdr-center' class='sapUiUfdShellOvrlyHeadCenter'>");S.renderSearch(r,c);r.write("</div>");var a=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified"),C=a.getText("SHELL_OVERLAY_CLOSE");r.write("<a tabindex='0' href='#' id='"+c.getId()+"-close' class='sapUiUfdShellOvrlyHeadClose'");r.writeAttributeEscaped("title",C);if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("role","button");}r.write(">");r.writeEscaped(C);r.write("</a></div></header>");r.write("<div id='"+c.getId()+"-cntnt' class='sapUiUfdShellOvrlyCntnt'>");S.renderContent(r,c);r.write("</div>");r.write("</div><span id='",c.getId(),"-foclast' tabindex='0'></span></div>");};S.renderSearch=function(r,c){var w=c._getSearchWidth();var s="";if(w>0&&c._opening){s="style='width:"+w+"px'";}r.write("<div id='"+c.getId()+"-search' class='sapUiUfdShellOvrlySearch' "+s+"><div>");var o=c.getSearch();if(o){r.renderControl(o);}r.write("</div></div>");};S.renderContent=function(r,c){r.write("<div>");var C=c.getContent();for(var i=0;i<C.length;i++){r.renderControl(C[i]);}r.write("</div>");};return S;},true);
