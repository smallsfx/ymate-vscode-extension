import * as vscode from 'vscode';
/**
 * 视图树节点基础类
 * @author smalls
 */
export abstract class ExplorerNode {
  constructor() {
    
  }
  /**
   * 获取视图节点的指令（点击后执行的内容）
   * @returns
   */
  getCommand(): JSON {
    return undefined;
  }
  /**
   * 获取视图节点的子节点集合
   * @returns 返回视图节点的子节点集合对象
   */
  abstract getChildren(): ExplorerNode[];
  /**
   * 获取视图节点的树节点
   * @returns 
   */
  abstract getTreeItem(): vscode.TreeItem;
}