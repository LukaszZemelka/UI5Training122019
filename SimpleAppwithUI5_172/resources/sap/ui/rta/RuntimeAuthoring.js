/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/rta/toolbar/Fiori","sap/ui/rta/toolbar/Standalone","sap/ui/rta/toolbar/Personalization","sap/ui/dt/DesignTime","sap/ui/dt/Overlay","sap/ui/rta/command/Stack","sap/ui/rta/command/CommandFactory","sap/ui/rta/command/LREPSerializer","sap/ui/rta/plugin/Rename","sap/ui/rta/plugin/DragDrop","sap/ui/rta/plugin/RTAElementMover","sap/ui/rta/plugin/CutPaste","sap/ui/rta/plugin/Remove","sap/ui/rta/plugin/CreateContainer","sap/ui/rta/plugin/additionalElements/AdditionalElementsPlugin","sap/ui/rta/plugin/additionalElements/AddElementsDialog","sap/ui/rta/plugin/additionalElements/AdditionalElementsAnalyzer","sap/ui/rta/plugin/Combine","sap/ui/rta/plugin/Split","sap/ui/rta/plugin/Selection","sap/ui/rta/plugin/Settings","sap/ui/rta/plugin/Stretch","sap/ui/rta/plugin/ControlVariant","sap/ui/dt/plugin/ToolHooks","sap/ui/dt/plugin/ContextMenu","sap/ui/dt/plugin/TabHandling","sap/ui/rta/Utils","sap/ui/dt/Util","sap/ui/dt/ElementUtil","sap/ui/fl/Utils","sap/ui/fl/LayerUtils","sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/write/api/PersistenceWriteAPI","sap/m/MessageBox","sap/m/MessageToast","sap/ui/rta/util/PopupManager","sap/ui/core/BusyIndicator","sap/ui/dt/DOMUtil","sap/ui/rta/util/StylesLoader","sap/ui/rta/appVariant/Feature","sap/ui/Device","sap/ui/rta/service/index","sap/ui/rta/util/ServiceEventBus","sap/ui/dt/OverlayRegistry","sap/base/strings/capitalize","sap/base/util/UriParameters","sap/ui/performance/Measurement","sap/base/Log","sap/ui/events/KeyCodes","sap/ui/rta/util/validateFlexEnabled"],function(q,M,F,S,P,D,O,C,a,L,R,b,c,d,e,f,A,g,h,i,j,k,l,m,n,T,o,p,U,r,E,s,t,u,v,w,x,y,B,z,G,H,I,J,K,N,Q,V,W,X,Y,Z){"use strict";var $="STARTING";var _="STARTED";var a1="STOPPED";var b1="FAILED";var c1="SERVICE_STARTING";var d1="SERVICE_STARTED";var e1="SERVICE_FAILED";var f1=M.extend("sap.ui.rta.RuntimeAuthoring",{metadata:{library:"sap.ui.rta",associations:{rootControl:{type:"sap.ui.base.ManagedObject"}},properties:{customFieldUrl:"string",showCreateCustomField:"boolean",showToolbars:{type:"boolean",defaultValue:true},triggeredFromDialog:{type:"boolean",defaultValue:false},showWindowUnloadDialog:{type:"boolean",defaultValue:true},commandStack:{type:"any"},plugins:{type:"any",defaultValue:{}},flexSettings:{type:"object",defaultValue:{layer:"CUSTOMER",developerMode:true}},mode:{type:"string",defaultValue:"adaptation"},metadataScope:{type:"string",defaultValue:"default"},validateAppVersion:{type:"boolean",defaultValue:false}},events:{start:{parameters:{editablePluginsCount:{type:"int"}}},stop:{},failed:{},selectionChange:{parameters:{selection:{type:"sap.ui.dt.Overlay[]"}}},modeChanged:{},undoRedoStackModified:{}}},_sAppTitle:null,_dependents:null,_sStatus:a1,constructor:function(){M.apply(this,arguments);this._dependents={};this._mServices={};this._mCustomServicesDictinary={};this.iEditableOverlaysCount=0;this.addDependent(new y(),'popupManager');if(this.getShowToolbars()){this.getPopupManager().attachOpen(this.onPopupOpen,this);this.getPopupManager().attachClose(this.onPopupClose,this);}if(window.parent!==window){this.startService('receiver');}if(sap.ui.version.includes("-SNAPSHOT")){this.attachStart(Z.bind(null,this));}},_RESTART:{NOT_NEEDED:"no restart",VIA_HASH:"without max layer",RELOAD_PAGE:"reload"}});f1.prototype.getDefaultPlugins=function(){if(!this._mDefaultPlugins){var j1=new a({flexSettings:this.getFlexSettings()});this._mDefaultPlugins={};this._mDefaultPlugins["selection"]=new k({commandFactory:j1,multiSelectionRequiredPlugins:[i.getMetadata().getName(),e.getMetadata().getName()],elementEditableChange:this._onElementEditableChange.bind(this)});var k1=new c({commandFactory:j1});this._mDefaultPlugins["dragDrop"]=new b({elementMover:k1,commandFactory:j1,dragStarted:this._handleStopCutPaste.bind(this)});this._mDefaultPlugins["rename"]=new R({commandFactory:j1,editable:this._handleStopCutPaste.bind(this)});this._mDefaultPlugins["additionalElements"]=new A({commandFactory:j1,analyzer:h,dialog:new g()});this._mDefaultPlugins["createContainer"]=new f({commandFactory:j1});this._mDefaultPlugins["remove"]=new e({commandFactory:j1});this._mDefaultPlugins["cutPaste"]=new d({elementMover:k1,commandFactory:j1});this._mDefaultPlugins["settings"]=new l({commandFactory:j1});this._mDefaultPlugins["combine"]=new i({commandFactory:j1});this._mDefaultPlugins["split"]=new j({commandFactory:j1});this._mDefaultPlugins["contextMenu"]=new o();this._mDefaultPlugins["tabHandling"]=new p();this._mDefaultPlugins["stretch"]=new m();this._mDefaultPlugins["controlVariant"]=new n({commandFactory:j1});this._mDefaultPlugins["toolHooks"]=new T();}return q.extend({},this._mDefaultPlugins);};f1.prototype.addDependent=function(j1,k1,l1){l1=typeof l1==='undefined'?true:!!l1;if(!(k1 in this._dependents)){if(k1&&l1){this['get'+Q(k1,0)]=this.getDependent.bind(this,k1);}this._dependents[k1||j1.getId()]=j1;}else{throw r.createError("RuntimeAuthoring#addDependent",r.printf("Can't add dependency with same key '{0}'",k1),"sap.ui.rta");}};f1.prototype.getDependent=function(j1){return this._dependents[j1];};f1.prototype.getDependents=function(){return this._dependents;};f1.prototype.removeDependent=function(j1){delete this._dependents[j1];};f1.prototype._destroyDefaultPlugins=function(j1){for(var k1 in this._mDefaultPlugins){var l1=this._mDefaultPlugins[k1];if(l1&&!l1.bIsDestroyed){if(!j1||j1[k1]!==l1){l1.destroy();}}}if(!j1){this._mDefaultPlugins=null;}};f1.prototype.onPopupOpen=function(j1){if(j1.getParameters()instanceof sap.m.Dialog&&this.getToolbar()instanceof F){this.getToolbar().setColor("contrast");}this.getToolbar().bringToFront();};f1.prototype.onPopupClose=function(j1){if(j1.getParameters()instanceof sap.m.Dialog){this.getToolbar().setColor();}};f1.prototype.setPlugins=function(j1){if(this._oDesignTime){throw new Error('Cannot replace plugins: runtime authoring already started');}this.setProperty("plugins",j1);};f1.prototype.setFlexSettings=function(j1){var k1=V.fromQuery(window.location.search);var l1=k1.get("sap-ui-layer");j1=q.extend({},this.getFlexSettings(),j1);if(l1){j1.layer=l1.toUpperCase();}if(j1.scenario||j1.baseId){var m1=s.buildLrepRootNamespace(j1.baseId,j1.scenario,j1.projectId);j1.rootNamespace=m1;j1.namespace=m1+"changes/";}U.setRtaStyleClassName(j1.layer);this.setProperty("flexSettings",j1);};f1.prototype.getLayer=function(){return this.getFlexSettings().layer;};f1.prototype.getRootControlInstance=function(){if(!this._oRootControl){this._oRootControl=E.getElementInstance(this.getRootControl());}return this._oRootControl;};f1.prototype._getTextResources=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");};f1.prototype.start=function(){this._sStatus=$;var j1;var k1;var l1=this.getRootControlInstance();if(!this._oDesignTime){if(!l1){k1=new Error("Root control not found");X.error(k1);return Promise.reject(k1);}if(this.getValidateAppVersion()&&!s.isCorrectAppVersionFormat(s.getAppVersionFromManifest(s.getAppComponentForControl(l1).getManifest()))){k1=this._getTextResources().getText("MSG_INCORRECT_APP_VERSION_ERROR");X.error(k1);return Promise.reject(k1);}return this._handleHigherLayerChangesOnStart().then(function(m1){if(m1){return Promise.reject("Reload triggered");}if(!this.getPlugins()||!Object.keys(this.getPlugins()).length){this.setPlugins(this.getDefaultPlugins());}this._destroyDefaultPlugins(this.getPlugins());Object.keys(this.getPlugins()).forEach(function(p1){if(this.getPlugins()[p1].attachElementModified){this.getPlugins()[p1].attachElementModified(this._handleElementModified,this);}}.bind(this));if(this.getPlugins()["settings"]){this.getPlugins()["settings"].setCommandStack(this.getCommandStack());}this._oSerializer=new L({commandStack:this.getCommandStack(),rootControl:this.getRootControl()});var n1=Object.keys(this.getPlugins());var o1=n1.map(function(p1){return this.getPlugins()[p1];},this);j1=new Promise(function(p1,q1){W.start("rta.dt.startup","Measurement of RTA: DesignTime start up");this._oDesignTime=new D({scope:this.getMetadataScope(),plugins:o1});this._oDesignTime.addRootElement(this._oRootControl);q(O.getOverlayContainer()).addClass("sapUiRta");if(this.getLayer()==="USER"){q(O.getOverlayContainer()).addClass("sapUiRtaPersonalize");}else{q("body").addClass("sapUiRtaMode");}this._oDesignTime.getSelectionManager().attachChange(function(r1){this.fireSelectionChange({selection:r1.getParameter("selection")});},this);this._oDesignTime.attachEventOnce("synced",function(){p1();W.end("rta.dt.startup","Measurement of RTA: DesignTime start up");},this);this._oDesignTime.attachEventOnce("syncFailed",function(r1){q1(r1.getParameter("error"));});}.bind(this));this._oldUnloadHandler=window.onbeforeunload;window.onbeforeunload=this._onUnload.bind(this);}.bind(this)).then(function(){var m1={selector:this.getRootControlInstance(),layer:this.getLayer()};return v.getResetAndPublishInfo(m1).then(function(n1){this.bInitialResetEnabled=n1.isResetEnabled;this.bInitialPublishEnabled=n1.isPublishEnabled;}.bind(this));}.bind(this)).then(function(){if(this.getShowToolbars()){return this._getPublishAndAppVariantSupportVisibility().then(function(m1){var n1=m1[0];var o1=m1[1];this._createToolsMenu(n1,o1);}.bind(this));}}.bind(this)).then(function(){this._onStackModified();}.bind(this)).then(function(){G.loadStyles('InPageStyles').then(function(m1){var n1=m1.replace(/%scrollWidth%/g,z.getScrollbarWidth()+'px');z.insertStyles(n1,O.getOverlayContainer().get(0));});}).then(function(){return j1;}).then(function(){this.getPopupManager().setRta(this);if(this.getShowToolbars()){return this.getToolbar().show();}}.bind(this)).then(function(){if(I.browser.name==="ff"){q(document).on('contextmenu',g1);}}).then(function(){this.fnKeyDown=this._onKeyDown.bind(this);q(document).on("keydown",this.fnKeyDown);var m1=N.getOverlay(this.getRootControl());this._$RootControl=m1.getAssociatedDomRef();if(this._$RootControl){this._$RootControl.addClass("sapUiRtaRoot");}}.bind(this)).then(function(){this._sStatus=_;this.fireStart({editablePluginsCount:this.iEditableOverlaysCount});}.bind(this)).catch(function(k1){if(k1!=="Reload triggered"){this._sStatus=b1;this.fireFailed(k1);}if(k1){this.destroy();return Promise.reject(k1);}}.bind(this));}};function g1(){return false;}f1.prototype._getPublishAndAppVariantSupportVisibility=function(){return u.isPublishAvailable().then(function(j1){var k1=H.isPlatFormEnabled(this.getRootControlInstance(),this.getLayer(),this._oSerializer);return[j1,j1&&k1];}.bind(this));};var h1=function(j1){B.hide();var k1="";if(j1.messages&&Array.isArray(j1.messages)&&j1.messages.length>0){k1=j1.messages.reduce(function(n1,o1){return n1.concat(o1.severity==="Error"?o1.text+"\n":"");},k1);}if(!k1){k1=j1.stack||j1.message||j1.status||j1;}var l1=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");X.error("Failed to transfer runtime adaptation changes to layered repository",k1);var m1=l1.getText("MSG_LREP_TRANSFER_ERROR")+"\n"+l1.getText("MSG_ERROR_REASON",k1);w.error(m1,{styleClass:U.getRtaStyleClassName()});};f1.prototype.setCommandStack=function(j1){var k1=this.getProperty("commandStack");if(k1){k1.detachModified(this._onStackModified,this);}if(this._oInternalCommandStack){this._oInternalCommandStack.destroy();delete this._oInternalCommandStack;}var l1=this.setProperty("commandStack",j1);if(j1){j1.attachModified(this._onStackModified,this);}if(this.getPlugins()&&this.getPlugins()["settings"]){this.getPlugins()["settings"].setCommandStack(j1);}return l1;};f1.prototype.getCommandStack=function(){var j1=this.getProperty("commandStack");if(!j1){j1=new C();this._oInternalCommandStack=j1;this.setCommandStack(j1);}return j1;};f1.prototype._onStackModified=function(){var j1=this.getCommandStack();var k1=j1.canUndo();var l1=j1.canRedo();if(this.getShowToolbars()){this.getToolbar().setUndoRedoEnabled(k1,l1);this.getToolbar().setPublishEnabled(this.bInitialPublishEnabled||k1);this.getToolbar().setRestoreEnabled(this.bInitialResetEnabled||k1);}this.fireUndoRedoStackModified();};f1.prototype._closeToolbar=function(){if(this.getShowToolbars()&&this.getToolbar){return this.getToolbar().hide();}};f1.prototype.getSelection=function(){if(this._oDesignTime){return this._oDesignTime.getSelectionManager().get();}return[];};f1.prototype.stop=function(j1,k1){return((k1)?Promise.resolve(this._RESTART.NOT_NEEDED):this._handleReloadOnExit()).then(function(l1){return((j1)?Promise.resolve():this._serializeToLrep(this)).then(this._closeToolbar.bind(this)).then(function(){this.fireStop();if(l1!==this._RESTART.NOT_NEEDED){this._removeMaxLayerParameter();if(l1===this._RESTART.RELOAD_PAGE){this._reloadPage();}}}.bind(this));}.bind(this)).catch(h1).then(function(){this._sStatus=a1;q("body").removeClass("sapUiRtaMode");}.bind(this));};f1.prototype.restore=function(){this._onRestore();};f1.prototype.transport=function(){return this._onTransport();};f1.prototype.undo=function(){return this._onUndo();};f1.prototype.redo=function(){return this._onRedo();};f1.prototype.canUndo=function(){return this.getCommandStack().canUndo();};f1.prototype.canRedo=function(){return this.getCommandStack().canRedo();};f1.prototype._onKeyDown=function(j1){var k1=I.os.macintosh;var l1=O.getOverlayContainer().get(0).contains(document.activeElement);var m1=this.getShowToolbars()&&this.getToolbar().getDomRef().contains(document.activeElement);var n1=false;q(".sapUiDtContextMenu").each(function(r1,s1){if(s1.contains(document.activeElement)){n1=true;}});var o1=document.body===document.activeElement;var p1=q(document.activeElement).parents('.sapUiRtaEditableField').length>0;if((l1||m1||n1||o1)&&!p1){var q1=k1?j1.metaKey:j1.ctrlKey;if(j1.keyCode===Y.Z&&j1.shiftKey===false&&j1.altKey===false&&q1===true){this._onUndo().then(j1.stopPropagation.bind(j1));}else if(((k1&&j1.keyCode===Y.Z&&j1.shiftKey===true)||(!k1&&j1.keyCode===Y.Y&&j1.shiftKey===false))&&j1.altKey===false&&q1===true){this._onRedo().then(j1.stopPropagation.bind(j1));}}};f1.prototype._onUnload=function(){var j1=this.getCommandStack();var k1=j1.canUndo()||j1.canRedo();if(k1&&this.getShowWindowUnloadDialog()){var l1=this._getTextResources().getText("MSG_UNSAVED_CHANGES");return l1;}window.onbeforeunload=this._oldUnloadHandler;};f1.prototype._serializeToLrep=function(){return this._oSerializer.saveCommands();};f1.prototype._onUndo=function(){this._handleStopCutPaste();return this.getCommandStack().undo();};f1.prototype._onRedo=function(){this._handleStopCutPaste();return this.getCommandStack().redo();};f1.prototype._createToolsMenu=function(j1,k1){if(!this.getDependent('toolbar')){var l1;if(this.getLayer()==="USER"){l1=P;}else if(U.getFiori2Renderer()){l1=F;}else{l1=S;}if(this.getLayer()==="USER"){this.addDependent(new l1({textResources:this._getTextResources(),exit:this.stop.bind(this,false,true),restore:this._onRestore.bind(this)}),'toolbar');}else{this.addDependent(new l1({modeSwitcher:this.getMode(),publishVisible:j1,textResources:this._getTextResources(),exit:this.stop.bind(this,false,false),transport:this._onTransport.bind(this),restore:this._onRestore.bind(this),undo:this._onUndo.bind(this),redo:this._onRedo.bind(this),modeChange:this._onModeChange.bind(this),manageApps:H.onGetOverview.bind(null,true,this.getLayer()),appVariantOverview:this._onGetAppVariantOverview.bind(this),saveAs:H.onSaveAs.bind(null,true,true,this.getLayer(),null)}),'toolbar');}this.getToolbar().setPublishEnabled(this.bInitialPublishEnabled);this.getToolbar().setRestoreEnabled(this.bInitialResetEnabled);var m1;if(k1){this.getToolbar().getControl('saveAs').setVisible(k1);m1=H.isOverviewExtended();if(m1){this.getToolbar().getControl('appVariantOverview').setVisible(k1);}else{this.getToolbar().getControl('manageApps').setVisible(k1);}H.isManifestSupported().then(function(n1){if(m1){this.getToolbar().getControl('appVariantOverview').setEnabled(n1);}else{this.getToolbar().getControl('manageApps').setEnabled(n1);}this.getToolbar().getControl('saveAs').setEnabled(n1);}.bind(this));}}};f1.prototype._onGetAppVariantOverview=function(j1){var k1=j1.getParameter("item");var l1=k1.getId()==='keyUser';return H.onGetOverview(l1,this.getLayer());};f1.prototype.destroy=function(){q.map(this._dependents,function(j1,k1){this.removeDependent(k1);j1.destroy(true);}.bind(this));Object.keys(this._mServices).forEach(function(j1){this.stopService(j1);},this);if(this._oDesignTime){this._oDesignTime.destroy();this._oDesignTime=null;q(document).off("keydown",this.fnKeyDown);this._destroyDefaultPlugins();this.setPlugins(null);}if(this._$RootControl){this._$RootControl.removeClass("sapUiRtaRoot");}this.setCommandStack(null);if(this._oServiceEventBus){this._oServiceEventBus.destroy();}if(I.browser.name==="ff"){q(document).off("contextmenu",g1);}window.onbeforeunload=this._oldUnloadHandler;M.prototype.destroy.apply(this,arguments);};f1.prototype._onTransport=function(){this._handleStopCutPaste();B.show(500);return this._serializeToLrep().then(function(){B.hide();var j1=s.isApplicationVariant(this._oRootControl)&&!s.isVariantByStartupParameter(this._oRootControl);return((j1)?H.getAppVariantDescriptor(this._oRootControl):Promise.resolve()).then(function(k1){var l1=[];if(k1){l1.push(k1);}return v.publish({selector:this.getRootControlInstance(),styleClass:U.getRtaStyleClassName(),layer:this.getLayer(),appVariantDescriptors:l1}).then(function(m1){if(m1!=="Error"&&m1!=="Cancel"){this._showMessageToast("MSG_TRANSPORT_SUCCESS");}}.bind(this));}.bind(this));}.bind(this))['catch'](h1);};f1.prototype._deleteChanges=function(){var j1=this.getRootControlInstance();var k1=s.getAppComponentForControl(j1);return v.reset({selector:k1,layer:this.getLayer(),generator:"Change.createInitialFileContent"}).then(function(){this._reloadPage();}.bind(this)).catch(function(l1){if(l1!=="cancel"){U._showMessageBox(w.Icon.ERROR,"HEADER_RESTORE_FAILED","MSG_RESTORE_FAILED",l1);}});};f1.prototype._reloadPage=function(){window.location.reload();};f1.prototype._showMessageToast=function(j1){var k1=this._getTextResources().getText(j1);x.show(k1);};f1.needsRestart=function(j1){var k1=!!window.sessionStorage.getItem("sap.ui.rta.restart."+j1);return k1;};f1.enableRestart=function(j1){window.sessionStorage.setItem("sap.ui.rta.restart."+j1,true);};f1.disableRestart=function(j1){window.sessionStorage.removeItem("sap.ui.rta.restart."+j1);};f1.prototype._onRestore=function(){var j1=this.getLayer()==="USER"?this._getTextResources().getText("FORM_PERS_RESET_MESSAGE_PERSONALIZATION"):this._getTextResources().getText("FORM_PERS_RESET_MESSAGE");var k1=this.getLayer()==="USER"?this._getTextResources().getText("BTN_RESTORE"):this._getTextResources().getText("FORM_PERS_RESET_TITLE");var l1=function(m1){if(m1==="OK"){f1.enableRestart(this.getLayer());this._deleteChanges();this.getCommandStack().removeAllCommands();}}.bind(this);this._handleStopCutPaste();w.confirm(j1,{icon:w.Icon.WARNING,title:k1,onClose:l1,styleClass:U.getRtaStyleClassName()});};f1.prototype._scheduleRenameOnCreatedContainer=function(j1,k1){var l1=function(p1){var q1=this.getPlugins()["createContainer"].getCreatedContainerId(j1,p1.getElement().getId());var r1=N.getOverlay(q1);r1.setSelected(true);this.getPlugins()["rename"].startEdit(r1);};var m1=function(p1){var q1=p1.getSource();if(q1.getGeometry()&&q1.getGeometry().visible){l1.call(this,q1);q1.detachEvent('geometryChanged',m1,this);}};var n1=function(p1){if(!p1.getGeometry()||!p1.getGeometry().visible){p1.attachEvent('geometryChanged',m1,this);}else{l1.call(this,p1);}};var o1=function(p1){var q1=p1.getParameter("elementOverlay");if(q1.getElement().getId()===k1){this._oDesignTime.detachEvent("elementOverlayCreated",o1,this);if(q1.isRendered()){n1.call(this,q1);}else{q1.attachEventOnce('afterRendering',function(p1){n1.call(this,p1.getSource());},this);}}};this._oDesignTime.attachEvent("elementOverlayCreated",o1,this);};f1.prototype._handleElementModified=function(j1){this._handleStopCutPaste();var k1=j1.getParameter("action");var l1=j1.getParameter("newControlId");var m1=j1.getParameter("command");if(m1 instanceof sap.ui.rta.command.BaseCommand){if(k1&&l1){this._scheduleRenameOnCreatedContainer(k1,l1);}return this.getCommandStack().pushAndExecute(m1).catch(function(n1){if(n1&&n1.message&&n1.message.indexOf("The following Change cannot be applied because of a dependency")>-1){U._showMessageBox(w.Icon.ERROR,"HEADER_DEPENDENCY_ERROR","MSG_DEPENDENCY_ERROR",n1);}X.error("sap.ui.rta: "+n1.message);});}return Promise.resolve();};f1.prototype._onElementEditableChange=function(j1){var k1=j1.getParameter("editable");if(k1){this.iEditableOverlaysCount+=1;}else{this.iEditableOverlaysCount-=1;}};f1.prototype._handleStopCutPaste=function(){if(this.getPlugins()["cutPaste"]){this.getPlugins()["cutPaste"].stopCutAndPaste();}};f1.prototype._buildNavigationArguments=function(j1){return{target:{semanticObject:j1.semanticObject,action:j1.action,context:j1.contextRaw},params:j1.params,appSpecificRoute:j1.appSpecificRoute,writeHistory:false};};f1.prototype._hasMaxLayerParameter=function(j1){var k1=this.getLayer();return j1.params&&j1.params[t.FL_MAX_LAYER_PARAM]&&j1.params[t.FL_MAX_LAYER_PARAM][0]===k1;};f1.prototype._reloadWithoutHigherLayerChangesOnStart=function(j1,k1){var l1=this.getLayer();if(!this._hasMaxLayerParameter(j1)){if(!j1.params){j1.params={};}j1.params[t.FL_MAX_LAYER_PARAM]=[l1];f1.enableRestart(l1);k1.toExternal(this._buildNavigationArguments(j1));return Promise.resolve(true);}};f1.prototype._removeMaxLayerParameter=function(){if(s.getUshellContainer()&&this.getLayer()!=="USER"){var j1=s.getUshellContainer().getService("CrossApplicationNavigation");var k1=s.getParsedURLHash();if(j1.toExternal&&k1){if(this._hasMaxLayerParameter(k1)){delete k1.params[t.FL_MAX_LAYER_PARAM];j1.toExternal(this._buildNavigationArguments(k1));}}}};f1.prototype._handleReloadWithoutHigherLayerChangesMessageBoxOnStart=function(){var j1=this.getLayer();var k1=j1==="CUSTOMER"?"MSG_PERSONALIZATION_EXISTS":"MSG_HIGHER_LAYER_CHANGES_EXIST";return U._showMessageBox(w.Icon.INFORMATION,"HEADER_PERSONALIZATION_EXISTS",k1);};f1.prototype._handleReloadMessageBox=function(j1){return U._showMessageBox(w.Icon.INFORMATION,"HEADER_RELOAD_NEEDED",j1,undefined,"BUTTON_RELOAD_NEEDED");};f1.prototype._handleHigherLayerChangesOnStart=function(){var j1=s.getUshellContainer();if(j1&&this.getLayer()!=="USER"){var k1=s.getParsedURLHash();return v.hasHigherLayerChanges({selector:this.getRootControlInstance(),ignoreMaxLayerParameter:false}).then(function(l1){if(l1){return this._handleReloadWithoutHigherLayerChangesMessageBoxOnStart().then(function(){var m1=j1.getService("CrossApplicationNavigation");if(m1.toExternal&&k1){return this._reloadWithoutHigherLayerChangesOnStart(k1,m1);}}.bind(this));}}.bind(this));}return Promise.resolve(false);};f1.prototype._handleReloadOnExit=function(){return Promise.all([this._oSerializer.needsReload(),v.hasHigherLayerChanges({selector:this.getRootControlInstance(),ignoreMaxLayerParameter:true})]).then(function(j1){var k1=j1[0];var l1=j1[1];if(k1||l1){var m1=this._RESTART.RELOAD_PAGE;var n1;var o1;if(l1){var p1=this.getLayer();n1=p1==="CUSTOMER"?"MSG_RELOAD_WITH_PERSONALIZATION":"MSG_RELOAD_WITH_ALL_CHANGES";o1=s.getUshellContainer();if(!k1&&o1){m1=this._RESTART.VIA_HASH;}}else if(k1){n1="MSG_RELOAD_NEEDED";}return this._handleReloadMessageBox(n1).then(function(){return m1;});}return this._RESTART.NOT_NEEDED;}.bind(this));};f1.prototype._onModeChange=function(j1){this.setMode(j1.getParameter("item").getKey());};f1.prototype.setMode=function(j1){if(this.getProperty('mode')!==j1){var k1=this.getShowToolbars()&&this.getToolbar().getControl('modeSwitcher');var l1=j1==='adaptation';if(k1){k1.setSelectedButton(k1.getItems().filter(function(m1){return m1.getKey()===j1;}).pop().getId());}this._oDesignTime.setEnabled(l1);this.getPlugins()['tabHandling'][l1?'removeTabIndex':'restoreTabIndex']();this.setProperty('mode',j1);this.fireModeChanged({mode:j1});}};f1.prototype.setMetadataScope=function(j1){if(this._oDesignTime){X.error("sap.ui.rta: Failed to set metadata scope on RTA instance after RTA is started");return;}this.setProperty('metadataScope',j1);};function i1(j1){if(J.hasOwnProperty(j1)){return J[j1].replace(/\./g,'/');}}f1.prototype.startService=function(j1){if(this._sStatus!==_){return new Promise(function(m1,n1){this.attachEventOnce('start',m1);this.attachEventOnce('failed',n1);}.bind(this)).then(function(){return this.startService(j1);}.bind(this),function(){return Promise.reject(r.createError("RuntimeAuthoring#startService",r.printf("Can't start the service '{0}' while RTA has been failed during a startup",j1),"sap.ui.rta"));});}var k1=i1(j1);var l1;if(!k1){return Promise.reject(r.createError("RuntimeAuthoring#startService",r.printf("Unknown service. Can't find any registered service by name '{0}'",j1),"sap.ui.rta"));}l1=this._mServices[j1];if(l1){switch(l1.status){case d1:{return Promise.resolve(l1.exports);}case c1:{return l1.initPromise;}case e1:{return l1.initPromise;}default:{return Promise.reject(r.createError("RuntimeAuthoring#startService",r.printf("Unknown service status. Service name = '{0}'",j1),"sap.ui.rta"));}}}else{this._mServices[j1]=l1={status:c1,location:k1,initPromise:new Promise(function(m1,n1){sap.ui.require([k1],function(o1){l1.factory=o1;if(!this._oServiceEventBus){this._oServiceEventBus=new K();}r.wrapIntoPromise(o1)(this,this._oServiceEventBus.publish.bind(this._oServiceEventBus,j1)).then(function(p1){if(this.bIsDestroyed){throw r.createError("RuntimeAuthoring#startService",r.printf("RuntimeAuthoring instance is destroyed while initialising the service '{0}'",j1),"sap.ui.rta");}if(!q.isPlainObject(p1)){throw r.createError("RuntimeAuthoring#startService",r.printf("Invalid service format. Service should return simple javascript object after initialisation. Service name = '{0}'",j1),"sap.ui.rta");}l1.service=p1;l1.exports={};if(Array.isArray(p1.events)&&p1.events.length>0){q.extend(l1.exports,{attachEvent:this._oServiceEventBus.subscribe.bind(this._oServiceEventBus,j1),detachEvent:this._oServiceEventBus.unsubscribe.bind(this._oServiceEventBus,j1),attachEventOnce:this._oServiceEventBus.subscribeOnce.bind(this._oServiceEventBus,j1)});}var q1=p1.exports||{};q.extend(l1.exports,Object.keys(q1).reduce(function(r1,s1){var t1=q1[s1];r1[s1]=typeof t1==="function"?r.waitForSynced(this._oDesignTime,t1):t1;return r1;}.bind(this),{}));l1.status=d1;m1(Object.freeze(l1.exports));}.bind(this)).catch(n1);}.bind(this),function(o1){l1.status=e1;n1(r.propagateError(o1,"RuntimeAuthoring#startService",r.printf("Can't load service '{0}' by its name: {1}",j1,k1),"sap.ui.rta"));});}.bind(this)).catch(function(m1){l1.status=e1;return Promise.reject(r.propagateError(m1,"RuntimeAuthoring#startService",r.printf("Error during service '{0}' initialisation.",j1),"sap.ui.rta"));})};return l1.initPromise;}};f1.prototype.stopService=function(j1){var k1=this._mServices[j1];if(k1){if(k1.status===d1){if(typeof k1.service.destroy==="function"){k1.service.destroy();}}delete this._mServices[j1];}else{throw r.createError("RuntimeAuthoring#stopService",r.printf("Can't destroy service: unable to find service with name '{0}'",j1),"sap.ui.rta");}};f1.prototype.getService=function(j1){return this.startService(j1);};return f1;},true);