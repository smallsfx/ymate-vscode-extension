import { Code } from "./Code";
/**
 * 表示一个模块对象的实例
 * @author smalls
 */
export class Module extends Code {
  /**
   * 通过名称构造一个模块器对象的实例
   * @param name 模块的类名
   */
  constructor(name: string) {
    super(name);
  }
}