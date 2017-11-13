import * as vscode from 'vscode';
import { views, IParser } from '../';

const CAALOG_ID = "ymate.parser.java.maven";
const CATALOG_NAME = "Maven";
const CATALOG_LANGUAGE_ID = "xml";
const CATALOG_PATTENT = "pom.xml";
const CATALOG_ICON = 'catalog-maven';

const FILE_STATE = vscode.TreeItemCollapsibleState.None;
const FILE_ICON = 'category-maven';

/** 表示一个Maven:pom文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class MavenParser implements IParser {

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
    let node: views.TreeNode;
    return node;
  }
}