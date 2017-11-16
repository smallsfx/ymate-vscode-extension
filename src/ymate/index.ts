import * as vscode from "vscode";

let explorer: views.Explorer;
/** YMate实体对象 */
export let ymate: YMate;

/** 插件核心类库
 * @author smalls
 * @version 0.0.0.1
 * @description VSCode 扩展程序核心库
 */
export class YMate {

  /** 通过VSCode插件上下文对象构造一个YMate对象实例
   * @param context VSCode插件上下文对象实例
   * @param output 控制台输出通道
   * @param rootNode 表示树数据根节点元数据
   */
  private constructor(
    public readonly context: vscode.ExtensionContext,
    public readonly rootNode: views.TreeNode,
    private readonly output: vscode.OutputChannel
  ) {
    this.parsers = [];
    this.configureCommands(context);
  }

  /** 初始化VSCode插件核心
   * @param context VSCode插件上下文对象实例
   */
  static init(context: vscode.ExtensionContext): void {
    console.log("初始化YMate");
    if (!ymate) {

      let rootNode = views.buildTreeNode({
        label: "根节点",
        collapsibleState: vscode.TreeItemCollapsibleState.Expanded
      });

      explorer = new views.Explorer(context, rootNode);

      context.subscriptions.push(
        vscode.window.registerTreeDataProvider(views.Explorer.ID, explorer)
      );

      ymate = new YMate(
        context,
        rootNode,
        vscode.window.createOutputChannel('YMATE 控制台')
      );

    }
  }

  // #region 私有变量
  /** 已注册的解析器集合 */
  private parsers: IParser[];
  private filterstring: string;
  // #endregion #region 私有变量

  // #region Console
  /** 显示控制台 */
  public showConsole(): void {
    this.output.show();
  }

  /** 向控制台输出对象：将对象转为字符串
   * @param obj 待输出对象实例，如果为空则输入NULL
   */
  public DebugObject(obj: object): void {
    if (obj) {
      this.output.appendLine(JSON.stringify(obj));
    } else {
      this.output.appendLine("NULL");
    }
  }

  /** 项控制台输出文本内容
   * @param text 待输出的文本内容
   */
  public Debug(text: string): void {
    this.output.appendLine(text);
  }
  // #endregion // #region Console

  // #region 公共方法

  /** 注册一个解析器对象
   * @param parser 需要注册的解析器实例
   */
  public registetParser(parser: IParser) {
    // 不需要注册已经存在的解析器
    if (this.parsers.find(p => p.id == parser.id)) {
      return;
    }
    this.Debug(`注册解析器 [${parser.name}-${parser.id}-${parser.languageId}]`);
    this.rootNode.push(parser.node);
    this.parsers.push(parser);
  }

  /** 启动插件框架 */
  public start(): void {
    this.rootNode.children.forEach(node => {
      node.children = [];
    });
    explorer.refresh(this.rootNode);
    let pattern = this.getPattern();
    vscode.workspace.findFiles(`**/{${pattern}}`, `**/target/`).then((uris: vscode.Uri[]) => {
      uris.forEach(uri => {
        vscode.workspace.openTextDocument(uri).then(document => { this.parse(document); });
      });
    });
    // try {
    //   let watcher = vscode.workspace.createFileSystemWatcher("", false, false, false);
    //   watcher.onDidChange((uri) => {
    //     console.log(`change-${uri.path}`);
    //   }, this);

    //   watcher.onDidCreate((uri) => {
    //     console.log(`create-${uri.path}`);
    //   }, this);

    //   watcher.onDidDelete((uri) => {
    //     console.log(`delete-${uri.path}`);
    //   }, this);
    // } catch (ex) {
    //   console.log(`error-${ex}`);
    // }
  }

  public collpaseAll() {
    this.setNodeCollapsibleState(this.rootNode, vscode.TreeItemCollapsibleState.Collapsed);
    explorer.refresh(this.rootNode);
  }

  public expandAll() {
    this.setNodeCollapsibleState(this.rootNode, vscode.TreeItemCollapsibleState.Expanded);
    explorer.refresh(this.rootNode);
  }

  public parse(document: vscode.TextDocument): void {
    this.parsers.forEach(parser => {
      if (document.languageId != parser.languageId) {
        return;
      }
      parser.execute(document);
      explorer.refresh(parser.node);
    });
  }

  public refresh(item: views.TreeNode): void {
    if (!item) {
      return;
    }
    let parentNode: views.TreeNode;
    let matchNode: views.TreeNode;
    this.rootNode.children.forEach(childNode => {
      let findNode = childNode.children.find(p => { return p.matedata.file == item.matedata.file });
      if (findNode && !parentNode && !matchNode) {
        parentNode = childNode;
        matchNode = findNode;
      }
    });

    if (parentNode && matchNode) {
      matchNode.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      matchNode.children = item.children;
      explorer.refresh(parentNode);
    }

  }

  // #endregion #region 公共方法

  // #region 私有方法

  private getPattern(): string {
    let patterns: string[] = [];
    this.parsers.forEach(parser => {
      if (patterns.indexOf(parser.pattern) == -1) {
        patterns.push(parser.pattern);
      }
    });
    return patterns.join(",");
  }

  /** 配置指令
   * @param context 扩展对象上下文
   * @author smalls
   */
  private configureCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(new commands.TreeNodeCollpaseCommand());
    context.subscriptions.push(new commands.TreeNodeExpandCommand());
    context.subscriptions.push(new commands.OpenLineCommand());
    context.subscriptions.push(new commands.OpenDocumentCommand());
    context.subscriptions.push(new commands.RefreshCommand());
  }

  /** 设置节点及其子节点的状态
   * @param node 需要设置状态的节点
   * @param state 需要设置的状态
   * @author smalls
   */
  private setNodeCollapsibleState(node: views.TreeNode, state: vscode.TreeItemCollapsibleState): void {
    if (node.children.length > 0) {
      node.collapsibleState = state;
      node.children.forEach(p => { this.setNodeCollapsibleState(p, state); });
    }
  }
  
  // #endregion #region 私有方法

}

/** 视图命名空间：定义视图元素内容*/
export namespace views {

  function createCommand(matedata: MateData) {
    if (matedata.range) {
      return commands.OpenLineCommand.getCommand([this, matedata]);
    } else if (matedata.document) {
      return commands.OpenDocumentCommand.getCommand([this, matedata]);
    }
  }

  export function buildTreeNode(matedata: MateData): TreeNode {
    let node = new TreeNode(
      matedata.label,
      matedata.collapsibleState,
      matedata,
      [],
      createCommand(matedata)
    );
    if (ymate && ymate.context) {
      node.iconPath = ymate.context.asAbsolutePath(`images/${matedata.icon}.svg`);
    }

    return node;
  }

  /** 表示树数据节点的元数据
   * @author smalls
   * @version 1.0.0.1
   */
  export interface MateData {
    /** 标签名称 */
    label: string,
    /** 文件路径：唯一标识 */
    file?: string;
    /** 实体节点的图标名称 */
    icon?: string;
    /** 实体节点的展开状态 */
    collapsibleState?: vscode.TreeItemCollapsibleState;
    /** 代码信息所属的文档对象*/
    document?: vscode.TextDocument;
    /** 代码信息对应的内容范围对象 */
    range?: vscode.Range;
  }

  /** 提供树数据的数据提供程序
   * @author smalls
   * @version 1.0.0.0
   */
  export class Explorer implements vscode.TreeDataProvider<TreeNode> {

    public static ID: string = 'ymate.extensions.properties.explorer';

    /** 构造一个TreeDate展示对象实例
     * @param context vscode.ExtensionContext
     * @param node TreeNode
     */
    constructor(
      public readonly context: vscode.ExtensionContext,
      private readonly node: TreeNode
    ) {
      this._onDidChangeTreeData = new vscode.EventEmitter();
      this.refresh();
    }

    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

    /** 根据节点实例获取该节点的TreeItem实例
     * @param node 需要获取树节点的节点对象实例
     */
    getTreeItem(node: TreeNode): vscode.TreeItem {
      return node;
    }

    /** 根据节点实例获取该节点的全部子节点，如果节点为空则返回根节点的全部子节点。
     * @param node 需要子节点的节点实例
     */
    getChildren(node: TreeNode | null): TreeNode[] {
      if (node === undefined) {
        return this.node.children;
      } else {
        return node.children;
      }
    }

    /** 刷新指定节点的内容
     * @param node 需要刷新内容的节点
     */
    refresh(node: TreeNode = undefined) {
      this._onDidChangeTreeData.fire(node);
    }

  }

  /** 表示树数据的数据节点
   * @author smalls
   * @version 1.0.0.0
   */
  export class TreeNode extends vscode.TreeItem {

    constructor(
      public readonly label: string,
      public collapsibleState: vscode.TreeItemCollapsibleState,
      public readonly matedata: MateData,
      public children: TreeNode[] = [],
      public readonly command?: vscode.Command,
    ) {
      super(label, collapsibleState);
    }

    public push(node: TreeNode): void {
      if (node) {
        let existNode: TreeNode;
        this.children.forEach((child) => {
          if (child.matedata.label == node.matedata.label) {
            existNode = child;
          }
        });

        if (existNode) {
          existNode.children = node.children;
        } else {
          this.children.push(node);
        }
      }
    }

    public sort(): void {
      this.children.sort((a, b) => {
        if (a.label < b.label) {
          return -1
        }
        else if (a.label > b.label) {
          return 1;
        }
        else {
          return 0;
        }
      });
    }

  }

}

export namespace utils {

  // #region 中文与Unicode互相转换

  /** 将中文转换为Unicode
   * @param data 需要转换为Unicode的中文字符
   */
  export function ConvertCNtoUnicode(data): string {
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
  export function ConvertUnicodetoCN(data): string {
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

  /** 将文档内容中的Unicode内容转为中文
   * @param document 需要转换的文档
   * @param editor 打开需要转换的文档的文档编辑器
   * @author smalls
   */
  export function DocumentConvertToCN(document: vscode.TextDocument, editor?: vscode.TextEditor) {
    const unicode_regex = /\\u(\w{4})/;
    let range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    if (range) {
      let text = document.getText(range);
      let match;
      let hasChange = false;
      while ((match = unicode_regex.exec(text))) {
        let newtext = ConvertUnicodetoCN(match[1]);
        text = text.replace(match[0], newtext);
        hasChange = true;
      }
      if (!editor) {
        editor = vscode.window.activeTextEditor;
      }
      if (hasChange && editor) {
        editor.edit(editorEdit => {
          editorEdit.replace(range, text);
        });
      }
    }
  }

  export function DocumentConvertToUnicode(document: vscode.TextDocument) {
    const zhcn_regex = /([\u4e00-\u9fa5])/;
    let range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
    if (range) {
      let text = document.getText(range);
      let match;
      let hasChange = false;
      while ((match = zhcn_regex.exec(text))) {
        let newtext = ConvertCNtoUnicode(match[1]);
        text = text.replace(match[0], newtext);
        hasChange = true;
      }
      if (hasChange && vscode.window.activeTextEditor) {
        vscode.window.activeTextEditor.edit(editorEdit => {
          editorEdit.replace(range, text);
        });
        vscode.window.activeTextEditor.document.save();
      }
    }
  }

  // #endregion // #region 中文与Unicode互相转换

}

export namespace commands {

  /** 打开文档 */
  export const OPEN_DOCUMENT = 'ymate.extensions.properties.opendocument';
  export const OPEN_DOCUMENT_LINE = 'ymate.extensions.properties.openline';
  export const TREE_EXPAND_ALL = 'ymate.extensions.properties.tree.expand';
  export const TREE_COLLPASE_ALL = 'ymate.extensions.properties.tree.collpase';
  export const TREE_REFRESH = 'ymate.extensions.properties.refresh';

  /** [abstract] 表示一个指令对象实例
   * @author smalls
   */
  export abstract class Command extends vscode.Disposable {

    private _disposable: vscode.Disposable;

    /** 通过指令唯一标识构造一个指令对象实例
     * @param command 指令唯一标识
     */
    constructor(command) {
      super(() => this.dispose());
      var subscriptions: vscode.Disposable[] = [];
      subscriptions.push(
        vscode.commands.registerCommand(command, (...args) => this._execute(command, ...args), this));
      this._disposable = vscode.Disposable.from(...subscriptions);
    }

    /** 生成指令的Markdown文档 */
    static getMarkdownCommandArgsCore(command, args) {
      return `command:${command}?${encodeURIComponent(JSON.stringify(args))}`;
    }

    /** 销毁指令对象 */
    dispose() {
      this._disposable && this._disposable.dispose();
    }

    /** 执行指令
     * @param command 指令标识
     * @param args 调用指令时传入的参数清单
     */
    protected _execute(command: string, ...args) {
      return this.execute(...args);
    }

    /** 通过传入的参数清单调用指令
     * @param args 调用指令时传入的参数清单
     */
    abstract execute(args?: {});
  }

  /** [abstract] 表示一个活动编辑器指令对象实例
   * @author smalls
   */
  export abstract class ActiveEditorCommand extends Command {

    /** 通过指令表示构造一个活动编辑器指令对象实例
     * @param command 指令的唯一标识
     */
    constructor(command) {
      super(command);
    }

    /** 执行指令
     * @param command 指令标识
     * @param args 调用指令时传入的参数清单
     */
    protected _execute(command, ...args) {
      return super._execute(command, vscode.window.activeTextEditor, ...args);
    }
  }

  /** 表示一个打开文档指令对象实例
   * @author smalls
   */
  export class OpenDocumentCommand extends ActiveEditorCommand {
    /** 获取可以调用的指令定义
     * @param args 调用指令时传入的参数清单
     */
    static getCommand(args: {}[]): { title: string, command: string, arguments: {}[] } {
      return {
        title: '打开文档',
        command: OPEN_DOCUMENT,
        arguments: args
      };
    }

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(OPEN_DOCUMENT);
    }

    /** 触发指令后的处理函数
     * @param editor 触发指令的编辑器
     * @param args 触发指令时传入的参数清单
     */
    execute(editor: vscode.TextEditor, ...args) {
      if (args == undefined || args == null || args.length < 1) {
        return;
      }
      let matedata = args[1] as views.MateData;
      if (!matedata || !matedata.document) { return; }
      vscode.window.showTextDocument(matedata.document);
    }
  }

  /** 表示一个定位属性代码所在行数指令对象实例
   * @author smalls
   */
  export class OpenLineCommand extends ActiveEditorCommand {

    /** 获取可以调用的指令定义
     * @param args 调用指令时传入的参数清单
     */
    static getCommand(args: {}[]): { title: string, command: string, arguments: {}[] } {
      return {
        title: '转到定义',
        command: OPEN_DOCUMENT_LINE,
        arguments: args
      };
    }

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(OPEN_DOCUMENT_LINE);
    }

    /** 触发指令后的处理函数
     * @param editor 触发指令的编辑器
     * @param args 触发指令时传入的参数清单
     */
    execute(editor: vscode.TextEditor, ...args) {
      if (args == undefined || args == null || args.length < 1) {
        return;
      }

      let matedata = args[1] as views.MateData;
      if (matedata == null) { return; }

      vscode.window.showTextDocument(matedata.document, {
        preview: true,
        selection: matedata.range
      });
    }

  }

  export class RefreshCommand extends Command {
    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(TREE_REFRESH);
    }
    /** 触发指令后的处理函数
     * @param args 触发指令时传入的参数清单
     */
    execute(...args) {
      let { ymate } = require('./');
      ymate.start();
    }
  }

  /** 表示一个展开全部TreeDate节点指令对象实例
   * @author smalls
   */
  export class TreeNodeExpandCommand extends Command {
    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(TREE_EXPAND_ALL);
    }
    /** 触发指令后的处理函数
     * @param args 触发指令时传入的参数清单
     */
    execute(...args) {
      let { ymate } = require('./');
      ymate.expandAll();
    }

  }

  export class TreeNodeCollpaseCommand extends Command {

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(TREE_COLLPASE_ALL);
    }

    /** 触发指令后的处理函数
     * @param args 触发指令时传入的参数清单
     */
    execute(...args) {
      let { ymate } = require('./');
      ymate.collpaseAll();
    }
  }

  /** 设置节点及其子节点的状态
   * @param node 需要设置状态的节点
   * @param state 需要设置的状态
   * @author smalls
   */
  function setNodeCollapsibleState(node: views.TreeNode, state: vscode.TreeItemCollapsibleState): void {
    node.collapsibleState = state;
    node.children.forEach(p => { setNodeCollapsibleState(p, state); });
  }

}

/** 描述一个文档解析器对象
 * @author smalls
 */
export interface IParser {
  /** 解析器节点实例 */
  readonly node: views.TreeNode;
  /** 解析器节点显示的内容 */
  readonly name: string;
  /** 解析器ID */
  readonly id: string;
  /** 解析器节点显示的图标 */
  readonly icon: string;
  /** 定义搜索的文件 */
  readonly pattern: string;
  /** 解析器所支持的文档语言编号 */
  readonly languageId: string;

  execute(document: vscode.TextDocument): void;
}

export abstract class BaseParser implements IParser {

  /** 构造一个解析器
   * @param name 解析器名称
   * @param id 解析器唯一标识
   * @param icon 解析器图标
   * @param pattern 解析器搜索规则
   * @param languageId 解析器语言
   */
  constructor(
    public readonly name: string,
    public readonly id: string,
    public readonly icon: string,
    public readonly pattern: string,
    public readonly languageId: string
  ) {
    this._node = views.buildTreeNode({
      label: name,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      icon: this.icon
    });
  }
  private _node: views.TreeNode;

  /** 解析器节点实例 */
  public get node(): views.TreeNode {
    return this._node;
  }

  /** 解析文档内容并且返回解析后的文档，解析失败返回null
   * @param document 需要解析的文档内容
   * @return 返回解析后的节点，如果失败则返回null
   */
  protected abstract parseDocument(document: vscode.TextDocument): views.TreeNode;

  public execute(document: vscode.TextDocument): void {
    let node = this.parseDocument(document);
    if (node) {
      this.node.push(node);
      this.node.sort();
    }
  }
}
