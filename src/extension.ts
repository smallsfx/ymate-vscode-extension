'use strict';
import * as vscode from 'vscode';
import { YMate, ymate, views, DocumentChangeEvent, DocumentWillSaveEvent, utils } from "./ymate";
// import { DemoProvider } from "./ymate/providers/DemoProvider";
import { UnicodeCodeLensProvider } from "./ymate/providers/UnicodeCodeLensProvider";
import { ControllerParser } from "./ymate/parsers/ControllerParser";
import { PropertyParser } from "./ymate/parsers/PropertyParser";
import { scan } from "./ymate/providers/ScanProvider";

export function activate(context: vscode.ExtensionContext) {
  YMate.init(context);

  let _messageNode = views.buildTreeNode({
    label: "消息",
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    icon: 'ymate-catalog-message'
  });
  ymate.push(_messageNode);

  let _interceptorNode = views.buildTreeNode({
    label: "拦截器",
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    icon: 'ymate-catalog-interceptor'
  });
  ymate.push(_interceptorNode);

  let _controllerNode = views.buildTreeNode({
    label: "控制器",
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    icon: 'ymate-catalog-controller'
  });
  ymate.push(_controllerNode);

  let _optionNode = views.buildTreeNode({
    label: "配置项",
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    icon: 'ymate-catalog-option'
  });
  ymate.push(_optionNode);

  scan(`**/*.{properties,java}`, `**/target/`).then((uris: vscode.Uri[]) => {
    uris.forEach(uri => {
      vscode.workspace.openTextDocument(uri).then(document => {
        switch (document.languageId) {
          case "properties":
            _optionNode.push(PropertyParser(document));
            _optionNode.sort();
            ymate.Explorer.refreshNode(_optionNode);
            break;
          case "java":
            _controllerNode.push(ControllerParser(document));
            _controllerNode.sort();
            ymate.Explorer.refreshNode(_controllerNode);
            break;
        }
      });
    });

  });

  const disposables: vscode.Disposable[] = [
    vscode.workspace.onWillSaveTextDocument(onWillSaveTextDocument, this),
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument, this),
    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor, this),
    vscode.workspace.onDidSaveTextDocument(onDidSaveTextDocument, this),

    vscode.languages.registerCodeLensProvider("properties", new UnicodeCodeLensProvider())
  ];

  context.subscriptions.push(...disposables);
  // configureCommands(context);

  // let cppPv = vscode.languages.registerCompletionItemProvider("properties", new DemoProvider());
  // context.subscriptions.push(cppPv);
  // let provider = vscode.languages.registerCodeLensProvider("properties", new DemoCodeLensProvider());
  // context.subscriptions.push(provider);
}

export function deactivate() {

}

// #region 文档／编辑器 操作事件处理

function onDidChangeActiveTextEditor(editor: vscode.TextEditor) {
  if (editor) {
    utils.DocumentConvertToCN(editor.document, editor);
  }
}

function onDidSaveTextDocument(document: vscode.TextDocument) {
  switch (document.languageId) {
    case "properties":
      try {
        utils.DocumentConvertToCN(document);
      } catch (ex) {
        console.log(`${ex}`);
      }
      break;
  }
}

function onWillSaveTextDocument(e: DocumentWillSaveEvent) {
  switch (e.document.languageId) {
    case "properties":
      try {
        utils.DocumentConvertToUnicode(e.document);
      } catch (ex) {
        console.log(`${ex}`);
      }
      break;
  }
}

/** 文档内容变更后触发的事件处理程序 */
function onDidChangeTextDocument(e: DocumentChangeEvent) {
  // console.log(`文档内容修改:\r\n${e.document.fileName.replace(vscode.workspace.rootPath + '/', '')}`);
  switch (e.document.languageId) {
    case "java":
      ymate.refresh(ControllerParser(e.document));
      break;
    case "properties":
      ymate.refresh(PropertyParser(e.document));
      break;
  }
}

// #endregion #region 文档／编辑器 操作事件处理


  // let subscriptions: vscode.Disposable[] = [
  //   // vscode.workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this),
  //   // vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this),
  //   // vscode.workspace.onDidSaveTextDocument(this.onDidSaveTextDocument, this),
  //   // vscode.workspace.onWillSaveTextDocument(this.onWillSaveTextDocument, this),
  //   vscode.workspace.onDidOpenTextDocument(this.onDidOpenTextDocument, this),
  //   vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this),
  //   // vscode.window.onDidChangeActiveTextEditor(this.onActiveEditorChanged, this),
  //   // vscode.window.onDidChangeVisibleTextEditors(this.onVisibleEditorsChanged, this),
  // ];
  // // this.rootNode = 
  // context.subscriptions.push(...subscriptions);