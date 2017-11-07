import * as vscode from "vscode";

/** [abstract] 表示一个指令对象实例
 * @author smalls
 */
export abstract class Command extends vscode.Disposable {

  private _disposable: vscode.Disposable;
  /** 通过指令唯一标识构造一个指令对象实例
   * @param command 指令唯一标识
   */
  constructor(command) {
    super(() => this.dispose());
    var subscriptions: vscode.Disposable[] = [];
    subscriptions.push(
      vscode.commands.registerCommand(command, (...args) => this._execute(command, ...args), this));
    this._disposable = vscode.Disposable.from(...subscriptions);
  }
  
  /** 生成指令的Markdown文档 */
  static getMarkdownCommandArgsCore(command, args) {
    return `command:${command}?${encodeURIComponent(JSON.stringify(args))}`;
  }

  /** 销毁指令对象 */
  dispose() {
    this._disposable && this._disposable.dispose();
  }

  /**
   * 执行指令
   * @param command 指令标识
   * @param args 调用指令时传入的参数清单
   */
  protected _execute(command: string, ...args) {
    return this.execute(...args);
  }
  /** 通过传入的参数清单调用指令
   * @param args 调用指令时传入的参数清单
   */
  abstract execute(args?: {});
}