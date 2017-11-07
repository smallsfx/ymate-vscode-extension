import * as vscode from 'vscode';
/** 表示一个代码信息对象的实例
 * @author smalls
 */
export abstract class Code {
  /**
   * 通过一个代码信息的名称，构造一个代码信息对象的实例
   * @param name 代码信息的名称
   */
  constructor(name: string) {
    this.name = name;
  }
  /**
   * 代码信息的名称
   */
  public name: string;
  /**
   * 代码信息所属的文档对象
   */
  public document: vscode.TextDocument;
  /**
   * 代码信息对应的内容范围对象
   */
  public range: vscode.Range;

  /**
   * 代码信息对应的文件路径
   */
  public uri: vscode.Uri;
}