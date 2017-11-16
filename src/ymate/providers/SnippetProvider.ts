import * as vscode from "vscode";
export class SnippetProvider implements vscode.CompletionItemProvider {
  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.CompletionItem[] {

    var completionItems = [];
    var completionItem = new vscode.CompletionItem("aaa");
    completionItem.kind = vscode.CompletionItemKind.Snippet;
    completionItem.detail = "aaa";
    completionItem.filterText = "bbbb";
    completionItem.insertText = new vscode.SnippetString("aaaa$1bbbb$2cccc");
    completionItems.push(completionItem);
    return completionItems;
  }
  public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): any {
    return item;
  }
  
  dispose() {

  }
}