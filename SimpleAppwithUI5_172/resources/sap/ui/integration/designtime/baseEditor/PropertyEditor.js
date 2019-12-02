/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/integration/designtime/baseEditor/util/findClosestInstance"],function(C,f){"use strict";var P=C.extend("sap.ui.integration.designtime.baseEditor.PropertyEditor",{metadata:{properties:{propertyName:{type:"string"}},aggregations:{propertyEditor:{type:"sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor",multiple:false,visibility:"hidden"}},associations:{"editor":{type:"sap.ui.integration.designtime.baseEditor.BaseEditor",multiple:false}},events:{editorChange:{parameters:{editor:{type:"sap.ui.integration.designtime.baseEditor.BaseEditor"},nextEditor:{type:"sap.ui.integration.designtime.baseEditor.BaseEditor"}}}}},_bEditorAutoDetect:false,constructor:function(){C.prototype.constructor.apply(this,arguments);if(this.getEditor()){this._initPropertyEditor(this.getEditor());}else{this._bEditorAutoDetect=true;}this.setPropertyName=function(){throw new Error("Property `propertyName` cannot be changed after initialisation");};this._propagationListener=this._propagationListener.bind(this);this.attachEditorChange(this._onEditorChange,this);},renderer:function(r,c){r.renderControl(c.getAggregation("propertyEditor"));}});P.prototype.getEditor=function(){return sap.ui.getCore().byId(this.getAssociation('editor'));};P.prototype.setEditor=function(e){var E=this.getEditor();this.setAssociation('editor',e);var n=this.getEditor();this.fireEditorChange({editor:E,nextEditor:n});};P.prototype._onEditorChange=function(e){var n=e.getParameter('nextEditor');if(n){this._initPropertyEditor(n);}};P.prototype._initPropertyEditor=function(e){e.getPropertyEditor(this.getPropertyName()).then(function(p){if(this.getEditor()===e){this.setAggregation("propertyEditor",p);}}.bind(this));};P.prototype._propagationListener=function(){var e=f(this.getParent(),"sap.ui.integration.designtime.baseEditor.BaseEditor");if(e){this.setEditor(e);this.removePropagationListener(this._propagationListener);}};P.prototype.setParent=function(p){C.prototype.setParent.apply(this,arguments);if(this._bEditorAutoDetect){var e=f(p,"sap.ui.integration.designtime.baseEditor.BaseEditor");if(e){this.setEditor(e);}else{this.addPropagationListener(this._propagationListener);}}};return P;});
