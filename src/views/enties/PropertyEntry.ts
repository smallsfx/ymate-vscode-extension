
import * as vscode from 'vscode';
/**
 * 表示一个属性信息对象的实例
 * @author smalls
 */
export class PropertyEntry {
  /**
   * 通过一个属性的名称，构造一个属性信息对象的实例
   * @param name 属性的名称
   */
  constructor(name: string) {
    this.name = name;
    this.children = [];
  }
  /**
   * 属性名称
   */
  public name: string;
  /**
   * 属性的值
   */
  public value: string;
  /**
   * 属性的子属性
   */
  public children: PropertyEntry[]
  /**
   * 属性所属的文档对象
   */
  public document: vscode.TextDocument;
  /**
   * 属性所在的行对象
   */
  public line: vscode.TextLine;
}