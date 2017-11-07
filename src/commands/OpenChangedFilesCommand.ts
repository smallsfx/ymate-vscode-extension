import * as vscode from 'vscode';
import { ActiveEditorCommand } from "./ActiveEditorCommand";
export class OpenChangedFilesCommand extends ActiveEditorCommand {

  constructor() {
    super('ymp.properties.openfile');
  }

  execute(editor, args = {}) {
    vscode.window.showInputBox({  // 调出输入框
      prompt: "请输入XXX"
    }).then(function (text) {
      vscode.window.showInformationMessage(`输入内容为${text}`);
    });
  }
}