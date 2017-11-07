
import * as vscode from 'vscode';
import { RootNode } from './RootNode';
import { ExplorerNode } from './ExplorerNode';

/** 表示一个Treedata展示对象实例
 * @author smalls
 */
export class Explorer {
  /** 获取或设置扩展上下文对象实例 */
  public context: vscode.ExtensionContext;
  /** 根节点对象 */
  private _root: RootNode;
  /** TreeDate内容更新事件 */
  private _onDidChangeTreeData: vscode.EventEmitter<ExplorerNode>;

  /** 构造一个TreeDate展示对象实例 */
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

  // #region Node Method
  /** 获取TreeData内容更新事件 */
  get onDidChangeTreeData(): vscode.Event<ExplorerNode> {
    return this._onDidChangeTreeData.event;
  }

  /** 根据节点实例获取该节点的TreeItem实例
   * @param node 需要获取树节点的节点对象实例
   */
  getTreeItem(node: ExplorerNode): vscode.TreeItem {
    return node.getTreeItem();
  }

  /** 根据节点实例获取该节点的全部子节点，如果节点为空则返回根节点的全部子节点。
   * @param node 需要子节点的节点实例
   */
  getChildren(node: ExplorerNode): ExplorerNode[] {
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

  /** 获取TreeData根节点对象实例 */
  getRootNode(editor: vscode.TextEditor): RootNode {
    return new RootNode(this.context);
  }

  // #endregion #region Node Method

  // #region Event
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
  // #endregion // #region Event

  // #region Method
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

  private convertToCN() {
    const unicode_regex = /\\u(\w{4})/;
    let range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    if (range) {
      let text = vscode.window.activeTextEditor.document.getText(range);
      let match;
      let hasChange = false;
      while ((match = unicode_regex.exec(text))) {
        let newtext = ConvertUnicodetoCN(match[1]);
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

  private convertToUnicode() {
    const zhcn_regex = /([\u4e00-\u9fa5])/;
    let range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    if (range) {
      let text = vscode.window.activeTextEditor.document.getText(range);
      let match;
      let hasChange = false;
      while ((match = zhcn_regex.exec(text))) {
        let newtext = ConvertCNtoUnicode(match[1]);
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
  // #endregion // #region Method
}

// #region 中文与Unicode互相转换
/** 将中文转换为Unicode
 * @param data 需要转换为Unicode的中文字符
 */
function ConvertCNtoUnicode(data): string {
  if (data == '') return '';
  var str = '';
  for (var i = 0; i < data.length; i++) {
    str += "\\u" + parseInt(data[i].charCodeAt(0), 10).toString(16);
  }
  return str;
}

/** 将Unicode转换为中文
 * @param data 需要转换为中文的Unicode字符
 */
function ConvertUnicodetoCN(data): string {
  if (data == '') return '';
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
// #endregion // #region 中文与Unicode互相转换