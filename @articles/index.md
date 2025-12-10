# GoF设计模式详解 - 目录索引

## 概述

欢迎来到GoF（Gang of Four）设计模式的完整指南！本系列文档详细讲解了23种经典设计模式，每种模式都配有详细的Java实现示例、实际应用场景和诙谐易懂的解释。

## 设计模式分类

### 创建型模式 (Creational Patterns)
这些模式提供对象创建机制，增加代码的灵活性和可复用性。

1. **[单例模式 (Singleton Pattern)](./singleton-pattern.md)**
   - 程序界的"独行侠"
   - 确保一个类只有一个实例
   
2. **[工厂模式 (Factory Pattern)](./factory-pattern.md)**
   - 程序界的"制造车间"
   - 将对象的创建过程封装起来

3. **[抽象工厂模式 (Abstract Factory Pattern)](./abstract-factory-pattern.md)**
   - 程序界的"制造工厂集团"
   - 创建一系列相关或相互依赖对象的接口

4. **[建造者模式 (Builder Pattern)](./builder-pattern.md)**
   - 程序界的"乐高积木大师"
   - 将一个复杂对象的构建与其表示分离

5. **[原型模式 (Prototype Pattern)](./prototype-pattern.md)**
   - 程序界的"复印机"
   - 通过复制现有对象来创建新对象

### 结构型模式 (Structural Patterns)
这些模式解释如何将对象和类组装成更大的结构。

6. **[适配器模式 (Adapter Pattern)](./adapter-pattern.md)**
   - 程序界的"万能转换头"
   - 将一个类的接口转换成客户希望的另一个接口

7. **[桥接模式 (Bridge Pattern)](./bridge-pattern.md)**
   - 程序界的"立交桥"
   - 将抽象部分与实现部分分离，使它们都可以独立变化

8. **[组合模式 (Composite Pattern)](./composite-pattern.md)**
   - 程序界的"俄罗斯套娃"
   - 将对象组合成树形结构以表示"部分-整体"的层次结构

9. **[装饰器模式 (Decorator Pattern)](./decorator-pattern.md)**
   - 程序界的"包装大师"
   - 动态地给一个对象添加一些额外的职责

10. **[外观模式 (Facade Pattern)](./facade-pattern.md)**
    - 程序界的"一站式服务"
    - 为子系统中的一组接口提供一个一致的界面

11. **[享元模式 (Flyweight Pattern)](./flyweight-pattern.md)**
    - 程序界的"共享经济"
    - 运用共享技术有效地支持大量细粒度的对象

12. **[代理模式 (Proxy Pattern)](./proxy-pattern.md)**
    - 程序界的"代购小哥"
    - 为其他对象提供一种代理以控制对这个对象的访问

### 行为型模式 (Behavioral Patterns)
这些模式负责对象之间的交互和职责分配。

13. **[责任链模式 (Chain of Responsibility Pattern)](./chain-of-responsibility-pattern.md)**
    - 程序界的"流水线工人"
    - 使多个对象都有机会处理请求

14. **[命令模式 (Command Pattern)](./command-pattern.md)**
    - 程序界的"遥控器"
    - 将一个请求封装为一个对象

15. **[解释器模式 (Interpreter Pattern)](./interpreter-pattern.md)**
    - 程序界的"翻译官"
    - 定义语言的文法，并建立一个解释器来解释该语言中的句子

16. **[迭代器模式 (Iterator Pattern)](./iterator-pattern.md)**
    - 程序界的"翻页器"
    - 提供一种方法来访问聚合对象中的各个元素

17. **[中介者模式 (Mediator Pattern)](./mediator-pattern.md)**
    - 程序界的"调度中心"
    - 用一个中介对象来封装一系列对象之间的交互

18. **[备忘录模式 (Memento Pattern)](./memento-pattern.md)**
    - 程序界的"时光机"
    - 在不破坏封装性的前提下保存对象的内部状态

19. **[观察者模式 (Observer Pattern)](./observer-pattern.md)**
    - 程序界的"广播站"
    - 定义对象间的一对多依赖关系

20. **[状态模式 (State Pattern)](./state-pattern.md)**
    - 程序界的"千面人"
    - 允许一个对象在其内部状态改变时改变它的行为

21. **[策略模式 (Strategy Pattern)](./strategy-pattern.md)**
    - 程序界的"多面手"
    - 定义了一系列算法，并将每个算法封装起来

22. **[模板方法模式 (Template Method Pattern)](./template-method-pattern.md)**
    - 程序界的"标准化流程"
    - 定义一个操作中的算法骨架

23. **[访问者模式 (Visitor Pattern)](./visitor-pattern.md)**
    - 程序界的"审计员"
    - 表示一个作用于某对象结构中的各元素的操作

## 设计原则总结

在学习设计模式的过程中，需要理解以下几个重要原则：

### SOLID原则
- **S (单一职责原则)**: 一个类应该只有一个改变的原因
- **O (开闭原则)**: 对扩展开放，对修改关闭
- **L (里氏替换原则)**: 子类型必须能够替换它们的基类型
- **I (接口隔离原则)**: 客户端不应该依赖它不需要的接口
- **D (依赖倒置原则)**: 依赖于抽象而不是具体实现

### 其他重要原则
- **合成/聚合复用原则**: 优先使用组合而非继承
- **最少知识原则**: 只与直接朋友通信

## 学习建议

1. **理解而非记忆**: 重点理解每种模式的意图和适用场景
2. **实践出真知**: 动手编写示例代码，加深理解
3. **适度使用**: 不要为了使用设计模式而使用设计模式
4. **结合实际**: 将设计模式与实际项目需求相结合
5. **持续学习**: 随着经验积累，对设计模式的理解会更加深入

## 进阶学习

- 研究现代框架中设计模式的应用
- 学习架构模式和企业级设计模式
- 了解反模式和常见设计陷阱
- 掌握测试驱动开发和设计模式的关系

希望这些文档能帮助您更好地掌握设计模式，提高代码质量和系统可维护性！