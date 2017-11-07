import { ExplorerNode } from './ExplorerNode';
import * as vscode from 'vscode';
import { PropertyNode } from './PropertyNode';
import { PropertyEntry } from './enties/PropertyEntry';
/**
 * 表示一个视图树属性节点集合对象的实例
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
      let options: PropertyEntry[] = [];

      for (var i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);
        let text = line.text.trim();
        if (text.startsWith('#')) {
          // 注释内容
        } else if (text != '') {
          let property = text.split('=');
          let names = property[0].split('.');

          let cur = options;
          let item = new PropertyEntry('');
          for (let j = 0; j < names.length; j++) {
            let name = names[j];
            item = cur.find(p => { return p.name === name });
            if (!item) {
              item = new PropertyEntry(name);
              cur.push(item);
            }

            cur = item.children;
          }
          item.value = property[1];
          item.document = document;
          item.line = line;
        }
      }
      options.forEach(entry => {
        nodes.push(new PropertyNode(entry, this.context));
      });
    }

    return nodes;
  }

  getTreeItem() {
    const item = new vscode.TreeItem(`属性`);
    item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    item.iconPath = {
      dark: this.context.asAbsolutePath('images/dark/icon-remote.svg'),
      light: this.context.asAbsolutePath('images/light/icon-remote.svg')
    };
    return item;
  }
}