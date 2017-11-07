
import * as vscode from 'vscode';
import { ExplorerNode } from './ExplorerNode';
import { Controller } from '../ymate/models/Controller';
import { ControllerParser } from "../ymate/parsers/ControllerParser";
import { OpenLineCommand } from "../commands/OpenLineCommand";
/**
 * 表示一个视图树控制器节点集合对象的实例
 * @author smalls
 */
export class ControllersNode extends ExplorerNode {

  /**
   * 构造一个视图树控制器节点节点集合对象的实例
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
    var nodes = [];
    var document = this.editor.document;

    var entries = ControllerParser.parse("");

    entries.forEach(entry => {
      nodes.push(new ControllerNode(entry, this.context));
    });

    return nodes;
  }

  getTreeItem() {
    const item = new vscode.TreeItem(`控制器`);
    item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    item.iconPath = {
      dark: this.context.asAbsolutePath('images/ymate-catalog-controller.svg'),
      light: this.context.asAbsolutePath('images/ymate-catalog-controller.svg')
    };
    return item;
  }
}

/**
 * 表示一个视图数控制器节点对象的实例
 * @author smalls
 */
export class ControllerNode extends ExplorerNode {

  constructor(entity: Controller, context: vscode.ExtensionContext) {

    super();
    this.entity = entity;
    this.context = context;
  }

  //#region Properties
  /** 节点内容对象 */
  public entity: Controller;
  /** 扩展对象上下文 */
  public context: vscode.ExtensionContext;
  //#endregion //#region Properties

  /**
   * 获取视图节点的子节点集合
   * @returns {ExplorerNode[]}
   */
  getChildren() {
    return [];
  }
  /**
   * 获取视图节点的树节点
   * @returns 
   */
  getTreeItem(): vscode.TreeItem {
    var item: vscode.TreeItem;
    item = new vscode.TreeItem(`${this.entity.name}`);
    item.iconPath = {
      dark: this.context.asAbsolutePath(`images/ymate-type-controller.svg`),
      light: this.context.asAbsolutePath(`images/ymate-type-controller.svg`)
    }
    item.command = OpenLineCommand.getCommand([this, this.entity]);

    return item;
  }
}