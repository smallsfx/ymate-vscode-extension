import * as vscode from "vscode";
import { utils } from '../index';
export class UnicodeCodeLensProvider implements vscode.CodeLensProvider {

  public onDidChangeCodeLenses?: vscode.Event<void>;

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
    let lenses: vscode.CodeLens[] = [];
    const unicode_regex = /\\u(\w{4})/;
    const regex_has_cn = /\[(.+?)\]/;
    const cn_regex = /([\u4e00-\u9fa5])/;

    for (let i = 0; i < document.lineCount; i++) {
      let line = document.lineAt(i);
      let text = line.text.trim();
      if (text.startsWith('#')) {
        let match;

        // if (!vscode.window.activeTextEditor.document.isDirty) {
        //   if (regex_has_cn.exec(text)) {
        //     while ((match = cn_regex.exec(text))) {
        //       let newtext = utils.ConvertCNtoUnicode(match[1]);
        //       text = text.replace(match[0], newtext);
        //     }
        //     text = text.replace('[', '').replace(']', '');
        //     vscode.window.activeTextEditor.edit(editorEdit => {
        //       editorEdit.replace(line.range, text);
        //       document.save();
        //     });
        //   }
        // }

        let hasChange = false;
        while ((match = unicode_regex.exec(text))) {
          let newtext = utils.ConvertUnicodetoCN(match[1]);
          text = text.replace(match[0], newtext);
          hasChange = true;
        }
        if (hasChange) {
          lenses.push({
            command: { title: text, command: '' },
            isResolved: true,
            range: line.range
          });
        }

      }
    }

    return lenses;
  }

  public resolveCodeLens?(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
    return codeLens;
  }
}