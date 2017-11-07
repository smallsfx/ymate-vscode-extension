import * as vscode from "vscode";

let ymate: YMate;
let output: vscode.OutputChannel;
export class YMate {

  static Instand(): YMate {

    if (!ymate) {
      ymate = new YMate();
    }
    return ymate;
  }

  private constructor() {
    output = vscode.window.createOutputChannel("ymate 控制台");
  }

  public showConsole() {
    output.show();
  }

  public Debug() {
    output.appendLine("deom");
  }

}