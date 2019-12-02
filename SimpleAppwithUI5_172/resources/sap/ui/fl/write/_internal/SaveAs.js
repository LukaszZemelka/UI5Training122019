/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/descriptorRelated/api/DescriptorVariantFactory","sap/ui/fl/transport/TransportSelection","sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory","sap/ui/fl/apply/_internal/ChangesController","sap/ui/fl/Utils","sap/base/Log","sap/base/util/includes","sap/base/util/merge"],function(D,T,a,C,U,L,i,m){"use strict";function _(A,p){var s=A.getSettings();if(p&&p.package&&p.transport&&!s.isAtoEnabled()&&!s.isAtoAvailable()){return Promise.resolve({packageName:p.package,transport:p.transport});}return Promise.resolve({packageName:"$TMP",transport:""});}function b(A,t){if(t){if(t.transport&&t.packageName!=="$TMP"){return A.setTransportRequest(t.transport).then(A.setPackage(t.packageName));}return Promise.resolve();}return Promise.reject();}function c(o){var I=[];o.forEach(function(p){var q=p.getDefinition();I.push(a.createNew(q.changeType,q.content,q.texts));});return Promise.all(I);}function d(o,A){var p={reference:A.getId()};var s=U.createNamespace(p,"changes");o.setNamespace(s);o.setComponent(A.getId());if(A.getVersion()){o.setValidAppVersions({creation:A.getVersion(),from:A.getVersion()});}}function e(A,o){var p=[];A.forEach(function(I){I.replaceHostingIdForTextKey(o.getId(),o.getReference(),I.getContent(),I.getTexts());p.push(o.addDescriptorInlineChange(I));});return Promise.all(p);}function f(A){var t=new T();return t.openTransportSelection(A);}function g(A,p){var s=A.getSettings();if(p&&p.transport&&!s.isAtoEnabled()&&!s.isAtoAvailable()){return Promise.resolve({packageName:A.getPackage(),transport:p.transport});}return f(A);}function h(s){var o=C.getDescriptorFlexControllerInstance(s)._oChangePersistence.getDirtyChanges();o=o.slice();return o;}function j(s){var u=C.getFlexControllerInstance(s)._oChangePersistence.getDirtyChanges();u=u.slice();return u;}function k(s){var F=C.getFlexControllerInstance(s)._oChangePersistence;var o=C.getDescriptorFlexControllerInstance(s)._oChangePersistence;return F===o;}function l(s,A,o){var p=[];if(A){h(s).forEach(function(q){if(i(a.getDescriptorChangeTypes(),q.getDefinition().changeType)){p.push(q);}else{d(q,o);}});}else{j(s).forEach(function(q){d(q,o);});p=h(s);}return p;}function n(s){h(s).forEach(function(o){if(i(a.getDescriptorChangeTypes(),o.getChangeType())){C.getDescriptorFlexControllerInstance(s)._oChangePersistence.deleteChange(o);}});}var S={saveAs:function(p){var A;var o;var q=false;return D.createAppVariant(p).then(function(r){A=m({},r);return _(A,p);}).then(function(t){return b(A,t);}).then(function(){q=k(p.selector);var r=l(p.selector,q,A);return c(r);}).then(function(r){return e(r,A);}).then(function(){return A.submit().catch(function(E){E.messageKey="MSG_SAVE_APP_VARIANT_FAILED";E.saveAsFailed=true;throw E;});}).then(function(r){o=m({},r);if(q){n(p.selector);}var F=C.getFlexControllerInstance(p.selector);return F.saveAll(true).catch(function(E){if(q){n(p.selector);}return this.deleteAppVar({referenceAppId:p.id}).then(function(){E.messageKey="MSG_COPY_UNSAVED_CHANGES_FAILED";throw E;});}.bind(this));}.bind(this)).then(function(){if(!q){n(p.selector);}return o;}).catch(function(E){L.error("the app variant could not be created.",E.message||E.name);throw E;});},deleteAppVar:function(p){var A;return D.loadAppVariant(p.referenceAppId,true).catch(function(E){E.messageKey="MSG_LOAD_APP_VARIANT_FAILED";throw E;}).then(function(o){A=m({},o);return g(A,p);}).then(function(t){if(t){if(t.transport){return A.setTransportRequest(t.transport);}return t;}throw new Error("Transport information could not be determined");}).then(function(){return A.submit().catch(function(E){E.messageKey="MSG_DELETE_APP_VARIANT_FAILED";throw E;});}).catch(function(E){L.error("the app variant could not be deleted.",E.message||E.name);throw E;});}};return S;},true);
