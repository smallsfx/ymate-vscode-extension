import * as vscode from 'vscode';
import { Command } from "./Command";
export abstract class ActiveEditorCommand extends Command {
  constructor(command) {
    super(command);
  }

  _execute(command, ...args) {
    return super._execute(command, vscode.window.activeTextEditor, ...args);
  }
}