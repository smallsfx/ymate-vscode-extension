import { Code } from "./Code";
/**
 * 表示一个控制器对象的实例
 * @author smalls
 */
export class Controller extends Code {
  /**
   * 通过名称构造一个控制器对象的实例
   * @param name 控制器的类名
   */
  constructor(name: string) {
    super(name);
    this.interfaces = [];
  }

  public interfaces: ControllerInterface[];
}

/**
 * 表示一个控制器接口对象的实例
 * @author smalls
 */
export class ControllerInterface extends Code {
  /**
   * 通过名称构造一个控制器接口对象的实例
   * @param name 控制器接口的名称
   */
  constructor(name: string) {
    super(name);
  }
}