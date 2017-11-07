
import * as vscode from 'vscode';
import { RootNode } from './RootNode';
import { ExplorerNode } from './ExplorerNode';

export class Explorer {

  public context: vscode.ExtensionContext;
  private _root: RootNode;
  private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode>;

  constructor(context: vscode.ExtensionContext) {

    this.context = context;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(
        this.onActiveEditorChanged,
        this
      )
    );

    context.subscriptions.push(
      vscode.window.onDidChangeVisibleTextEditors(
        this.onVisibleEditorsChanged,
        this
      )
    );

    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(
        this.onConfigurationChanged,
        this
      )
    );

    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument(
        this.onDidSaveTextDocument,
        this
      )
    );

    context.subscriptions.push(
      vscode.workspace.onWillSaveTextDocument(
        this.onWillSaveTextDocument,
        this
      )
    );

    context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument(
        this.onDidOpenTextDocument,
        this
      )
    );

    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument(
        this.onDidChangeTextDocument,
        this
      )
    );
  }

  get onDidChangeTreeData() {
    return this._onDidChangeTreeData.event;
  }

  getTreeItem(node: ExplorerNode) {
    return node.getTreeItem();
  }
  
  getChildren(node: ExplorerNode) {
    if (node === undefined) {
      if (this._root === undefined) {
        return [];
      } else {
        return this._root.getChildren();
      }
    } else {
      return node.getChildren();
    }
  }

  getRootNode(editor: vscode.TextEditor) {
    return new RootNode(this.context);
  }

  // onDidChangeVisibleTextEditors(editor) {

  // }

  onWillSaveTextDocument(editor) {
    console.log(`onWillSaveTextDocument`);
    this.convertToUnicode();
  }

  onDidSaveTextDocument() {
    console.log(`onDidSaveTextDocument`);
    this.convertToCN();
  }

  onDidOpenTextDocument(document) {
    console.log(`onDidOpenTextDocument`);
    this.convertToCN();
    this.refresh();
  }

  onDidChangeTextDocument(document) {
    console.log(`onDidChangeTextDocument`);
    this.convertToCN();
    this.refresh();
  }

  onActiveEditorChanged(editor) {
    console.log('onActiveEditorChanged');
    if (editor && editor.document.languageId == 'properties') {
      const root = this.getRootNode(editor);
      if (root === this._root)
        return;
      this._root = root;
      this.refresh(undefined, root);
    } else {
      return;
    }
  }

  onConfigurationChanged() {
    // const cfg = vscode.workspace.getConfiguration().get(configuration_1.ExtensionKey);
    // const changed = !system.Objects.areEquivalent(cfg.gitExplorer, this._config && this._config.gitExplorer);

    // this._config = cfg;
    // if (changed) {
    //   this._root = this.getRootNode(vscode.window.activeTextEditor);
    //   this.refresh();
    // }
  }

  onVisibleEditorsChanged(editors) {
    console.log('onVisibleEditorsChanged');
    if (editors.length === 0) {
      if (this._root === undefined)
        return;
      this._root = undefined;
      this.refresh();
    }
  }

  /** 刷新属性结构节点内容
   * @param node 需要刷新的节点
   * @param root 树形结构的根节点
   * @author smalls
   */
  refresh(node: ExplorerNode = undefined, root: RootNode = undefined) {
    if (root === undefined) {
      this._root = this.getRootNode(vscode.window.activeTextEditor);
    }
    this._onDidChangeTreeData.fire(node);
  }

  convertToCN() {
    const unicode_regex = /\\u(\w{4})/;
    let range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    if (range) {
      let text = vscode.window.activeTextEditor.document.getText(range);
      let match;
      let hasChange = false;
      while ((match = unicode_regex.exec(text))) {
        let newtext = tohanzi(match[1]);
        text = text.replace(match[0], newtext);
        hasChange = true;
      }
      if (hasChange) {
        vscode.window.activeTextEditor.edit(editorEdit => {
          editorEdit.replace(range, text);
        });
      }
    }
  }

  convertToUnicode() {
    const zhcn_regex = /([\u4e00-\u9fa5])/;
    let range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    if (range) {
      let text = vscode.window.activeTextEditor.document.getText(range);
      let match;
      let hasChange = false;
      while ((match = zhcn_regex.exec(text))) {
        let newtext = tounicode(match[1]);
        text = text.replace(match[0], newtext);
        hasChange = true;
      }
      if (hasChange) {
        vscode.window.activeTextEditor.edit(editorEdit => {
          editorEdit.replace(range, text);
        });
        vscode.window.activeTextEditor.document.save();
      }
    }
  }

}

function tounicode(data) {
  if (data == '') return '请输入汉字';
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += "\\u" + parseInt(data[i].charCodeAt(0), 10).toString(16);
  }
  return str;
}

function tohanzi(data) {
  if (data == '') return '请输入十六进制unicode';
  var datas = data.split("\\u");
  var str = '';
  for (var i = 0; i < datas.length; i++) {
    let single = datas[i];
    if (single == '') {
      str += '';
    } else {
      str += String.fromCharCode(parseInt(single, 16));
    }
  }
  return str;
}
