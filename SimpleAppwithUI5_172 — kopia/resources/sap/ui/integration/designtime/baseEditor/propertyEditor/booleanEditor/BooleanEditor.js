/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/m/CheckBox"],function(B,C){"use strict";var a=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor",{constructor:function(){B.prototype.constructor.apply(this,arguments);this._oInput=new C({selected:"{value}"});this._oInput.attachSelect(function(e){this.firePropertyChanged(e.getParameter('selected'));},this);this.addContent(this._oInput);},renderer:B.getMetadata().getRenderer().render});return a;});
