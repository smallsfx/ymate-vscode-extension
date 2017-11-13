import * as vscode from 'vscode';
import { views, IParser } from '../';

const CAALOG_ID = "ymate.parser.java.entity";
const CATALOG_NAME = "实体类";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'catalog-entity';

const FILE_STATE = vscode.TreeItemCollapsibleState.Collapsed;
const FILE_ICON = 'category-entity';

const CHILD_STATE = vscode.TreeItemCollapsibleState.None;
const CHILD_ICON = 'category-entity';

/** 表示一个Module文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class EntityParser implements IParser {

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

  /** 解析文档内容并且返回解析后的文档，解析失败返回null
   * @param document 需要解析的文档内容
   * @return 返回解析后的节点，如果失败则返回null
   */
  public parseDocument(document: vscode.TextDocument): views.TreeNode {
    const ENTITY = /@Entity\("(.+?)"\)/;
    const HAS_ENTITY = "@Entity";
    const HAS_FIELD = /FIELDS/;
    const HAS_PROPERTY = /@Property/;
    const FILED = /public static final (.+?)[ ]+(.+?)[ ]+\=[ ]?"(.+?)"/g;
    const PRIVATE_FIELD = /private (.+?) (.+?);/;
    let text = document.getText();
    if (text.indexOf(HAS_ENTITY) == -1) {
      return undefined;
    }
    let treeNode: views.TreeNode;
    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let range = line.range;
      let lineText = line.text.trim();
      if (treeNode) {
        let match = HAS_PROPERTY.exec(lineText);
        if (!match) {
          continue;
        }
        PRIVATE_FIELD.exec(lineText)

        // 处理属性换行
        while (!(match = PRIVATE_FIELD.exec(lineText))) {
          i++;
          line = document.lineAt(i);
          lineText = line.text;
          if (lineText.trim() == "") {
            break;
          }
          range = new vscode.Range(range.start, line.range.end);
        }
        if (match) {
          treeNode.push(
            views.buildTreeNode({
              label: `${match[2]}`,
              document: document,
              range: range,
              collapsibleState: CHILD_STATE,
              icon: parseIconName(match[1])
            })
          );
        }

      } else {
        let match = ENTITY.exec(lineText);
        if (match) {
          let name = match[1];
          treeNode = views.buildTreeNode({
            label: `${name}`,
            document: document,
            range: line.range,
            collapsibleState: FILE_STATE,
            icon: FILE_ICON
          });
        }
      }

    }

    return treeNode;
  }
}

/** 根据数据类型判断节点的图标名称
 * @param text java数据类型
 * @author smalls
 */
function parseIconName(text: string): string {
  let iconname: string;
  switch (text) {
    case "java.lang.String":
      iconname = 'string';
      break;
    case "java.lang.Long":
      iconname = 'long';
      break;
    case "java.lang.Integer":
      iconname = 'integer';
      break;
  }
  return `type-${iconname}`;
}