import * as vscode from 'vscode';
import { ymate, views, DataType } from '../';

/** 解析文本内容，生成参数实体对象并且返回
 * @param document 文本所属文档
 * @author smalls
 */
export function PropertyParser(document: vscode.TextDocument): views.TreeNode {

  let path = document.fileName.replace(vscode.workspace.rootPath + '/', '');
  let catalog = views.buildTreeNode({
    label: path,
    file: document.fileName,
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    icon: 'ymate-file-properties'
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
            value: value,
            range: range,
            document: document,
            dataType: dataType,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            icon: parseIconName(dataType)
          });

          cur.children.push(item);
        } else {
          let child = cur.children.find(p => { return p.label === name });
          if (child) {
            cur = child;
          } else {
            let item = views.buildTreeNode({
              label: name,
              collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
              icon: 'ymate-type-package'
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
  return `ymate-type-${iconname}`;
}