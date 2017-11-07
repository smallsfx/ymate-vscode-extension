import * as vscode from 'vscode';
import { ExplorerNode } from './ExplorerNode';
import { MessagesNode } from './MessagesNode';
import { PropertiesNode } from './PropertiesNode';

export class RootNode extends ExplorerNode {
  constructor(context: vscode.ExtensionContext) {
    super();
    this.context = context;
  }

  //#region Properties
  /** 扩展的上下文 */
  public context: vscode.ExtensionContext;
  //#endregion //#region Properties

  /**
   * 获取视图节点的子节点集合
   * @returns {ExplorerNode[]}
   */
  getChildren() {
    return [
      new MessagesNode(this.context),
      new PropertiesNode(this.context)
    ];
  }

  /**
   * 获取视图节点的树节点
   */
  getTreeItem() {
    const item = new vscode.TreeItem(`RootNode`,
      vscode.TreeItemCollapsibleState.Expanded);
    return item;
  }
}