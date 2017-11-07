import * as vscode from 'vscode';
import { Command } from "./Command";
/** [abstract] 表示一个活动编辑器指令对象实例
 * @author smalls
 */
export abstract class ActiveEditorCommand extends Command {
  /** 通过指令表示构造一个活动编辑器指令对象实例
   * @param command 指令的唯一标识
   */
  constructor(command) {
    super(command);
  }
  /**
   * 执行指令
   * @param command 指令标识
   * @param args 调用指令时传入的参数清单
   */
  protected _execute(command, ...args) {
    return super._execute(command, vscode.window.activeTextEditor, ...args);
  }
}