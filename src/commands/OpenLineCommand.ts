import * as vscode from 'vscode';
import { ActiveEditorCommand } from "../ymate/commands/ActiveEditorCommand";
import { Code } from "../ymate/models/Code";
import { TextDocumentShowRangeOptions } from "../ymate/options/TextDocumentShowRangeOptions";

/** 表示一个定位属性代码所在行数指令对象实例
 * @author smalls
 */
export class OpenLineCommand extends ActiveEditorCommand {
  /** 指令标识 */
  static Command = 'ymate.extensions.properties.openline';

  /** 获取可以调用的指令定义
   * @param args 调用指令时传入的参数清单
   */
  static getCommand(args: {}[]): { title: string, command: string, arguments: {}[] } {
    return {
      title: '转到定义',
      command: OpenLineCommand.Command,
      arguments: args
    };
  }

  /** 构造一个定位属性代码所在行数指令对象实例 */
  constructor() {
    super(OpenLineCommand.Command);
  }

  /** 触发指令后的处理函数
   * @param editor 触发指令的编辑器
   * @param args 触发指令时传入的参数清单
   */
  execute(editor: vscode.TextEditor, ...args) {
    let entity: Code = args[1];
    vscode.window.showTextDocument(entity.document, new TextDocumentShowRangeOptions(entity.range));
  }
}
