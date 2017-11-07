import * as vscode from 'vscode';
import { Code } from "./Code";
/** 表示一个属性信息对象的实例
 * @author smalls
 */
export class Property extends Code {
  /**
   * 通过一个属性的名称，构造一个属性信息对象的实例
   * @param name 属性的名称
   */
  constructor(name: string) {
    super(name);
    this.children = [];
  }
  /**
   * 属性的值
   */
  public value: string;
  /**
   * 属性的子属性
   */
  public children: Property[]

  /** 属性类型 */
  public type: PropertyType;

  /** 属性数据类型 */
  public dataType: DataType;
}

/** 表示属性类型
 * @author smalls
 */
export enum PropertyType {
  /** 包对象 */
  Package = 0,
  /** 值对象 */
  Value = 1,
  /** 注视对象 */
  Summany = 2
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