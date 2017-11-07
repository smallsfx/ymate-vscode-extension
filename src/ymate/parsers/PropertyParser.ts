import * as vscode from 'vscode';
import { Property, PropertyType, DataType } from "../models/Property";
/**
 * 表示一个properties文件解析器对象
 * @author smalls
 */
export class PropertyParser {
  /** 解析文档中的Property对象
   * @param document 需要解析Property的文档对象
   */
  static parse(document: vscode.TextDocument): Property[] {
    let models: Property[] = [];
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
        let cur = models;
        let item = new Property('');
        for (let j = 0; j < names.length; j++) {
          let name = names[j];
          item = cur.find(p => { return p.name === name });
          if (!item) {
            item = new Property(name);
            item.type = PropertyType.Package;
            cur.push(item);
          }

          cur = item.children;
        }
        item.type = PropertyType.Value;
        item.value = value;
        item.document = document;
        item.range = range;
        item.dataType = PropertyParser.parseValueType(value);
      }
    }
    return models;
  }


  private static parseValueType(text: string): DataType {
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
}