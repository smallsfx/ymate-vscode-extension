import * as vscode from 'vscode';
import { views, DataType, IParser } from '../';

const CAALOG_ID = "ymate.parser.properties.peroperty";
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
export class PropertyParser implements IParser {
  /** 解析器节点显示的内容 */
  public get name(): string { return CATALOG_NAME; }

  /** 解析器ID */
  public get id(): string { return CAALOG_ID; }

  /** 解析器节点显示的图标 */
  public get icon(): string { return CATALOG_ICON; }

  /** 定义搜索的文件 */
  public get pattern(): string { return CATALOG_PATTENT; }

  /** 解析器所支持的文档语言编号 */
  public get languageId(): string { return CATALOG_LANGUAGE_ID; }

  /** 解析文本内容，生成参数实体对象并且返回
   * @param document 文本所属文档
   * @author smalls
   */
  public parseDocument(document: vscode.TextDocument): views.TreeNode {

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
            let dataType = parseValueType(value);
            let item = views.buildTreeNode({
              label: name,
              range: range,
              document: document,
              icon: parseIconName(dataType)
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
}

/** 解析文本内容判断内容所属数据类型
 * @param text 需要解析数据类型的文本内容
 * @author smalls
 */
function parseValueType(text: string): DataType {
  if (text) {
    if (text.toLocaleLowerCase() == 'true' || text.toLocaleLowerCase() == 'false') {
      return DataType.Boolean;
    } else if (!isNaN(parseInt(text))) {
      return DataType.Number;
    } else if (text.indexOf('|') > 0 || text.indexOf(',') > 0) {
      return DataType.Enum;
    } else {
      return DataType.String;
    }
  } else {
    return DataType.String;
  }
}

/** 根据数据类型判断节点的图标名称
 * @param type 数据类型
 * @author smalls
 */
function parseIconName(type: DataType): string {
  let iconname: string;
  switch (type) {
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
  return `type-${iconname}`;
}