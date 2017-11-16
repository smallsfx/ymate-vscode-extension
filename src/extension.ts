'use strict';
import * as vscode from 'vscode';

import { YMate, ymate, views, utils } from "./ymate";
import { UnicodeCodeLensProvider } from "./ymate/providers/UnicodeCodeLensProvider";
import { ControllerParser } from "./parsers/ControllerParser";
import { PropertyParser } from "./parsers/PropertyParser";
import { EntityParser } from './parsers/EntityParser';
import { InterceptorParser } from './parsers/InterceptorParser';
import { ServiceParser } from './parsers/ServiceParser';
import { ValidatorParser } from './parsers/ValidatorParser';
import { JavaClassParser } from './parsers/JavaClassParser';
import { RepositoryParser } from './parsers/RepositoryParser';

export function activate(context: vscode.ExtensionContext) {
  YMate.init(context);

  ymate.registetParser(new JavaClassParser());
  ymate.registetParser(new EntityParser());
  ymate.registetParser(new ServiceParser());
  ymate.registetParser(new ControllerParser());
  ymate.registetParser(new InterceptorParser());
  ymate.registetParser(new ValidatorParser());
  ymate.registetParser(new RepositoryParser());
  ymate.registetParser(new PropertyParser());

  ymate.start();

  const disposables: vscode.Disposable[] = [
    vscode.languages.registerCodeLensProvider("properties", new UnicodeCodeLensProvider())
  ];

  context.subscriptions.push(...disposables);

  vscode.workspace.onDidChangeTextDocument((e) => {
    if (e.contentChanges.length == 0 || e.document.uri.toString().startsWith('output:')) {
      return;
    }
    // ymate.Debug(e.document.uri.toString());
    ymate.parse(e.document);
  }, null, context.subscriptions);

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      utils.DocumentConvertToCN(editor.document, editor);
    }
  }, null, context.subscriptions);

  vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
    switch (event.document.languageId) {
      case "properties":
        utils.DocumentConvertToUnicode(event.document);
        break;
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    switch (document.languageId) {
      case "properties":
        utils.DocumentConvertToCN(document);
        break;
    }
  }, null, context.subscriptions);

}

export function deactivate() {

}