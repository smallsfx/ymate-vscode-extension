/**
 * 表示一个消息对象的实例
 * @author smalls
 */
export class MessageEntry {
  /**
   * 通过一个消息的内容，构造一个消息对象的实例
   * @param name 属性的名称
   */
  constructor(text: string) {
    this.text = text;
  }
  /**
   * 消息内容
   */
  public text: string;
}