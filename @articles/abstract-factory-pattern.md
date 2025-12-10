# 抽象工厂模式 (Abstract Factory Pattern) - 程序界的“制造工厂集团”

## 什么是抽象工厂模式？

想象一下，你是一家大型餐厅连锁集团的老板，你需要在不同城市开设餐厅。在北京开一家，需要有北京风格的菜品、北京风格的餐具、北京风格的装修；在上海开一家，需要有上海风格的菜品、上海风格的餐具、上海风格的装修。

抽象工厂模式就是帮你解决这个问题的——它提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。就像一个“工厂集团”，能批量生产一整套风格统一的产品。

## 为什么需要抽象工厂模式？

当你的系统需要创建多个产品族，且这些产品族中的产品需要相互匹配时，抽象工厂模式就派上用场了。

比如：
- 不同操作系统的UI组件（Windows风格、Mac风格、Linux风格）
- 不同主题的界面元素（深色主题、浅色主题）
- 不同数据库的访问组件（MySQL、Oracle、PostgreSQL）

## 抽象工厂模式的实现

### 产品族接口定义

```java
// 按钮接口
interface Button {
    void paint();
}

// 文本框接口
interface TextBox {
    void render();
}

// 滚动条接口
interface ScrollBar {
    void display();
}

// Windows风格的实现
class WindowsButton implements Button {
    @Override
    public void paint() {
        System.out.println("绘制Windows风格的按钮");
    }
}

class WindowsTextBox implements TextBox {
    @Override
    public void render() {
        System.out.println("渲染Windows风格的文本框");
    }
}

class WindowsScrollBar implements ScrollBar {
    @Override
    public void display() {
        System.out.println("显示Windows风格的滚动条");
    }
}

// Mac风格的实现
class MacButton implements Button {
    @Override
    public void paint() {
        System.out.println("绘制Mac风格的按钮");
    }
}

class MacTextBox implements TextBox {
    @Override
    public void render() {
        System.out.println("渲染Mac风格的文本框");
    }
}

class MacScrollBar implements ScrollBar {
    @Override
    public void display() {
        System.out.println("显示Mac风格的滚动条");
    }
}
```

### 抽象工厂接口

```java
// 抽象工厂接口
interface GUIFactory {
    Button createButton();
    TextBox createTextBox();
    ScrollBar createScrollBar();
}

// Windows风格的具体工厂
class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public TextBox createTextBox() {
        return new WindowsTextBox();
    }
    
    @Override
    public ScrollBar createScrollBar() {
        return new WindowsScrollBar();
    }
}

// Mac风格的具体工厂
class MacFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacButton();
    }
    
    @Override
    public TextBox createTextBox() {
        return new MacTextBox();
    }
    
    @Override
    public ScrollBar createScrollBar() {
        return new MacScrollBar();
    }
}
```

## 实际应用场景

### UI主题管理系统示例

```java
// 应用程序类 - 模拟跨平台UI应用
public class Application {
    private Button button;
    private TextBox textBox;
    private ScrollBar scrollBar;
    
    public Application(GUIFactory factory) {
        // 使用工厂创建所有UI组件
        this.button = factory.createButton();
        this.textBox = factory.createTextBox();
        this.scrollBar = factory.createScrollBar();
    }
    
    public void paint() {
        button.paint();
        textBox.render();
        scrollBar.display();
    }
    
    public static void main(String[] args) {
        // 根据操作系统类型创建对应的UI工厂
        String osName = System.getProperty("os.name").toLowerCase();
        GUIFactory factory;
        
        if (osName.contains("windows")) {
            factory = new WindowsFactory();
            System.out.println("检测到Windows系统，加载Windows风格UI");
        } else if (osName.contains("mac")) {
            factory = new MacFactory();
            System.out.println("检测到Mac系统，加载Mac风格UI");
        } else {
            // 默认使用Windows风格
            factory = new WindowsFactory();
            System.out.println("未知系统，使用默认Windows风格UI");
        }
        
        Application app = new Application(factory);
        app.paint();
    }
}
```

### 游戏皮肤系统示例

```java
// 角色接口
interface Character {
    void attack();
    void defend();
}

// 武器接口
interface Weapon {
    void use();
}

// 道具接口
interface Prop {
    void deploy();
}

// 中世纪风格的具体实现
class MedievalKnight implements Character {
    @Override
    public void attack() {
        System.out.println("骑士挥舞长剑攻击！");
    }
    
    @Override
    public void defend() {
        System.out.println("骑士举起盾牌防御！");
    }
}

class MedievalSword implements Weapon {
    @Override
    public void use() {
        System.out.println("挥舞着锋利的钢剑！");
    }
}

class MedievalShield implements Prop {
    @Override
    public void deploy() {
        System.out.println("部署坚固的木制盾牌！");
    }
}

// 未来科技风格的具体实现
class SciFiSoldier implements Character {
    @Override
    public void attack() {
        System.out.println("士兵使用激光枪射击！");
    }
    
    @Override
    public void defend() {
        System.out.println("士兵启动能量护盾防御！");
    }
}

class SciFiLaser implements Weapon {
    @Override
    public void use() {
        System.out.println("发射高能激光！");
    }
}

class SciFiShield implements Prop {
    @Override
    public void deploy() {
        System.out.println("激活能量护盾！");
    }
}

// 游戏主题抽象工厂
interface GameThemeFactory {
    Character createCharacter();
    Weapon createWeapon();
    Prop createProp();
}

class MedievalFactory implements GameThemeFactory {
    @Override
    public Character createCharacter() {
        return new MedievalKnight();
    }
    
    @Override
    public Weapon createWeapon() {
        return new MedievalSword();
    }
    
    @Override
    public Prop createProp() {
        return new MedievalShield();
    }
}

class SciFiFactory implements GameThemeFactory {
    @Override
    public Character createCharacter() {
        return new SciFiSoldier();
    }
    
    @Override
    public Weapon createWeapon() {
        return new SciFiLaser();
    }
    
    @Override
    public Prop createProp() {
        return new SciFiShield();
    }
}

// 游戏角色创建器
class GameCharacterBuilder {
    private GameThemeFactory factory;
    
    public GameCharacterBuilder(GameThemeFactory factory) {
        this.factory = factory;
    }
    
    public void buildCharacter() {
        Character character = factory.createCharacter();
        Weapon weapon = factory.createWeapon();
        Prop prop = factory.createProp();
        
        System.out.println("创建游戏角色中...");
        character.attack();
        weapon.use();
        prop.deploy();
        character.defend();
        System.out.println("角色创建完成！");
    }
    
    public static void main(String[] args) {
        // 创建中世纪风格的角色
        System.out.println("=== 创建中世纪风格角色 ===");
        GameCharacterBuilder medievalBuilder = 
            new GameCharacterBuilder(new MedievalFactory());
        medievalBuilder.buildCharacter();
        
        System.out.println("\n=== 创建科幻风格角色 ===");
        GameCharacterBuilder sciFiBuilder = 
            new GameCharacterBuilder(new SciFiFactory());
        sciFiBuilder.buildCharacter();
    }
}
```

### 数据库访问抽象工厂示例

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

// 数据库访问组件接口
interface DBConnection {
    void connect();
}

interface DBCommand {
    void execute(String sql);
}

interface DBResultSet {
    void process();
}

// MySQL实现
class MySQLConnection implements DBConnection {
    @Override
    public void connect() {
        System.out.println("连接到MySQL数据库");
    }
}

class MySQLCommand implements DBCommand {
    @Override
    public void execute(String sql) {
        System.out.println("执行MySQL SQL: " + sql);
    }
}

class MySQLResultSet implements DBResultSet {
    @Override
    public void process() {
        System.out.println("处理MySQL结果集");
    }
}

// Oracle实现
class OracleConnection implements DBConnection {
    @Override
    public void connect() {
        System.out.println("连接到Oracle数据库");
    }
}

class OracleCommand implements DBCommand {
    @Override
    public void execute(String sql) {
        System.out.println("执行Oracle SQL: " + sql);
    }
}

class OracleResultSet implements DBResultSet {
    @Override
    public void process() {
        System.out.println("处理Oracle结果集");
    }
}

// 数据库抽象工厂
interface DatabaseFactory {
    DBConnection createConnection();
    DBCommand createCommand();
    DBResultSet createResultSet();
}

class MySQLFactory implements DatabaseFactory {
    @Override
    public DBConnection createConnection() {
        return new MySQLConnection();
    }
    
    @Override
    public DBCommand createCommand() {
        return new MySQLCommand();
    }
    
    @Override
    public DBResultSet createResultSet() {
        return new MySQLResultSet();
    }
}

class OracleFactory implements DatabaseFactory {
    @Override
    public DBConnection createConnection() {
        return new OracleConnection();
    }
    
    @Override
    public DBCommand createCommand() {
        return new OracleCommand();
    }
    
    @Override
    public DBResultSet createResultSet() {
        return new OracleResultSet();
    }
}

// 数据访问服务
class DataAccessService {
    private DatabaseFactory factory;
    
    public DataAccessService(DatabaseFactory factory) {
        this.factory = factory;
    }
    
    public void performDatabaseOperation(String sql) {
        DBConnection connection = factory.createConnection();
        DBCommand command = factory.createCommand();
        DBResultSet resultSet = factory.createResultSet();
        
        connection.connect();
        command.execute(sql);
        resultSet.process();
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 选择Windows风格
        GUIFactory windowsFactory = new WindowsFactory();
        Application windowsApp = new Application(windowsFactory);
        System.out.println("Windows应用:");
        windowsApp.paint();
        
        System.out.println("\n" + "=".repeat(30) + "\n");
        
        // 选择Mac风格
        GUIFactory macFactory = new MacFactory();
        Application macApp = new Application(macFactory);
        System.out.println("Mac应用:");
        macApp.paint();
    }
}
```

## 抽象工厂模式的优缺点

### 优点
1. 分离具体类的生成，客户端不需要知道具体产品类的创建细节
2. 保证同一产品族中的产品对象能够一起使用
3. 易于交换产品系列，只需更换对应的工厂
4. 有利于产品的一致性（风格统一）

### 缺点
1. 难以支持新种类的产品，因为抽象工厂接口中每个方法都对应一个产品
2. 增加系统的抽象性和理解难度
3. 每增加一个产品族，需要创建多个类

## 与工厂模式的区别

- **工厂模式**：创建单一产品，一个工厂只创建一个类型的产品
- **抽象工厂模式**：创建产品族，一个工厂创建一系列相关的不同类型产品

## 总结

抽象工厂模式就像一个“制造工厂集团”——当你需要一整套风格统一的产品时，它帮你批量制造。比如你去宜家买家具，所有的家具都是一套风格，这就是产品族的概念。

记住：**抽象工厂模式适用于需要创建一系列相关产品的场景，就像你装修房子需要一套风格统一的家具一样！**

在企业级开发中，抽象工厂模式常用于构建多套UI主题、数据库访问层等需要保持一致性的组件集合。