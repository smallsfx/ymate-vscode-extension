import { ExplorerNode } from './ExplorerNode';
import { MessageNode } from './MessageNode';
import { MessageEntry } from './enties/MessageEntry';
import * as vscode from 'vscode';
/**
 * 表示一个视图树消息节点集合对象的实例
 */
export class MessagesNode extends ExplorerNode {

  /**
   * 构造一个视图树消息节点集合对象实例。
   * @param context 扩展对象上下文
   * @author smalls
   */
  constructor(context: vscode.ExtensionContext) {
    super();
    this.context = context;
    this.editor = vscode.window.activeTextEditor;
  }

  //#region Properties
  /** 扩展的上下文 */
  public context: vscode.ExtensionContext;
  /** 当前活动的编辑器对象 */
  public editor: vscode.TextEditor;
  //#endregion //#region Properties

  getChildren() {
    if (this.editor && this.editor.document.languageId == 'properties') {
      return [new MessageNode(`没有消息`)];
    } else {
      return [new MessageNode(`不存在属性`)];
    }
  }

  getTreeItem() {
    const item = new vscode.TreeItem(`消息`,
      vscode.TreeItemCollapsibleState.Expanded);
    item.iconPath = {
      dark: this.context.asAbsolutePath('images/dark/icon-remote.svg'),
      light: this.context.asAbsolutePath('images/light/icon-remote.svg')
    };
    return item;
  }
}