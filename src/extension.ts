'use strict';
import * as vscode from 'vscode';
import { Explorer } from './views/Explorer';
import { OpenChangedFilesCommand } from "./commands/OpenChangedFilesCommand";

export function activate(context: vscode.ExtensionContext) {
    console.log("ymate-vscode-extension is active!");
    const disposables:vscode.Disposable[] = [
        new OpenChangedFilesCommand()
    ];

    disposables.push(
        vscode.window.registerTreeDataProvider(
            'ymp.properties.explorer',
            new Explorer(context)
        )
    );

    context.subscriptions.push(...disposables);
}
export function deactivate() {

}