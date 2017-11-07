import * as vscode from "vscode";
export abstract class Command extends vscode.Disposable {

  private _disposable: vscode.Disposable;

  constructor(command) {
    super(() => this.dispose());
    var subscriptions = [];
    subscriptions.push(
      vscode.commands.registerCommand(command, (...args) => this._execute(command, ...args), this));
    this._disposable = vscode.Disposable.from(...subscriptions);
  }
  static getMarkdownCommandArgsCore(command, args) {
    return `command:${command}?${encodeURIComponent(JSON.stringify(args))}`;
  }
  dispose() {
    this._disposable && this._disposable.dispose();
  }
  _execute(command, ...args) {
    return this.execute(...args);
  }

  abstract execute(args?: {}):vscode.Disposable;
}