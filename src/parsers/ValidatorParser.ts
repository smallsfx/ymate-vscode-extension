import * as vscode from 'vscode';
import { views, BaseParser } from '../ymate';

const CATALOG_ID = "ymate.parser.java.validator";
const CATALOG_NAME = "验证器";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'catalog-validator';

const FILE_STATE = vscode.TreeItemCollapsibleState.None;
const FILE_ICON = 'category-validator';

const ENTITY = /@Validator\((.+?)\.class\)/;
const HAS = "@Validator";

/** 表示一个Validator文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class ValidatorParser extends BaseParser {

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
    if (text.indexOf(HAS) == -1) {
      return undefined;
    }
    let treeNode: views.TreeNode;
    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let range = line.range;
      let lineText = line.text.trim();
      let entityMatch = ENTITY.exec(lineText);
      if (!entityMatch) { continue; }
      let name = entityMatch[1];
      treeNode = views.buildTreeNode({
        label: `${name}`,
        document: document,
        range: line.range,
        // collapsibleState: FILE_STATE,
        icon: FILE_ICON
      });
    }

    return treeNode;
  }
}
