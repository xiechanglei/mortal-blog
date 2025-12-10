# 桥接模式 (Bridge Pattern) - 程序界的“立交桥”

## 什么是桥接模式？

想象一下，你正在设计一个遥控器，但电视品牌有多个（如索尼、三星、LG），而遥控器也有不同类型（如基础遥控器、高级遥控器、智能遥控器）。如果用传统方法实现，你需要为每种组合创建一个类：索尼基础遥控器、索尼高级遥控器、索尼智能遥控器、三星基础遥控器...这将导致类爆炸。

桥接模式就像程序界的“立交桥”——它将抽象部分与实现部分分离，使它们都可以独立变化。就像立交桥让不同方向的车流互不干扰地运行一样。

## 为什么需要桥接模式？

当你遇到以下情况时，桥接模式就派上用场了：

1. 避免在抽象和具体实现之间有固定的绑定关系
2. 需要在构件的抽象化角色和具体化角色之间增加更多灵活性
3. 对一个抽象的实现部分的修改应对客户不产生影响
4. 需要有多维度变化的系统

## 桥接模式的实现

### 抽象与实现分离

```java
// 实现接口 - 电视品牌接口
interface TV {
    void on();
    void off();
    void changeChannel(int channel);
    void setVolume(int volume);
}

// 具体实现 - 索尼电视
class SonyTV implements TV {
    @Override
    public void on() {
        System.out.println("Sony TV is on");
    }
    
    @Override
    public void off() {
        System.out.println("Sony TV is off");
    }
    
    @Override
    public void changeChannel(int channel) {
        System.out.println("Sony TV channel changed to: " + channel);
    }
    
    @Override
    public void setVolume(int volume) {
        System.out.println("Sony TV volume set to: " + volume);
    }
}

// 具体实现 - 三星电视
class SamsungTV implements TV {
    @Override
    public void on() {
        System.out.println("Samsung TV is on");
    }
    
    @Override
    public void off() {
        System.out.println("Samsung TV is off");
    }
    
    @Override
    public void changeChannel(int channel) {
        System.out.println("Samsung TV channel changed to: " + channel);
    }
    
    @Override
    public void setVolume(int volume) {
        System.out.println("Samsung TV volume set to: " + volume);
    }
}

// 抽象类 - 遥控器抽象
abstract class RemoteControl {
    protected TV tv; // 桥接的实现部分
    
    public RemoteControl(TV tv) {
        this.tv = tv;
    }
    
    public abstract void turnOn();
    public abstract void turnOff();
    public abstract void changeChannel(int channel);
    
    // 具体的实现操作委托给TV对象
    public void setVolume(int volume) {
        tv.setVolume(volume);
    }
}

// 具体抽象 - 基础遥控器
class BasicRemote extends RemoteControl {
    public BasicRemote(TV tv) {
        super(tv);
    }
    
    @Override
    public void turnOn() {
        System.out.println("Pressing basic ON button...");
        tv.on();
    }
    
    @Override
    public void turnOff() {
        System.out.println("Pressing basic OFF button...");
        tv.off();
    }
    
    @Override
    public void changeChannel(int channel) {
        System.out.println("Pressing basic channel button...");
        tv.changeChannel(channel);
    }
}

// 具体抽象 - 高级遥控器
class AdvancedRemote extends RemoteControl {
    public AdvancedRemote(TV tv) {
        super(tv);
    }
    
    @Override
    public void turnOn() {
        System.out.println("Advanced remote: Long press ON button...");
        tv.on();
    }
    
    @Override
    public void turnOff() {
        System.out.println("Advanced remote: Long press OFF button...");
        tv.off();
    }
    
    @Override
    public void changeChannel(int channel) {
        System.out.println("Advanced remote: Channel wheel to " + channel);
        tv.changeChannel(channel);
    }
    
    public void mute() {
        System.out.println("Advanced remote: Mute activated");
        tv.setVolume(0);
    }
}
```

### 更复杂的桥接示例

```java
// 抽象接口 - 数据库驱动接口
interface DatabaseDriver {
    void connect(String connectionString);
    void executeQuery(String sql);
    void close();
}

// 具体实现 - MySQL驱动
class MySQLDriver implements DatabaseDriver {
    @Override
    public void connect(String connectionString) {
        System.out.println("连接到MySQL数据库: " + connectionString);
    }
    
    @Override
    public void executeQuery(String sql) {
        System.out.println("执行MySQL查询: " + sql);
    }
    
    @Override
    public void close() {
        System.out.println("关闭MySQL连接");
    }
}

// 具体实现 - Oracle驱动
class OracleDriver implements DatabaseDriver {
    @Override
    public void connect(String connectionString) {
        System.out.println("连接到Oracle数据库: " + connectionString);
    }
    
    @Override
    public void executeQuery(String sql) {
        System.out.println("执行Oracle查询: " + sql);
    }
    
    @Override
    public void close() {
        System.out.println("关闭Oracle连接");
    }
}

// 抽象类 - 数据访问对象
abstract class DAO {
    protected DatabaseDriver driver;
    
    public DAO(DatabaseDriver driver) {
        this.driver = driver;
    }
    
    public abstract void create(Object obj);
    public abstract void read(String id);
    public abstract void update(Object obj);
    public abstract void delete(String id);
    
    // 通用方法
    public void executeQuery(String sql) {
        driver.executeQuery(sql);
    }
}

// 具体抽象 - 用户数据访问对象
class UserDAO extends DAO {
    public UserDAO(DatabaseDriver driver) {
        super(driver);
    }
    
    @Override
    public void create(Object obj) {
        System.out.println("创建用户: " + obj.toString());
        driver.executeQuery("INSERT INTO users ...");
    }
    
    @Override
    public void read(String id) {
        System.out.println("读取用户ID: " + id);
        driver.executeQuery("SELECT * FROM users WHERE id = " + id);
    }
    
    @Override
    public void update(Object obj) {
        System.out.println("更新用户: " + obj.toString());
        driver.executeQuery("UPDATE users SET ...");
    }
    
    @Override
    public void delete(String id) {
        System.out.println("删除用户ID: " + id);
        driver.executeQuery("DELETE FROM users WHERE id = " + id);
    }
}

// 订单数据访问对象
class OrderDAO extends DAO {
    public OrderDAO(DatabaseDriver driver) {
        super(driver);
    }
    
    @Override
    public void create(Object obj) {
        System.out.println("创建订单: " + obj.toString());
        driver.executeQuery("INSERT INTO orders ...");
    }
    
    @Override
    public void read(String id) {
        System.out.println("读取订单ID: " + id);
        driver.executeQuery("SELECT * FROM orders WHERE id = " + id);
    }
    
    @Override
    public void update(Object obj) {
        System.out.println("更新订单: " + obj.toString());
        driver.executeQuery("UPDATE orders SET ...");
    }
    
    @Override
    public void delete(String id) {
        System.out.println("删除订单ID: " + id);
        driver.executeQuery("DELETE FROM orders WHERE id = " + id);
    }
}
```

## 实际应用场景

### 形状绘制系统示例

```java
// 实现接口 - 绘制引擎
interface DrawingAPI {
    void drawCircle(int x, int y, int radius);
    void drawRectangle(int x, int y, int width, int height);
    void drawLine(int x1, int y1, int x2, int y2);
}

// 具体实现 - Windows绘制引擎
class WindowsDrawingAPI implements DrawingAPI {
    @Override
    public void drawCircle(int x, int y, int radius) {
        System.out.println("在Windows上绘制圆形: (" + x + "," + y + ") 半径:" + radius);
    }
    
    @Override
    public void drawRectangle(int x, int y, int width, int height) {
        System.out.println("在Windows上绘制矩形: (" + x + "," + y + ") " + width + "x" + height);
    }
    
    @Override
    public void drawLine(int x1, int y1, int x2, int y2) {
        System.out.println("在Windows上绘制直线: (" + x1 + "," + y1 + ") 到 (" + x2 + "," + y2 + ")");
    }
}

// 具体实现 - Linux绘制引擎
class LinuxDrawingAPI implements DrawingAPI {
    @Override
    public void drawCircle(int x, int y, int radius) {
        System.out.println("在Linux上绘制圆形: (" + x + "," + y + ") 半径:" + radius);
    }
    
    @Override
    public void drawRectangle(int x, int y, int width, int height) {
        System.out.println("在Linux上绘制矩形: (" + x + "," + y + ") " + width + "x" + height);
    }
    
    @Override
    public void drawLine(int x1, int y1, int x2, int y2) {
        System.out.println("在Linux上绘制直线: (" + x1 + "," + y1 + ") 到 (" + x2 + "," + y2 + ")");
    }
}

// 抽象类 - 图形形状
abstract class Shape {
    protected DrawingAPI drawingAPI;
    
    protected Shape(DrawingAPI drawingAPI) {
        this.drawingAPI = drawingAPI;
    }
    
    public abstract void draw();
    public abstract void resize(int factor);
}

// 具体抽象 - 圆形
class Circle extends Shape {
    private int x, y, radius;
    
    public Circle(int x, int y, int radius, DrawingAPI drawingAPI) {
        super(drawingAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    @Override
    public void draw() {
        drawingAPI.drawCircle(x, y, radius);
    }
    
    @Override
    public void resize(int factor) {
        radius *= factor;
    }
}

// 具体抽象 - 矩形
class Rectangle extends Shape {
    private int x, y, width, height;
    
    public Rectangle(int x, int y, int width, int height, DrawingAPI drawingAPI) {
        super(drawingAPI);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    @Override
    public void draw() {
        drawingAPI.drawRectangle(x, y, width, height);
    }
    
    @Override
    public void resize(int factor) {
        width *= factor;
        height *= factor;
    }
}

// 演示桥接模式
public class BridgePatternDemo {
    public static void main(String[] args) {
        // Windows上画圆
        Shape circleOnWindows = new Circle(10, 10, 5, new WindowsDrawingAPI());
        circleOnWindows.draw();
        
        // Linux上画圆
        Shape circleOnLinux = new Circle(20, 20, 8, new LinuxDrawingAPI());
        circleOnLinux.draw();
        
        // Windows上画矩形
        Shape rectangleOnWindows = new Rectangle(5, 5, 10, 15, new WindowsDrawingAPI());
        rectangleOnWindows.draw();
        
        // Linux上画矩形
        Shape rectangleOnLinux = new Rectangle(15, 15, 12, 18, new LinuxDrawingAPI());
        rectangleOnLinux.draw();
    }
}
```

### 消息通知系统示例

```java
// 实现接口 - 通知发送方式
interface NotificationSender {
    void send(String message, String recipient);
    String getChannelName();
}

// 具体实现 - 邮件通知
class EmailSender implements NotificationSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("发送邮件到 " + recipient + ": " + message);
    }
    
    @Override
    public String getChannelName() {
        return "Email";
    }
}

// 具体实现 - 短信通知
class SMSSender implements NotificationSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("发送短信到 " + recipient + ": " + message);
    }
    
    @Override
    public String getChannelName() {
        return "SMS";
    }
}

// 具体实现 - 推送通知
class PushSender implements NotificationSender {
    @Override
    public void send(String message, String recipient) {
        System.out.println("推送通知到 " + recipient + ": " + message);
    }
    
    @Override
    public String getChannelName() {
        return "Push";
    }
}

// 抽象类 - 通知类型
abstract class Notification {
    protected NotificationSender sender;
    
    protected Notification(NotificationSender sender) {
        this.sender = sender;
    }
    
    public abstract void notify(String message, String recipient);
}

// 具体抽象 - 系统通知
class SystemNotification extends Notification {
    public SystemNotification(NotificationSender sender) {
        super(sender);
    }
    
    @Override
    public void notify(String message, String recipient) {
        System.out.println("发送系统通知通过" + sender.getChannelName() + ":");
        sender.send("[系统消息] " + message, recipient);
    }
}

// 具体抽象 - 营销通知
class MarketingNotification extends Notification {
    public MarketingNotification(NotificationSender sender) {
        super(sender);
    }
    
    @Override
    public void notify(String message, String recipient) {
        System.out.println("发送营销通知通过" + sender.getChannelName() + ":");
        sender.send("[促销信息] " + message, recipient);
    }
}

// 用户通知
class UserNotification extends Notification {
    public UserNotification(NotificationSender sender) {
        super(sender);
    }
    
    @Override
    public void notify(String message, String recipient) {
        System.out.println("发送用户通知通过" + sender.getChannelName() + ":");
        sender.send("[用户消息] " + message, recipient);
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 测试遥控器系统
        System.out.println("=== 遥控器系统 ===");
        
        // 索尼电视 + 基础遥控器
        TV sonyTV = new SonyTV();
        RemoteControl basicRemote = new BasicRemote(sonyTV);
        basicRemote.turnOn();
        basicRemote.changeChannel(5);
        basicRemote.setVolume(10);
        basicRemote.turnOff();
        
        System.out.println();
        
        // 三星电视 + 高级遥控器
        TV samsungTV = new SamsungTV();
        AdvancedRemote advancedRemote = new AdvancedRemote(samsungTV);
        advancedRemote.turnOn();
        advancedRemote.changeChannel(3);
        advancedRemote.setVolume(20);
        advancedRemote.mute();
        advancedRemote.turnOff();
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // 测试数据访问系统
        System.out.println("=== 数据访问系统 ===");
        
        // MySQL + 用户DAO
        DatabaseDriver mysqlDriver = new MySQLDriver();
        DAO userDAO = new UserDAO(mysqlDriver);
        userDAO.create("用户123");
        userDAO.read("123");
        
        System.out.println();
        
        // Oracle + 订单DAO
        DatabaseDriver oracleDriver = new OracleDriver();
        DAO orderDAO = new OrderDAO(oracleDriver);
        orderDAO.create("订单456");
        orderDAO.read("456");
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // 测试通知系统
        System.out.println("=== 通知系统 ===");
        
        // 邮件系统通知
        NotificationSender emailSender = new EmailSender();
        Notification systemNotification = new SystemNotification(emailSender);
        systemNotification.notify("系统维护通知", "admin@company.com");
        
        System.out.println();
        
        // SMS营销通知
        NotificationSender smsSender = new SMSSender();
        Notification marketingNotification = new MarketingNotification(smsSender);
        marketingNotification.notify("双11大促销", "13800138000");
        
        System.out.println();
        
        // 推送用户通知
        NotificationSender pushSender = new PushSender();
        Notification userNotification = new UserNotification(pushSender);
        userNotification.notify("您有一条新消息", "user123");
    }
}
```

## 桥接模式的优缺点

### 优点
1. 分离抽象接口及其实现部分，提高系统可扩展性
2. 改善代码的可扩展性，实现和抽象可以独立扩展
3. 实现细节对客户透明，客户不用关心实现细节
4. 可以动态切换实现

### 缺点
1. 桥接模式的引入会增加系统的理解与设计难度
2. 需要正确识别出系统中两个独立变化的维度
3. 增加了系统的复杂度

## 与适配器模式的区别

- **桥接模式**：设计阶段的模式，在设计时就考虑到了多维度的变化
- **适配器模式**：解决现有类接口不兼容的问题，是后期适配

## 总结

桥接模式就像程序界的“立交桥”——它巧妙地分离了抽象和实现，让它们可以独立变化。就像立交桥让不同的车流互不干扰地运行一样，桥接模式让不同的变化维度独立发展。

记住：**桥接模式适用于有多维度变化的系统，就像你需要同时支持多种操作系统和多种UI主题一样！**

在Java标准库中，JDBC驱动程序的设计就体现了桥接模式的思想，Connection接口的实现可以切换不同的数据库厂商实现。