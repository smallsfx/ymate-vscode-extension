import * as vscode from 'vscode';

/** 扫描目录中的文件
 * @param pattern 需要扫描的文件规则，默认为`**\*.java`
 */
export async function scan(include: string = '**/*.java', exclude?: string): Promise<vscode.Uri[]> {
  let promise = new Promise<vscode.Uri[]>(resolve => {
    vscode.workspace.findFiles(include, exclude).then(resolve);
  });
  return promise;
}