# 装饰器模式 (Decorator Pattern) - 程序界的“包装大师”

## 什么是装饰器模式？

想象一下，你买了一个普通的生日蛋糕，然后你可以根据需要添加各种装饰：奶油、水果、巧克力片、生日蜡烛...每次添加装饰，蛋糕就变得更丰富，但本质还是那个蛋糕。装饰器模式就是这样——它动态地给一个对象添加一些额外的职责，而不需要修改原来的类。

**装饰器模式**动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活。

## 为什么需要装饰器模式？

在以下场景中，装饰器模式特别有用：

1. 在不影响其他对象的情况下，以动态、透明的方式给单个对象添加职责
2. 处理那些可以撤销的职责
3. 当不能采用生成子类的方法进行扩充时

传统继承的问题：
- 静态：在编译时就已经确定
- 糟糕的扩展性：每增加一个新功能都需要创建一个子类

装饰器模式提供了一个更灵活的替代方案。

## 装饰器模式的实现

### 咖啡店示例

```java
// 组件接口 - 咖啡接口
interface Coffee {
    String getDescription();
    double cost();
}

// 具体组件 - 基础咖啡
class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "简单咖啡";
    }
    
    @Override
    public double cost() {
        return 1.00; // 基础价格
    }
}

// 装饰器抽象类
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
    
    @Override
    public double cost() {
        return decoratedCoffee.cost();
    }
}

// 具体装饰器 - 牛奶
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + ", 加牛奶";
    }
    
    @Override
    public double cost() {
        return super.cost() + 0.50; // 牛奶价格
    }
}

// 具体装饰器 - 糖
class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + ", 加糖";
    }
    
    @Override
    public double cost() {
        return super.cost() + 0.25; // 糖价格
    }
}

// 具体装饰器 - 奶泡
class FoamDecorator extends CoffeeDecorator {
    public FoamDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + ", 加奶泡";
    }
    
    @Override
    public double cost() {
        return super.cost() + 0.75; // 奶泡价格
    }
}

// 具体装饰器 - 巧克力
class ChocolateDecorator extends CoffeeDecorator {
    public ChocolateDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return super.getDescription() + ", 加巧克力";
    }
    
    @Override
    public double cost() {
        return super.cost() + 1.00; // 巧克力价格
    }
}
```

### IO流装饰器示例

```java
import java.io.*;
import java.util.Base64;

// 接口定义
interface DataSource {
    void writeData(String data);
    String readData();
}

// 基础数据源
class FileDataSource implements DataSource {
    private String filename;
    
    public FileDataSource(String filename) {
        this.filename = filename;
    }
    
    @Override
    public void writeData(String data) {
        System.out.println("将数据写入文件: " + filename);
        // 实际写入文件的逻辑
        System.out.println("写入数据: " + data);
    }
    
    @Override
    public String readData() {
        System.out.println("从文件读取数据: " + filename);
        // 实际读取文件的逻辑
        return "文件内容: " + filename;
    }
}

// 抽象装饰器
abstract class DataSourceDecorator implements DataSource {
    protected DataSource wrappee;
    
    DataSourceDecorator(DataSource source) {
        this.wrappee = source;
    }
    
    @Override
    public void writeData(String data) {
        wrappee.writeData(data);
    }
    
    @Override
    public String readData() {
        return wrappee.readData();
    }
}

// 加密装饰器
class EncryptionDecorator extends DataSourceDecorator {
    public EncryptionDecorator(DataSource source) {
        super(source);
    }
    
    @Override
    public void writeData(String data) {
        // 加密数据
        String encryptedData = encrypt(data);
        super.writeData(encryptedData);
    }
    
    @Override
    public String readData() {
        String result = super.readData();
        // 解密数据
        return decrypt(result);
    }
    
    private String encrypt(String data) {
        // 简单的Base64加密示例
        return Base64.getEncoder().encodeToString(data.getBytes());
    }
    
    private String decrypt(String data) {
        // 简单的Base64解密示例
        byte[] bytes = Base64.getDecoder().decode(data);
        return new String(bytes);
    }
}

// 压缩装饰器
class CompressionDecorator extends DataSourceDecorator {
    public CompressionDecorator(DataSource source) {
        super(source);
    }
    
    @Override
    public void writeData(String data) {
        // 压缩数据
        String compressedData = compress(data);
        super.writeData(compressedData);
    }
    
    @Override
    public String readData() {
        String result = super.readData();
        // 解压数据
        return decompress(result);
    }
    
    private String compress(String data) {
        // 简单的压缩示例（实际应该是压缩算法）
        return "[COMPRESSED]" + data + "[/COMPRESSED]";
    }
    
    private String decompress(String data) {
        // 简单的解压示例
        return data.replace("[COMPRESSED]", "").replace("[/COMPRESSED]", "");
    }
}
```

## 实际应用场景

### 通知系统装饰器示例

```java
// 通知接口
interface Notification {
    void send(String message);
}

// 基础通知实现
class BasicNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("发送基础通知: " + message);
    }
}

// 抽象装饰器
abstract class NotificationDecorator implements Notification {
    protected Notification notification;
    
    public NotificationDecorator(Notification notification) {
        this.notification = notification;
    }
    
    @Override
    public void send(String message) {
        notification.send(message);
    }
}

// 电子邮件通知装饰器
class EmailNotificationDecorator extends NotificationDecorator {
    public EmailNotificationDecorator(Notification notification) {
        super(notification);
    }
    
    @Override
    public void send(String message) {
        super.send(message);
        sendEmail(message);
    }
    
    private void sendEmail(String message) {
        System.out.println("通过邮件发送通知副本: " + message);
    }
}

// 短信通知装饰器
class SMSNotificationDecorator extends NotificationDecorator {
    public SMSNotificationDecorator(Notification notification) {
        super(notification);
    }
    
    @Override
    public void send(String message) {
        super.send(message);
        sendSMS(message);
    }
    
    private void sendSMS(String message) {
        System.out.println("通过短信发送通知副本: " + message);
    }
}

// 推送通知装饰器
class PushNotificationDecorator extends NotificationDecorator {
    public PushNotificationDecorator(Notification notification) {
        super(notification);
    }
    
    @Override
    public void send(String message) {
        super.send(message);
        sendPush(message);
    }
    
    private void sendPush(String message) {
        System.out.println("通过推送发送通知副本: " + message);
    }
}

// 优先级装饰器
class PriorityNotificationDecorator extends NotificationDecorator {
    private String priority;
    
    public PriorityNotificationDecorator(Notification notification, String priority) {
        super(notification);
        this.priority = priority;
    }
    
    @Override
    public void send(String message) {
        System.out.println("【" + priority + "优先级】");
        super.send(message);
    }
}
```

### 图形界面组件装饰器示例

```java
// 组件接口
interface VisualComponent {
    void draw();
    void resize();
}

// 基础组件
class TextView implements VisualComponent {
    private String content;
    
    public TextView(String content) {
        this.content = content;
    }
    
    @Override
    public void draw() {
        System.out.println("绘制文本视图: " + content);
    }
    
    @Override
    public void resize() {
        System.out.println("调整文本视图大小");
    }
}

class Window implements VisualComponent {
    @Override
    public void draw() {
        System.out.println("绘制窗口边框");
    }
    
    @Override
    public void resize() {
        System.out.println("调整窗口大小");
    }
}

// 抽象装饰器
abstract class VisualComponentDecorator implements VisualComponent {
    protected VisualComponent component;
    
    public VisualComponentDecorator(VisualComponent component) {
        this.component = component;
    }
    
    @Override
    public void draw() {
        component.draw();
    }
    
    @Override
    public void resize() {
        component.resize();
    }
}

// 滚动条装饰器
class ScrollBarDecorator extends VisualComponentDecorator {
    public ScrollBarDecorator(VisualComponent component) {
        super(component);
    }
    
    @Override
    public void draw() {
        super.draw();
        drawScrollBar();
    }
    
    private void drawScrollBar() {
        System.out.println("  绘制滚动条");
    }
    
    @Override
    public void resize() {
        super.resize();
        System.out.println("  调整滚动条");
    }
}

// 边框装饰器
class BorderDecorator extends VisualComponentDecorator {
    private String borderColor;
    
    public BorderDecorator(VisualComponent component, String borderColor) {
        super(component);
        this.borderColor = borderColor;
    }
    
    @Override
    public void draw() {
        drawBorder();
        super.draw();
    }
    
    private void drawBorder() {
        System.out.println("绘制" + borderColor + "边框");
    }
    
    @Override
    public void resize() {
        System.out.println("调整" + borderColor + "边框");
        super.resize();
    }
}

// 背景装饰器
class BackgroundDecorator extends VisualComponentDecorator {
    private String backgroundColor;
    
    public BackgroundDecorator(VisualComponent component, String backgroundColor) {
        super(component);
        this.backgroundColor = backgroundColor;
    }
    
    @Override
    public void draw() {
        drawBackground();
        super.draw();
    }
    
    private void drawBackground() {
        System.out.println("绘制" + backgroundColor + "背景");
    }
    
    @Override
    public void resize() {
        super.resize();
        System.out.println("调整背景");
    }
}
```

### 游戏角色装备系统示例

```java
// 角色接口
interface GameCharacter {
    String getName();
    int getAttackPower();
    int getDefense();
    String getSpecialAbilities();
}

// 基础角色
class BasicCharacter implements GameCharacter {
    private String name;
    
    public BasicCharacter(String name) {
        this.name = name;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public int getAttackPower() {
        return 10;
    }
    
    @Override
    public int getDefense() {
        return 5;
    }
    
    @Override
    public String getSpecialAbilities() {
        return "无特殊能力";
    }
}

// 角色装饰器抽象类
abstract class CharacterDecorator implements GameCharacter {
    protected GameCharacter character;
    
    public CharacterDecorator(GameCharacter character) {
        this.character = character;
    }
    
    @Override
    public String getName() {
        return character.getName();
    }
    
    @Override
    public int getAttackPower() {
        return character.getAttackPower();
    }
    
    @Override
    public int getDefense() {
        return character.getDefense();
    }
    
    @Override
    public String getSpecialAbilities() {
        return character.getSpecialAbilities();
    }
}

// 武器装饰器
class WeaponDecorator extends CharacterDecorator {
    private String weaponName;
    private int attackBonus;
    
    public WeaponDecorator(GameCharacter character, String weaponName, int attackBonus) {
        super(character);
        this.weaponName = weaponName;
        this.attackBonus = attackBonus;
    }
    
    @Override
    public int getAttackPower() {
        return super.getAttackPower() + attackBonus;
    }
    
    @Override
    public String getSpecialAbilities() {
        return super.getSpecialAbilities() + ", 持有" + weaponName;
    }
}

// 防具装饰器
class ArmorDecorator extends CharacterDecorator {
    private String armorName;
    private int defenseBonus;
    
    public ArmorDecorator(GameCharacter character, String armorName, int defenseBonus) {
        super(character);
        this.armorName = armorName;
        this.defenseBonus = defenseBonus;
    }
    
    @Override
    public int getDefense() {
        return super.getDefense() + defenseBonus;
    }
    
    @Override
    public String getSpecialAbilities() {
        return super.getSpecialAbilities() + ", 穿戴" + armorName;
    }
}

// 技能装饰器
class SkillDecorator extends CharacterDecorator {
    private String skillName;
    
    public SkillDecorator(GameCharacter character, String skillName) {
        super(character);
        this.skillName = skillName;
    }
    
    @Override
    public String getSpecialAbilities() {
        return super.getSpecialAbilities() + ", 拥有技能: " + skillName;
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 咖啡店示例 ===");
        
        // 简单咖啡
        Coffee simpleCoffee = new SimpleCoffee();
        System.out.println(simpleCoffee.getDescription() + 
                          ": $" + simpleCoffee.cost());
        
        // 加牛奶的咖啡
        Coffee milkCoffee = new MilkDecorator(new SimpleCoffee());
        System.out.println(milkCoffee.getDescription() + 
                          ": $" + milkCoffee.cost());
        
        // 加牛奶和糖的咖啡
        Coffee milkAndSugarCoffee = new SugarDecorator(
            new MilkDecorator(new SimpleCoffee()));
        System.out.println(milkAndSugarCoffee.getDescription() + 
                          ": $" + milkAndSugarCoffee.cost());
        
        // 豪华咖啡：加牛奶、糖、奶泡和巧克力
        Coffee luxuryCoffee = new ChocolateDecorator(
            new FoamDecorator(
                new SugarDecorator(
                    new MilkDecorator(new SimpleCoffee()))));
        System.out.println(luxuryCoffee.getDescription() + 
                          ": $" + luxuryCoffee.cost());
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== IO流装饰器示例 ===");
        
        // 基础文件数据源
        DataSource fileDataSource = new FileDataSource("test.txt");
        fileDataSource.writeData("原始数据");
        System.out.println("读取: " + fileDataSource.readData());
        
        System.out.println();
        
        // 加密 + 压缩的文件数据源
        DataSource encryptedCompressedSource = new CompressionDecorator(
            new EncryptionDecorator(
                new FileDataSource("encrypted_compressed.txt")));
        encryptedCompressedSource.writeData("敏感数据");
        System.out.println("读取: " + encryptedCompressedSource.readData());
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== 通知系统示例 ===");
        
        // 基础通知
        Notification basic = new BasicNotification();
        basic.send("系统消息");
        
        System.out.println();
        
        // 优先级 + 邮件通知
        Notification priorityEmail = new EmailNotificationDecorator(
            new PriorityNotificationDecorator(new BasicNotification(), "高"));
        priorityEmail.send("紧急通知");
        
        System.out.println();
        
        // 复杂组合：优先级 + 邮件 + 短信 + 推送
        Notification complex = new PushNotificationDecorator(
            new SMSNotificationDecorator(
                new EmailNotificationDecorator(
                    new PriorityNotificationDecorator(
                        new BasicNotification(), "最高"))));
        complex.send("系统崩溃警告");
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== 游戏角色系统示例 ===");
        
        // 基础角色
        GameCharacter warrior = new BasicCharacter("勇者");
        System.out.println("角色: " + warrior.getName());
        System.out.println("攻击力: " + warrior.getAttackPower());
        System.out.println("防御力: " + warrior.getDefense());
        System.out.println("特殊能力: " + warrior.getSpecialAbilities());
        
        System.out.println();
        
        // 装备后的角色
        GameCharacter equippedWarrior = new SkillDecorator(
            new ArmorDecorator(
                new WeaponDecorator(
                    new BasicCharacter("装备勇士"), 
                    "火焰剑", 15), 
                "钢铁盔甲", 10), 
            "火焰冲击");
        
        System.out.println("角色: " + equippedWarrior.getName());
        System.out.println("攻击力: " + equippedWarrior.getAttackPower());
        System.out.println("防御力: " + equippedWarrior.getDefense());
        System.out.println("特殊能力: " + equippedWarrior.getSpecialAbilities());
    }
}
```

## 装饰器模式的优缺点

### 优点
1. 比继承更灵活，可以动态地添加功能
2. 遵循开闭原则，对扩展开放，对修改关闭
3. 可以根据需要有选择地给对象添加功能
4. 符合单一职责原则，每个装饰器只负责一项功能

### 缺点
1. 装饰器模式会导致设计中出现许多小对象
2. 这些小对象可能会让程序变得复杂
3. 装饰器的排错会变得困难

## 与适配器模式的区别

- **装饰器模式**：增强对象功能，保持原有接口
- **适配器模式**：转换接口，使接口兼容

## 与桥接模式的区别

- **装饰器模式**：动态添加职责
- **桥接模式**：分离抽象和实现

## 总结

装饰器模式就像程序界的“包装大师”——它让你可以像包装礼物一样，一层一层地给对象添加功能，而不会改变对象的本质。就像给蛋糕加装饰一样，蛋糕还是那个蛋糕，但变得更丰富了。

记住：**装饰器模式适用于需要动态添加功能的场景，就像你需要给咖啡添加牛奶、糖、奶油一样！**

在Java标准库中，IO流（InputStream、OutputStream等）是装饰器模式的经典应用，通过层层包装实现各种功能。