/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/includes","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/apply/_internal/ChangesController","sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory","sap/ui/fl/write/_internal/SaveAs","sap/ui/fl/write/api/FeaturesAPI","sap/base/util/restricted/_omit"],function(i,J,C,D,S,F,_){"use strict";function a(c){return(c._getMap&&i(D.getDescriptorChangeTypes(),c._getMap().changeType))||(c.getChangeType&&i(D.getDescriptorChangeTypes(),c.getChangeType()));}function h(p){p.includeCtrlVariants=true;p.invalidateCache=false;return P._getUIChanges(p).then(function(c){return c.length>0;});}function b(p){p.includeCtrlVariants=true;p.invalidateCache=false;return P._getUIChanges(p).then(function(c){return c.some(function(o){return o.packageName==="$TMP"||o.packageName==="";});});}var P={hasHigherLayerChanges:function(p){return C.getFlexControllerInstance(p.selector).hasHigherLayerChanges(_(p,"selector"));},save:function(p){var f=C.getFlexControllerInstance(p.selector);var d=C.getDescriptorFlexControllerInstance(p.selector);p.invalidateCache=true;return f.saveAll(p.skipUpdateCache).then(d.saveAll.bind(d,p.skipUpdateCache)).then(P._getUIChanges.bind(null,_(p,"skipUpdateCache")));},saveAs:function(p){var f=C.getDescriptorFlexControllerInstance(p.selector);p.reference=f.getComponentName();return S.saveAs(p);},deleteAppVariant:function(p){var f=C.getDescriptorFlexControllerInstance(p.selector);p.referenceAppId=f.getComponentName();return S.deleteAppVar(p);},getResetAndPublishInfo:function(p){return Promise.all([h(p),b(p),F.isPublishAvailable()]).then(function(r){var f={isResetEnabled:r[0],isPublishEnabled:r[1]};var c=r[2];var I=!f.isResetEnabled||(c&&!f.isPublishEnabled);if(I){return C.getFlexControllerInstance(p.selector).getResetAndPublishInfo(p).then(function(R){f.isResetEnabled=f.isResetEnabled||R.isResetEnabled;f.isPublishEnabled=f.isPublishEnabled||R.isPublishEnabled;return f;});}return f;});},reset:function(p){var A=C.getAppComponentForSelector(p.selector);var f=C.getFlexControllerInstance(A);var d=C.getDescriptorFlexControllerInstance(A);var c=[p.layer,p.generator,A,p.selectorIds,p.changeTypes];return f.resetChanges.apply(f,c).then(d.resetChanges.bind.apply(d.resetChanges,[d].concat(c)));},publish:function(p){p.styleClass=p.styleClass||"";var A=C.getAppComponentForSelector(p.selector);return C.getFlexControllerInstance(A)._oChangePersistence.transportAllUIChanges({},p.styleClass,p.layer,p.appVariantDescriptors);},add:function(p){if(a(p.change)){return p.change.store();}var A=C.getAppComponentForSelector(p.selector);return C.getFlexControllerInstance(A).addPreparedChange(p.change,A);},remove:function(p){if(!p.selector){throw new Error("An invalid selector was passed so change could not be removed with id: "+p.change.getId());}var A=C.getAppComponentForSelector(p.selector);if(!A){throw new Error("Invalid application component for selector, change could not be removed with id: "+p.change.getId());}if(a(p.change)){var d=C.getDescriptorFlexControllerInstance(A);d.deleteChange(p.change,A);return;}var e=J.bySelector(p.change.getSelector(),A);var f=C.getFlexControllerInstance(A);if(e){f._removeChangeFromControl(e,p.change,J);}f.deleteChange(p.change,A);},_getUIChanges:function(p){if(p.layer){p.currentLayer=p.layer;}return C.getFlexControllerInstance(p.selector)._oChangePersistence.getChangesForComponent(_(p,["invalidateCache","selector"]),p.invalidateCache);}};return P;},true);