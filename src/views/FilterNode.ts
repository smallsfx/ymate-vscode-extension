
import * as vscode from 'vscode';
import { ExplorerNode } from './ExplorerNode';
import { Filter } from '../ymate/models/Filter';
import { FilterParser } from "../ymate/parsers/FilterParser";
import { OpenLineCommand } from "../commands/OpenLineCommand";
/**
 * 表示一个视图树拦截器节点集合对象的实例
 * @author smalls
 */
export class FiltersNode extends ExplorerNode {

  /**
   * 构造一个视图树拦截器节点节点集合对象的实例
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

    var entries = FilterParser.parse('');

    entries.forEach(entry => {
      nodes.push(new FilterNode(entry, this.context));
    });

    return nodes;
  }

  getTreeItem() {
    const item = new vscode.TreeItem(`拦截器`);
    item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    item.iconPath = {
      dark: this.context.asAbsolutePath('images/ymate-catalog-filter.svg'),
      light: this.context.asAbsolutePath('images/ymate-catalog-filter.svg')
    };
    return item;
  }
}

/**
 * 表示一个视图数拦截器节点对象的实例
 * @author smalls
 */
export class FilterNode extends ExplorerNode {

  constructor(entity: Filter, context: vscode.ExtensionContext) {

    super();
    this.entity = entity;
    this.context = context;
  }

  //#region Properties
  /** 节点内容对象 */
  public entity: Filter;
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
      dark: this.context.asAbsolutePath(`images/ymate-type-filter.svg`),
      light: this.context.asAbsolutePath(`images/ymate-type-filter.svg`)
    }
    item.command = OpenLineCommand.getCommand([this, this.entity]);

    return item;
  }
}