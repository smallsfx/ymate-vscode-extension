import * as vscode from 'vscode';
import { Filter } from "../models/Filter";
/**
 * 表示一个拦截器解析对象的实例
 * @author smalls
 */
export class FilterParser {
  /** 解析目录中的拦截器
   * @param path 需要解析拦截器的目录
   */
  static parse(path: string): Filter[] {
    let models: Filter[] = [];

    // vscode.workspace.findFiles('*').then(uris => {
    //   uris.forEach(uri => {

    //     // let document = vscode.workspace.openTextDocument(uri);
    //     // document.then(content => {
    //     // var text = content.getText();
    //     let className = uri.fsPath;
    //     let filter: Filter = new Filter(className);
    //     filter.uri = uri;
    //     // filter.document = content;
    //     models.push(filter);
    //     // });
    //   });
    // });
    return models;
  }

}