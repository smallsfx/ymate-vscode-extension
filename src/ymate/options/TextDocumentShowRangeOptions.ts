import * as vscode from 'vscode';
/** 展示文档并且选定区域设置项
 * @author smalls
 */
export class TextDocumentShowRangeOptions implements vscode.TextDocumentShowOptions {

  constructor(range: vscode.Range) {
    this.selection = range;
    this.preserveFocus = true;
  }

  public preserveFocus?: boolean;
  public selection?: vscode.Range;
}
