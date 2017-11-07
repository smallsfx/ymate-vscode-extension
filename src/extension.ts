'use strict';
import * as vscode from 'vscode';
import { Explorer } from './views/Explorer';
import { configureCommands } from "./commands";

import { DemoProvider } from "./ymate/providers/DemoProvider";
import { DemoCodeLensProvider } from "./ymate/providers/DemoCodeLensProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("ymate-vscode-extension is active!");
  const disposables: vscode.Disposable[] = [];
  disposables.push(
    vscode.window.registerTreeDataProvider(
      'ymate.extensions.properties.explorer',
      new Explorer(context)
    )
  );

  context.subscriptions.push(...disposables);

  configureCommands(context);


  let cppPv = vscode.languages.registerCompletionItemProvider("properties", new DemoProvider());
  context.subscriptions.push(cppPv);
  let provider = vscode.languages.registerCodeLensProvider("properties", new DemoCodeLensProvider());
  context.subscriptions.push(provider);
}
export function deactivate() {

}