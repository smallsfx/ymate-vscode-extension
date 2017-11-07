import { Code } from "./Code";
/**
 * 表示一个拦截器对象的实例
 * @author smalls
 */
export class Filter extends Code {
  /**
   * 通过名称构造一个拦截器对象的实例
   * @param name 拦截器的类名
   */
  constructor(name: string) {
    super(name);
  }
}