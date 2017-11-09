import * as vscode from 'vscode';
import {ymate,views,DataType} from '../';

/**
 * 解析文本内容，生成控制器实体对象并且返回
 * @param document 文本所属文档
 * @author smalls
 */
export function ControllerParser(document: vscode.TextDocument): views.TreeNode {
  const CONTROLLER = `@Controller`;
  const REQUESTMAPPING_CONTROLLER = /@RequestMapping\((.+?)\)/g;
  const REQUESTMAPPING_INTERFACE = /@RequestMapping\((.+?)\)/;
  const NAME = /[value.+?=.+?]{0,1}"(.+?)"/;
  const METHOD = /Type.HttpMethod.([A-Z]*)/g;
  const METHODS = /Type.HttpMethod.[A-Z]*/g;

  let text = document.getText();
  // 如果文档内容中不存在@Controller则忽略
  if (text.indexOf(CONTROLLER) == -1) {
    return undefined;
  }
  let treeNode :views.TreeNode;

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
      treeNode.children.push(views.TreeNode.build({
        label:`${name} - [${method}]`,
        document:document,
        range:line.range,
        icon:'ymate-type-api'
      }));
    } else {
      treeNode = views.TreeNode.build({
        label:name,
        collapsibleState:vscode.TreeItemCollapsibleState.Collapsed,
        icon: 'ymate-type-controller'
      });
    }

  }

  return treeNode;
}

/** 用于格式化控制器或者接口名称
 * @param name 需要格式化的名称
 * @author smalls
 */
function formatName(name) {
  if (name.indexOf('/') == 0) {
    return name.substring(1);
  } else {
    return name;
  }
}