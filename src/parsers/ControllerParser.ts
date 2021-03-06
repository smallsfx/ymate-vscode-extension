import * as vscode from 'vscode';
import { views, BaseParser } from '../ymate';

const CATALOG_ID = "ymate.parser.java.controller";
const CATALOG_NAME = "控制器";
const CATALOG_LANGUAGE_ID = "java";
const CATALOG_PATTENT = "*.java";
const CATALOG_ICON = 'catalog-controller';

const FILE_STATE = vscode.TreeItemCollapsibleState.Collapsed;
const FILE_ICON = 'category-controller';

const CONTROLLER = `@Controller`;
const REQUESTMAPPING_CONTROLLER = /@RequestMapping\((.+?)\)/g;
const REQUESTMAPPING_INTERFACE = /@RequestMapping\((.+?)\)/;
const NAME = /[value.+?=.+?]{0,1}"(.+?)"/;
const METHOD = /Type.HttpMethod.([A-Z]*)/g;
const METHODS = /Type.HttpMethod.[A-Z]*/g;

/** 表示一个Controller文档内容解析器对象的实例
 * @author smalls
 * @version 1.0.0
 */
export class ControllerParser extends BaseParser {

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
    // 如果文档内容中不存在@Controller则忽略
    if (text.indexOf(CONTROLLER) == -1) {
      return undefined;
    }
    let treeNode: views.TreeNode;

    for (var i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let range = line.range;
      let lineText = line.text.trim();
      //匹配@RequestMapping
      let mappingMatch = REQUESTMAPPING_INTERFACE.exec(lineText);
      if (!mappingMatch) { continue; }
      let nameMatch = NAME.exec(mappingMatch[1]);
      if (!nameMatch) {
        continue;
      }
      let name = nameMatch[1]; //formatName(nameMatch[1]);
      let method = '';
      let methodMatchs = mappingMatch[1].match(METHODS);
      if (methodMatchs) {
        let methodlist = [];
        methodMatchs.forEach(_methodMatch => {
          methodlist.push(_methodMatch.replace('Type.HttpMethod.', ''));
        });
        if (methodlist.length > 0) {
          method = methodlist.join(',');
        } else {
          method = "GET";
        }
      } else {
        method = "GET";
      }

      if (treeNode) {
        treeNode.push(views.buildTreeNode({
          label: `${name} - [${method}]`,
          document: document,
          range: line.range,
          icon: 'type-api'
        }));
      } else {
        treeNode = views.buildTreeNode({
          label: `${name}`,
          document: document,
          range: line.range,
          collapsibleState: FILE_STATE,
          icon: FILE_ICON
        });
      }

    }

    return treeNode;
  }

  /** 用于格式化控制器或者接口名称
   * @param name 需要格式化的名称
   * @author smalls
   */
  private formatName(name) {
    if (name.indexOf('/') == 0) {
      return name.substring(1);
    } else {
      return name;
    }
  }
}


