import { ExtensionContext } from "vscode";
import { OpenLineCommand,OpenDocumentCommand } from "./DocumentCommand";
import { TreeNodeCollpaseCommand, TreeNodeExpandCommand } from "./TreeNodeCommand";
/**
 * 配置指令
 * @param context 扩展对象上下文
 * @author smalls
 */
export function configureCommands(context: ExtensionContext) {
  context.subscriptions.push(new TreeNodeCollpaseCommand());
  context.subscriptions.push(new TreeNodeExpandCommand());
  context.subscriptions.push(new OpenLineCommand());
  context.subscriptions.push(new OpenDocumentCommand());
}