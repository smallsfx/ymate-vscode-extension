import * as vscode from 'vscode';
import { views, BaseParser } from '../ymate';

const CATALOG_ID = "ymate.parser.java.service";
const CATALOG_NAME = "服务类";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'catalog-service';

const FILE_STATE = vscode.TreeItemCollapsibleState.None;
const FILE_ICON = 'category-service';

const MATCH_CLASS = /public +class +(.+?) +/;
const MATCH_PARSER = "@Bean";

/** 表示一个Service文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class ServiceParser extends BaseParser {

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
    if (text.indexOf(MATCH_PARSER) == -1) {
      return undefined;
    }
    let treeNode: views.TreeNode;
    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let lineText = line.text.trim();
      let match = MATCH_CLASS.exec(lineText);
      if (!match) { continue; }
      treeNode = views.buildTreeNode({
        label: `${match[1]}`,
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
