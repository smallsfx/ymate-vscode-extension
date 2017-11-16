import * as vscode from 'vscode';
import { views, BaseParser } from '../ymate';

const CATALOG_ID = "ymate.parser.properties.peroperty";
const CATALOG_NAME = "配置项";
const CATALOG_LANGUAGE_ID = "properties";
const CATALOG_PATTENT = "*.properties";
const CATALOG_ICON = 'catalog-property';

const FILE_STATE = vscode.TreeItemCollapsibleState.Collapsed;
const FILE_ICON = 'category-property';

const PACKAGE_STATE = vscode.TreeItemCollapsibleState.Collapsed;
const PACKAGE_ICON = 'type-package';

/** 表示一个Properties文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class PropertyParser extends BaseParser {

  constructor() {
    super(
      CATALOG_NAME,
      CATALOG_ID,
      CATALOG_ICON,
      CATALOG_PATTENT,
      CATALOG_LANGUAGE_ID
    );
  }

  protected parseDocument(document: vscode.TextDocument): views.TreeNode {

    let path = document.fileName.replace(vscode.workspace.rootPath + '/', '');
    let catalog = views.buildTreeNode({
      label: path,
      file: document.fileName,
      collapsibleState: FILE_STATE,
      icon: FILE_ICON
    });

    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let range = line.range;
      let text = line.text.trim();
      if (text.startsWith('#')) {
        // 注释内容
      } else if (text != '') {
        let property = text.split('=');
        let names = property[0].split('.');
        let value = property[1];
        // 处理属性换行
        while (value.endsWith('\\')) {
          value = value.substring(0, value.length - 1);
          i++;
          let tmpline = document.lineAt(i);
          value += tmpline.text.trim();
          range = new vscode.Range(line.range.start, tmpline.range.end);
        }
        let cur = catalog;
        for (let j = 0; j < names.length; j++) {
          let name = names[j];
          // 将名称列表中的最后一个视为属性名称，其他的均为层级包
          if (j == names.length - 1) {
            let item = views.buildTreeNode({
              label: name,
              range: range,
              document: document,
              icon: this.parseIconName(value)
            });
            cur.push(item);
          } else {
            let child = cur.children.find(p => { return p.matedata.label === name });
            if (child) {
              cur = child;
            } else {
              let item = views.buildTreeNode({
                label: name,
                collapsibleState: PACKAGE_STATE,
                icon: PACKAGE_ICON
              });
              cur.push(item);
              cur = item;
            }
          }
        }

      }
    }

    return catalog;
  }

  /** 根据文本内容判断节点的图标名称
   * @param text 需要解析图标的文本内容
   * @author smalls
   */
  private parseIconName(text: string): string {
    let iconname: string;
    if (text.toLocaleLowerCase() == 'true' || text.toLocaleLowerCase() == 'false') {
      iconname = "boolean";
    } else if (!isNaN(parseInt(text))) {
      iconname = "number";
    } else if (text.indexOf('|') > 0 || text.indexOf(',') > 0) {
      iconname = "enum";
    } else {
      iconname = "string";
    }
    return `type-${iconname}`;
  }
}
