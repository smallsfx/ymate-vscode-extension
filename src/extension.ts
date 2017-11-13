'use strict';
import * as vscode from 'vscode';

import { YMate, ymate, views, DocumentChangeEvent, DocumentWillSaveEvent, utils } from "./ymate";
import { UnicodeCodeLensProvider } from "./ymate/providers/UnicodeCodeLensProvider";
import { ControllerParser } from "./ymate/parsers/ControllerParser";
import { PropertyParser } from "./ymate/parsers/PropertyParser";
import { EntityParser } from './ymate/parsers/EntityParser';
import { InterceptorParser } from './ymate/parsers/InterceptorParser';
import { MavenParser } from './ymate/parsers/MavenParser';
import { ServiceParser } from './ymate/parsers/ServiceParser';
import { ValidatorParser } from './ymate/parsers/ValidatorParser';

export function activate(context: vscode.ExtensionContext) {
  YMate.init(context);

  ymate.registetParser(new MavenParser());
  ymate.registetParser(new EntityParser());
  ymate.registetParser(new ServiceParser());
  ymate.registetParser(new ControllerParser());
  ymate.registetParser(new InterceptorParser());
  ymate.registetParser(new ValidatorParser());
  ymate.registetParser(new PropertyParser());

  ymate.start();

  const disposables: vscode.Disposable[] = [
    vscode.workspace.onWillSaveTextDocument(onWillSaveTextDocument, this),
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument, this),
    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor, this),
    vscode.workspace.onDidSaveTextDocument(onDidSaveTextDocument, this),
    vscode.languages.registerCodeLensProvider("properties", new UnicodeCodeLensProvider())
  ];

  context.subscriptions.push(...disposables);

  // let cppPv = vscode.languages.registerCompletionItemProvider("properties", new DemoProvider());
  // context.subscriptions.push(cppPv);
  // let provider = vscode.languages.registerCodeLensProvider("properties", new DemoCodeLensProvider());
  // context.subscriptions.push(provider);
}

export function deactivate() {

}

// #region 文档／编辑器 操作事件处理

function onDidChangeTextDocument(e: DocumentChangeEvent) {
  if (e.contentChanges.length == 0) {
    return;
  }
  ymate.parse(e.document);
}

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

// #endregion #region 文档／编辑器 操作事件处理