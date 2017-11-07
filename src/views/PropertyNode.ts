import { ExplorerNode } from './ExplorerNode';
import * as vscode from 'vscode';
import { PropertyEntry } from './enties/PropertyEntry';
/**
 * 表示一个视图数属性节点对象的实例
 */
export class PropertyNode extends ExplorerNode {

  constructor(entity: PropertyEntry, context: vscode.ExtensionContext) {

    super();
    this.entity = entity;
    this.context = context;
  }

  //#region Properties
  public entity: PropertyEntry;
  public context: vscode.ExtensionContext;
  //#endregion //#region Properties

  /**
   * 获取视图节点的子节点集合
   * @returns {ExplorerNode[]}
   */
  getChildren() {
    var nodes = [];
    if (this.entity) {
      this.entity.children.forEach(entry => {
        nodes.push(new PropertyNode(entry, this.context));
      });
    }
    return nodes;
  }
  /**
   * 获取视图节点的树节点
   * @returns 
   */
  getTreeItem(): vscode.TreeItem {
    var item;
    try {
      if (this.entity.value) {
        item = new vscode.TreeItem(`${this.entity.name} - ${this.entity.value}`);
        item.iconPath = {
          dark: this.context.asAbsolutePath('images/dark/icon-status-unknown.svg'),
          light: this.context.asAbsolutePath('images/light/icon-status-unknown.svg')
        };
        item.command = {
          title: '转到定义',
          command: 'ymp.properties.openfile',
          arguments: [this, this.entity]
        };
        //  item.command = getCommand();
      } else {
        item = new vscode.TreeItem(`${this.entity.name}`, vscode.TreeItemCollapsibleState.Expanded);
        item.iconPath = {
          dark: this.context.asAbsolutePath('images/dark/icon-commit.svg'),
          light: this.context.asAbsolutePath('images/light/icon-commit.svg')
        };
      }
    } catch (ex) {
      console.log(ex);
    }
    return item;
  }
}
