import * as vscode from 'vscode';
import { views, BaseParser } from '../ymate';

const CATALOG_ID = "ymate.parser.java.class";
const CATALOG_NAME = "类视图";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'ymate-vscode-extension';

const FILE_STATE = vscode.TreeItemCollapsibleState.None;
const PACKAGE_ICON = 'type-package';
const CLASS_ICON = 'type-java';

const CLASS_STATE = vscode.TreeItemCollapsibleState.None;
const PACKAGE_STATE = vscode.TreeItemCollapsibleState.Collapsed;

const PACKAGE = /^package +(.+?);/;
const IMPORT = /^import +(.+?);/;

const CLASS = /class +(.+?) +/;

/** 表示一个Java文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class JavaClassParser extends BaseParser {

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
    let treeNode: views.TreeNode;
    let packageNode: views.TreeNode;
    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let lineText = line.text.trim();
      
      let match = PACKAGE.exec(lineText);
      if (match) {

        console.log(lineText);
        packageNode = this.parsePackage(match[1], false);
      }

      // match = IMPORT.exec(lineText);
      // if (match) {
      //   this.parsePackage(match[1], !match[1].endsWith('*'));
      // }

      match = CLASS.exec(lineText);
      if (match) {
        let node = views.buildTreeNode({
          label: match[1],
          document: document,
          range: line.range,
          icon: CLASS_ICON
        });
        if (packageNode) {
          packageNode.push(node);
        } else {
          this.node.push(node);
        }
      }
    }

    return undefined;
  }

  private parsePackage(packageName: string, hasClass: boolean = true): views.TreeNode {
    let names = packageName.split('.');
    let cur = this.node;
    names.forEach(name => {
      if (name == '*') { return; } //忽略 import .*;
      let child = cur.children.find(p => { return p.matedata.label == name });
      if (child) {
        cur = child;
      } else {
        let node = views.buildTreeNode({
          label: name,
          collapsibleState: (hasClass && name == names[names.length - 1]) ? null : PACKAGE_STATE,
          icon: (hasClass && name == names[names.length - 1]) ? CLASS_ICON : PACKAGE_ICON
        });
        cur.push(node);
        cur = node;
      }
    });
    return cur;
  }
}
