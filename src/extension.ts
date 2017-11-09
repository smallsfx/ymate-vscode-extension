'use strict';
import * as vscode from 'vscode';
import { configureCommands } from "./commands";
import { YMate, ymate, views, DocumentChangeEvent } from "./ymate";
import { DemoProvider } from "./ymate/providers/DemoProvider";
import { DemoCodeLensProvider } from "./ymate/providers/DemoCodeLensProvider";
import { ControllerParser } from "./ymate/parsers/ControllerParser";
import { PropertyParser } from "./ymate/parsers/PropertyParser";
import { scan } from "./ymate/providers/ScanProvider";
export function activate(context: vscode.ExtensionContext) {
  YMate.init(context);

  let _messageNode = views.TreeNode.build({
    label: "消息",
    collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    icon: 'ymate-catalog-message'
  });
  ymate.push(_messageNode);

  let _interceptorNode = views.TreeNode.build({
    label: "拦截器",
    collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    icon: 'ymate-catalog-interceptor'
  });
  ymate.push(_interceptorNode);

  let _controllerNode = views.TreeNode.build({
    label: "控制器",
    collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    icon: 'ymate-catalog-controller'
  });
  ymate.push(_controllerNode);

  let _optionNode = views.TreeNode.build({
    label: "配置项",
    collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    icon: 'ymate-catalog-option'
  });
  ymate.push(_optionNode);

  scan(`**/*.{properties,java}`, `**/target/`).then((uris: vscode.Uri[]) => {
    uris.forEach(uri => {
      vscode.workspace.openTextDocument(uri).then(document => {
        switch (document.languageId) {
          case "properties":
            _optionNode.push(PropertyParser(document));
            ymate.Explorer.refreshNode(_optionNode);
            break;
          case "java":
            _controllerNode.push(ControllerParser(document));
            ymate.Explorer.refreshNode(_controllerNode);
            break;
        }
      });
    });

  });

  const disposables: vscode.Disposable[] = [
    vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument, this),
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument, this)
  ];

  context.subscriptions.push(...disposables);

  configureCommands(context);

  let cppPv = vscode.languages.registerCompletionItemProvider("properties", new DemoProvider());
  context.subscriptions.push(cppPv);
  let provider = vscode.languages.registerCodeLensProvider("properties", new DemoCodeLensProvider());
  context.subscriptions.push(provider);
}

export function deactivate() {

}

// #region Event
/** 打开文档后触发的事件处理程序 */
function onDidOpenTextDocument(document: vscode.TextDocument) {
  // console.log(`onDidOpenTextDocument:${document.fileName.replace(vscode.workspace.rootPath + '/', '')}`);
  // console.log(`onDidOpenTextDocument`);
  // this.convertToCN();
  // explorer.refreshNode(  );
}
/** 文档内容变更后触发的事件处理程序 */
function onDidChangeTextDocument(e: DocumentChangeEvent) {
  console.log(`onDidChangeTextDocument${e.document.fileName.replace(vscode.workspace.rootPath + '/', '')}`);

  let node = ControllerParser(e.document);
  ymate.refresh(node);
  // _controllerNode.push(ControllerParser(e.document));
  // ymate.Explorer.refreshNode(_controllerNode);
  // this.convertToCN();
  // this.refreshNode();
}
// #endregion // #region Event


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