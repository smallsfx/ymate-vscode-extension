import * as vscode from 'vscode';
import { ExplorerNode } from './ExplorerNode';
import { MessagesNode } from './MessageNode';
import { PropertiesNode } from './PropertyNode';
import { FiltersNode } from "./FilterNode";
import { ControllersNode } from "./ControllerNode";

/**
 * 表示一个TreeData根节点对象实例
 * @author smalls
 */
export class RootNode extends ExplorerNode {
  /** 构造一个TreeData根节点对象实例
   * @param context 扩展对象上下文实例
   */
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
      new FiltersNode(this.context),
      new ControllersNode(this.context),
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