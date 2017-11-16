import * as vscode from 'vscode';
import { views, BaseParser } from '../ymate';

const CATALOG_ID = "ymate.parser.java.interceptor";
const CATALOG_NAME = "拦截器";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'catalog-interceptor';

const FILE_STATE = vscode.TreeItemCollapsibleState.None;
const FILE_ICON = 'category-interceptor';

const EXTENDS = /public +class +(.+?Interceptor) +extends/;
const IMPLEMENTS = /public +class +(.+?Interceptor) +implements +IInterceptor/;

/** 表示一个Interceptor文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class InterceptorParser extends BaseParser {

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

    let text = document.getText();
    if (!EXTENDS.exec(text) && !IMPLEMENTS.exec(text)) {
      return undefined;
    }
    let treeNode: views.TreeNode;
    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let range = line.range;
      let lineText = line.text.trim();
      let match = IMPLEMENTS.exec(lineText);
      if (!match) {
        match = EXTENDS.exec(lineText);
        if (!match) {
          continue;
        }
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