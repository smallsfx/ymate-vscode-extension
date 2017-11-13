import * as vscode from 'vscode';
import { views, IParser } from '../';

const CAALOG_ID = "ymate.parser.java.interceptor";
const CATALOG_NAME = "拦截器";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'catalog-interceptor';

const FILE_STATE = vscode.TreeItemCollapsibleState.None;
const FILE_ICON = 'category-interceptor';

/** 表示一个Interceptor文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class InterceptorParser implements IParser {

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
    const KEY = /public +class +(.+?Interceptor) +extends/;
    const KEY2 = /public +class +(.+?Interceptor) +implements +IInterceptor/;

    let text = document.getText();
    if (!KEY.exec(text) && !KEY2.exec(text)) {
      return undefined;
    }
    let treeNode: views.TreeNode;
    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let range = line.range;
      let lineText = line.text.trim();
      let match = KEY2.exec(lineText);
      if (!match) {
        match = KEY.exec(lineText);
        if (!match) {
          continue;
        }
        //continue;
      }
      let name = match[1];
      treeNode = views.buildTreeNode({
        label: `${name}`,
        document: document,
        range: line.range,
        collapsibleState: FILE_STATE,
        icon: FILE_ICON
      });
      break;
    }

    return treeNode;
  }
}