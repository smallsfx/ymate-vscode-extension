import { ExplorerNode } from './ExplorerNode';
import * as vscode from 'vscode';
import { PropertyEntry } from './enties/PropertyEntry';
/**
 * 表示一个视图数消息节点对象的实例
 */
export class MessageNode extends ExplorerNode {

  public message: string;
  constructor(message) {
    super();
    this.message = message;
  }
  getChildren() {
    return [];
  }
  getTreeItem() {
    const item = new vscode.TreeItem(this.message,
      vscode.TreeItemCollapsibleState.None);
    return item;
  }
}