import * as vscode from "vscode";
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
   */
  private constructor(context: vscode.ExtensionContext) {
    this.output = vscode.window.createOutputChannel("ymate 控制台");
    this._context = context;
    this.rootNode = views.buildTreeNode({
      label: "根节点",
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded
    });
    this.explorer = views.Explorer.getInstand(context, this.rootNode);

    this.configureCommands(context);

    context.subscriptions.push(
      vscode.window.registerTreeDataProvider(views.Explorer.ID, this.explorer)
    );

  }

  /** 初始化VSCode插件核心
   * @param context VSCode插件上下文对象实例
   */
  static init(context: vscode.ExtensionContext): void {
    console.log("初始化YMate");
    if (!ymate) {
      ymate = new YMate(context);
    }
  }

  // #region 私有变量
  /** TreeData展示视图 */
  private explorer: views.Explorer;
  /** 控制台输出通道 */
  private output: vscode.OutputChannel;
  /** VScode插件上下文 */
  private _context: vscode.ExtensionContext;
  /** 表示树数据根节点元数据 */
  private rootNode: views.TreeNode;
  // #endregion #region 私有变量

  // #region 公共属性
  public get context(): vscode.ExtensionContext {
    return this._context;
  }
  /** 获取TreeData展示视图对象实例 */
  public get Explorer(): views.Explorer {
    return this.explorer;
  }
  // #endregion #region 公共属性

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

  /** 将TreeNode添加根节点 */
  public push(item: views.TreeNode): void {
    this.rootNode.push(item);
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
      if (matchNode.label != item.label) {
        matchNode.label = `${item.label}`;
      }
      matchNode.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      matchNode.children = item.children;
      this.explorer.refreshNode(parentNode);
    }

  }

  // #endregion #region 公共方法

  // #region 私有方法

  /** 配置指令
   * @param context 扩展对象上下文
   * @author smalls
   */
  private configureCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(new commands.TreeNodeCollpaseCommand());
    context.subscriptions.push(new commands.TreeNodeExpandCommand());
    context.subscriptions.push(new commands.OpenLineCommand());
    context.subscriptions.push(new commands.OpenDocumentCommand());
  }

  // #endregion #region 私有方法

}

/** 视图命名空间：定义视图元素内容*/
export namespace views {

  export function buildTreeNode(matedata: MateData): TreeNode {
    let node = new TreeNode(matedata.label);
    node.collapsibleState = matedata.collapsibleState;
    node.matedata = matedata;
    // node.contextValue = 'controller';
    if (ymate && ymate.context) {
      node.iconPath = ymate.context.asAbsolutePath(`images/${matedata.icon}.svg`);
    }
    if (matedata.range) {
      node.command = commands.OpenLineCommand.getCommand([this, matedata]);
    } else if (matedata.document) {
      node.command = commands.OpenDocumentCommand.getCommand([this, matedata]);
    }

    return node;
  }

  /** 提供树数据的数据提供程序
   * @author smalls
   * @version 1.0.0.0
   */
  export class Explorer implements vscode.TreeDataProvider<TreeNode> {

    public static ID: string = 'ymate.extensions.properties.explorer';
    private static __explorer: Explorer;
    public static getInstand(context: vscode.ExtensionContext, node: TreeNode) {
      if (!Explorer.__explorer) {
        Explorer.__explorer = new Explorer(context, node);
      }
      return Explorer.__explorer;
    }

    private __Node: TreeNode;
    /** 获取或设置扩展上下文对象实例 */
    public context: vscode.ExtensionContext;
    /** TreeDate内容更新事件 */
    private _onDidChangeTreeData: vscode.EventEmitter<TreeNode>;

    /** 构造一个TreeDate展示对象实例 */
    private constructor(context: vscode.ExtensionContext, node: TreeNode) {
      this.context = context;
      this.__Node = node;
      this._onDidChangeTreeData = new vscode.EventEmitter();
      this.refreshNode();
    }

    // #region Node Method

    /**
     * 表示元素或根已更改的可选事件。
     * 表示根已改变，不要通过任何参数或传递'未定义'或'空'。
     */
    get onDidChangeTreeData(): vscode.Event<TreeNode> {
      return this._onDidChangeTreeData.event;
    }

    /** 根据节点实例获取该节点的TreeItem实例
     * @param node 需要获取树节点的节点对象实例
     */
    getTreeItem(node: TreeNode): vscode.TreeItem {
      return node;
    }

    /** 根据节点实例获取该节点的全部子节点，如果节点为空则返回根节点的全部子节点。
     * @param node 需要子节点的节点实例
     */
    getChildren(node: TreeNode): TreeNode[] {
      if (node === undefined) {
        return this.__Node.children;
      } else {
        return node.children;
      }
    }

    /** 获取TreeData根节点对象实例 */
    getRootNode(): TreeNode {
      return this.__Node;
    }

    // #endregion #region Node Method

    // #region Method

    /** 刷新指定节点的内容
     * @param node 需要刷新内容的节点
     */
    refreshNode(node: TreeNode = undefined) {
      this._onDidChangeTreeData.fire(node);
    }

    // #endregion // #region Method

  }

  /** 表示树数据节点的元数据
   * @author smalls
   * @version 1.0.0.0
   */
  export interface MateData {
    /** 元数据名称 */
    // name: string;
    /** 文件路径：唯一标识 */
    file?: string;
    /** 父级元数据名称 */
    // parent: string;
    /** 标签名称 */
    label: string,
    /** 属性的值  */
    value?: string;
    /** 实体节点的图标名称 */
    icon?: string;
    /** 实体节点的展开状态 */
    collapsibleState?: vscode.TreeItemCollapsibleState;
    /** 数据类型 */
    dataType?: DataType;
    /** 代码信息所属的文档对象*/
    document?: vscode.TextDocument;
    /** 代码信息对应的内容范围对象 */
    range?: vscode.Range;
    /** 代码信息对应的文件路径 */
    uri?: vscode.Uri;
  }

  /** 表示树数据的数据节点
   * @author smalls
   * @version 1.0.0.0
   */
  export class TreeNode extends vscode.TreeItem {

    constructor(label: string) {
      super(label);
      this.children = [];
    }
    /** 扩展的上下文 */
    public context: vscode.ExtensionContext;

    public push(node: TreeNode): void {
      if (node) {
        this.children.push(node);
        this.label = `${this.matedata.label} [${this.children.length}]`;
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

    public remove(node: TreeNode): void {
      if (node) {
        let newNodes: TreeNode[] = [];
        this.children.forEach(child => {
          if (child.label != node.label) {
            newNodes.push(child);
          }
        });
        this.children = newNodes;
      }
    }

    public children: TreeNode[];

    public matedata: MateData;

  }

}

export namespace options {
  /** 展示文档并且选定区域设置项
   * @author smalls
   */
  export class ShowRangeOptions implements vscode.TextDocumentShowOptions {

    constructor(range: vscode.Range) {
      this.selection = range;
      this.preserveFocus = true;
    }

    public preserveFocus?: boolean;
    public selection?: vscode.Range;
  }
}

export namespace utils {

  /** 扫描目录中的文件
  * @param pattern 需要扫描的文件规则，默认为`**\*.java`
  */
  export async function scan(include: string = '**/*.java', exclude?: string): Promise<vscode.Uri[]> {
    let promise = new Promise<vscode.Uri[]>(resolve => {
      vscode.workspace.findFiles(include, exclude).then(resolve);
    });
    return promise;
  }

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

    /**
     * 执行指令
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
    /**
     * 执行指令
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
    /** 指令标识 */
    static Command = 'ymate.extensions.properties.opendocument';
    /** 获取可以调用的指令定义
     * @param args 调用指令时传入的参数清单
     */
    static getCommand(args: {}[]): { title: string, command: string, arguments: {}[] } {
      return {
        title: '打开文档',
        command: OpenDocumentCommand.Command,
        arguments: args
      };
    }

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(OpenDocumentCommand.Command);
    }

    /** 触发指令后的处理函数
     * @param editor 触发指令的编辑器
     * @param args 触发指令时传入的参数清单
     */
    execute(editor: vscode.TextEditor, ...args) {

      if (args == undefined || args == null || args.length < 1) {
        return;
      }

      let metadata = args[1] as views.MateData;
      if (metadata == null) { return; }
      if (metadata.uri) {
        vscode.window.showTextDocument(metadata.uri);
      } else if (metadata.document) {
        vscode.window.showTextDocument(metadata.document);
      }
    }
  }

  /** 表示一个定位属性代码所在行数指令对象实例
   * @author smalls
   */
  export class OpenLineCommand extends ActiveEditorCommand {
    /** 指令标识 */
    static Command = 'ymate.extensions.properties.openline';

    /** 获取可以调用的指令定义
     * @param args 调用指令时传入的参数清单
     */
    static getCommand(args: {}[]): { title: string, command: string, arguments: {}[] } {
      return {
        title: '转到定义',
        command: OpenLineCommand.Command,
        arguments: args
      };
    }

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(OpenLineCommand.Command);
    }

    /** 触发指令后的处理函数
     * @param editor 触发指令的编辑器
     * @param args 触发指令时传入的参数清单
     */
    execute(editor: vscode.TextEditor, ...args) {
      if (args == undefined || args == null || args.length < 1) {
        return;
      }

      let metadata = args[1] as views.MateData;
      if (metadata == null) { return; }
      vscode.window.showTextDocument(metadata.document, new options.ShowRangeOptions(metadata.range));
    }
  }

  /** 表示一个展开全部TreeDate节点指令对象实例
   * @author smalls
   */
  export class TreeNodeExpandCommand extends Command {
    /** 指令标识 */
    static Command = 'ymate.extensions.properties.tree.expand';

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(TreeNodeExpandCommand.Command);
    }

    /** 触发指令后的处理函数
     * @param editor 触发指令的编辑器
     * @param args 触发指令时传入的参数清单
     */
    execute(...args) {

    }
  }

  export class TreeNodeCollpaseCommand extends Command {
    /** 指令标识 */
    static Command = 'ymate.extensions.properties.tree.collpase';

    /** 构造一个定位属性代码所在行数指令对象实例 */
    constructor() {
      super(TreeNodeCollpaseCommand.Command);
    }

    /** 触发指令后的处理函数
     * @param editor 触发指令的编辑器
     * @param args 触发指令时传入的参数清单
     */
    execute(editor: vscode.TextEditor, ...args) {
      let { views } = require("../ymate");
      vscode.window.showInformationMessage("消息", "消息1", "消息2");
    }
  }

}

/** 描述文档文本中单个变化的事件。
 * @author smalls
 */
export class DocumentContentChangeEvent implements vscode.TextDocumentContentChangeEvent {
  /** 被替换的范围 */
  public range: vscode.Range;
  /** 被替换的范围长度*/
  public rangeLength: number;
  /** 范围的新文本内容*/
  public text: string;
}

/** 描述一个文档对象变化的事件
 * @author smalls
 */
export class DocumentChangeEvent implements vscode.TextDocumentChangeEvent {
  /** 受影响的文档对象 */
  public document: vscode.TextDocument;

  /** 更改的内容数组 */
  public contentChanges: DocumentContentChangeEvent[];
}

/** 描述一个文档对象即将保存的事件
 * @author smalls
 */
export class DocumentWillSaveEvent implements vscode.TextDocumentWillSaveEvent {
  public document: vscode.TextDocument;

  public reason: vscode.TextDocumentSaveReason;

  // public waitUntil(thenable: Thenable<vscode.TextEdit[]>): void {
  // }

  public waitUntil(thenable: Thenable<any>): void {

  }
}

/** 表示参数数据类型
 * @author smalls
 */
export enum DataType {
  /** 字符串类型：string */
  String,
  /** 布尔类型：boolean */
  Boolean,
  /** 枚举类型：enum */
  Enum,
  /** 数值类型：Number */
  Number
}



    // GlyphChars["ArrowBack"] = "\u21A9";
    // GlyphChars["ArrowDown"] = "\u2193";
    // GlyphChars["ArrowDropRight"] = "\u2937";
    // GlyphChars["ArrowLeft"] = "\u2190";
    // GlyphChars["ArrowLeftRight"] = "\u2194";
    // GlyphChars["ArrowRight"] = "\u2192";
    // GlyphChars["ArrowRightHollow"] = "\u21E8";
    // GlyphChars["ArrowUp"] = "\u2191";
    // GlyphChars["ArrowUpRight"] = "\u2197";
    // GlyphChars["Asterisk"] = "\u2217";
    // GlyphChars["Check"] = "\u2713";
    // GlyphChars["Dash"] = "\u2014";
    // GlyphChars["Dot"] = "\u2022";
    // GlyphChars["DoubleArrowLeft"] = "\u226A";
    // GlyphChars["DoubleArrowRight"] = "\u22D8";
    // GlyphChars["Ellipsis"] = "\u2026";
    // GlyphChars["MiddleEllipsis"] = "\u22EF";
    // GlyphChars["Pensil"] = "\u270E";
    // GlyphChars["Space"] = "\u00A0";
    // GlyphChars["SquareWithBottomShadow"] = "\u274F";
    // GlyphChars["SquareWithTopShadow"] = "\u2750";
    // GlyphChars["ZeroWidthSpace"] = "\u200B";
