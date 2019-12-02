/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/plugin/DragDrop","sap/ui/dt/plugin/ElementMover"],function(D,E){"use strict";var C=D.extend("sap.ui.dt.plugin.ControlDragDrop",{metadata:{library:"sap.ui.dt",properties:{draggableTypes:{type:"string[]",defaultValue:["sap.ui.core.Element"]},elementMover:{type:"any"},insertAfterElement:{type:"boolean",defaultValue:false}},associations:{}}});var d="sapUiDtOverlayDropZone";C.prototype.init=function(){D.prototype.init.apply(this,arguments);this.setElementMover(new E());};C.prototype.setElementMover=function(n){var o=this.getElementMover();if(o!==n){if(o){o.destroy();}this.setProperty("elementMover",n);}};C.prototype.setDraggableTypes=function(a){this.getElementMover().setMovableTypes(a);return this.setProperty("draggableTypes",a);};C.prototype.registerElementOverlay=function(o){var e=o.getElement();this.getElementMover().checkMovable(o).then(function(m){if(this.getElementMover().isMovableType(e)&&m){o.setMovable(true);}if(this.oDraggedElement){this.getElementMover().activateTargetZonesFor(o,d);}D.prototype.registerElementOverlay.call(this,o);}.bind(this));};C.prototype.deregisterElementOverlay=function(o){D.prototype.deregisterElementOverlay.apply(this,arguments);o.setMovable(false);if(this.oDraggedElement){this.getElementMover().deactivateTargetZonesFor(o,d);}};C.prototype.getDraggedOverlay=function(){return this._oDraggedOverlay;};C.prototype.onDragStart=function(o){this._oDraggedOverlay=o;this.getElementMover().setMovedOverlay(o);this.getElementMover().activateAllValidTargetZones(this.getDesignTime(),d);};C.prototype.onDragEnd=function(){delete this._oPreviousTarget;this.getElementMover().deactivateAllTargetZones(this.getDesignTime(),d);delete this._oDraggedOverlay;this.getElementMover().setMovedOverlay(null);};C.prototype.onDragEnter=function(t){var o=this.getDraggedOverlay();if(t.getElement()!==o.getElement()&&t!==this._oPreviousTarget){this.getElementMover().repositionOn(o,t,this.getInsertAfterElement());}this._oPreviousTarget=t;};C.prototype.onAggregationDragEnter=function(a){delete this._oPreviousTarget;var o=this.getDraggedOverlay();this.getElementMover().insertInto(o,a,this.getInsertAfterElement());};return C;},true);
