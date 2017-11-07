import * as vscode from 'vscode';
import { Command } from "../ymate/commands/Command";
import { Property } from "../ymate/models/Property";
/** 表示一个展开全部TreeDate节点指令对象实例
 * @author smalls
 */
export class TreeNodeExpandCommand extends Command {
  /** 指令标识 */
  static Command = 'ymate.extensions.properties.tree.expand';

  /** 构造一个定位属性代码所在行数指令对象实例 */
  constructor() {
    super(TreeNodeExpandCommand.Command);
  }

  /** 触发指令后的处理函数
   * @param editor 触发指令的编辑器
   * @param args 触发指令时传入的参数清单
   */
  execute(...args) {

  }
}

export class TreeNodeCollpaseCommand extends Command {
  /** 指令标识 */
  static Command = 'ymate.extensions.properties.tree.collpase';

  /** 构造一个定位属性代码所在行数指令对象实例 */
  constructor() {
    super(TreeNodeCollpaseCommand.Command);
  }

  /** 触发指令后的处理函数
   * @param editor 触发指令的编辑器
   * @param args 触发指令时传入的参数清单
   */
  execute(editor: vscode.TextEditor, ...args) {
    vscode.window.showInformationMessage("消息", "消息1", "消息2");
  }
}