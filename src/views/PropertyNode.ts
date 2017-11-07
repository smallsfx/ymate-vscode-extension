
import * as vscode from 'vscode';
import { ExplorerNode } from './ExplorerNode';
import { Property, PropertyType, DataType } from '../ymate/models/Property';
import { PropertyParser } from "../ymate/parsers/PropertyParser";
import { OpenLineCommand } from "../commands/OpenLineCommand";
/**
 * 表示一个视图树属性节点集合对象的实例
 * @author smalls
 */
export class PropertiesNode extends ExplorerNode {

  /**
   * 构造一个视图树属性节点集合对象的实例
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

    if (this.editor && this.editor.document.languageId == 'properties') {
      var document = this.editor.document;

      var properties = PropertyParser.parse(document);

      properties.forEach(entry => {
        nodes.push(new PropertyNode(entry, this.context));
      });
    }

    return nodes;
  }

  getTreeItem() {
    const item = new vscode.TreeItem(`参数`);
    item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    item.iconPath = {
      dark: this.context.asAbsolutePath('images/ymate-catalog-option.svg'),
      light: this.context.asAbsolutePath('images/ymate-catalog-option.svg')
    };
    return item;
  }
}
/**
 * 表示一个视图数属性节点对象的实例
 * @author smalls
 */
export class PropertyNode extends ExplorerNode {

  constructor(entity: Property, context: vscode.ExtensionContext) {

    super();
    this.entity = entity;
    this.context = context;
  }

  //#region Properties
  public entity: Property;
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
    var item: vscode.TreeItem;
    switch (this.entity.type) {
      case PropertyType.Package:
        item = new vscode.TreeItem(`${this.entity.name}`, vscode.TreeItemCollapsibleState.Expanded);
        item.iconPath = {
          dark: this.context.asAbsolutePath(`images/ymate-type-package.svg`),
          light: this.context.asAbsolutePath(`images/ymate-type-package.svg`)
        };
        break;
      case PropertyType.Summany:
        break;
      case PropertyType.Value:
        item = new vscode.TreeItem(`${this.entity.name}`);
        item.contextValue = this.entity.value;
        let iconname: string;
        switch (this.entity.dataType) {
          case DataType.Boolean:
            iconname = 'boolean';
            break;
          case DataType.Enum:
            iconname = 'enum';
            break;
          case DataType.Number:
            iconname = 'number';
            break;
          case DataType.String:
            iconname = 'string';
            break;
        }
        item.iconPath = {
          dark: this.context.asAbsolutePath(`images/ymate-type-${iconname}.svg`),
          light: this.context.asAbsolutePath(`images/ymate-type-${iconname}.svg`)
        };
        item.command = OpenLineCommand.getCommand([this, this.entity]);
        break;
    }
    return item;
  }
}