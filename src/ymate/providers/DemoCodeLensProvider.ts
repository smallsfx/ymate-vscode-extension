import * as vscode from "vscode";
export class DemoCodeLensProvider implements vscode.CodeLensProvider {

  public onDidChangeCodeLenses?: vscode.Event<void>;

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
    let lenses = [];
    let line = document.lineAt(3);
    lenses.push(new DemoCodeLens("这是CodeLens生成的", line.range));
    return lenses;
  }

  public resolveCodeLens?(codeLens: DemoCodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
    return codeLens;
  }

}

class DemoCodeLens extends vscode.CodeLens {
  constructor(name, range) {
    super(range);

    this.command = {
      title: name,
      command: ''
    }
  }
}