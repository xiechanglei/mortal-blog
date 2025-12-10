# 原型模式 (Prototype Pattern) - 程序界的“复印机”

## 什么是原型模式？

想象一下，你是复印店老板，客户给你一张纸说："请复印100份这样的文档"。你不需要重新写每一遍，而是直接复印。原型模式就是程序界的"复印机"——通过复制现有对象来创建新对象，而不是使用构造函数重新创建。

**原型模式**用原型实例指定创建对象的种类，并且通过复制这些原型创建新的对象。

## 为什么需要原型模式？

在以下场景中，原型模式特别有用：

1. 创建对象成本高的时候（比如初始化需要大量数据查询）
2. 创建复杂对象时，对象的部分属性在创建后不会改变
3. 需要动态决定创建哪种对象类型

就像你不想每次都花时间重新配置电脑，而是从一个已经配置好的电脑克隆一样。

## 原型模式的实现

### 克隆接口定义

```java
// 实现Cloneable接口是Java中克隆的基础
interface Prototype extends Cloneable {
    // 定义克隆方法
    Object clone() throws CloneNotSupportedException;
}

// 具体原型类 - 员工信息
public class Employee implements Cloneable {
    private String name;
    private int age;
    private String department;
    private Address address; // 包含复杂对象
    
    public Employee(String name, int age, String department, Address address) {
        this.name = name;
        this.age = age;
        this.department = department;
        this.address = address;
    }
    
    // 深拷贝实现
    @Override
    public Object clone() throws CloneNotSupportedException {
        Employee cloned = (Employee) super.clone();
        // 对于复杂对象，需要手动进行深拷贝
        if (this.address != null) {
            cloned.address = (Address) this.address.clone();
        }
        return cloned;
    }
    
    // Getter和Setter方法
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    
    @Override
    public String toString() {
        return "Employee{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", department='" + department + '\'' +
                ", address=" + address +
                '}';
    }
}

// 地址类 - 也需要支持克隆
class Address implements Cloneable {
    private String street;
    private String city;
    private String zipCode;
    
    public Address(String street, String city, String zipCode) {
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
    
    @Override
    public String toString() {
        return "Address{" +
                "street='" + street + '\'' +
                ", city='" + city + '\'' +
                ", zipCode='" + zipCode + '\'' +
                '}';
    }
}
```

### 抽象原型实现

```java
// 抽象原型类
abstract class Shape implements Cloneable {
    protected String id;
    protected String type;
    
    abstract void draw();
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        Object cloned = super.clone();
        // 可以在克隆后进行一些个性化设置
        ((Shape) cloned).id = generateNewId();
        return cloned;
    }
    
    private String generateNewId() {
        return this.type + "_" + System.currentTimeMillis();
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getType() {
        return type;
    }
}

// 具体原型类
class Rectangle extends Shape {
    public Rectangle() {
        type = "Rectangle";
    }
    
    @Override
    void draw() {
        System.out.println("绘制矩形");
    }
}

class Circle extends Shape {
    public Circle() {
        type = "Circle";
    }
    
    @Override
    void draw() {
        System.out.println("绘制圆形");
    }
}

class Triangle extends Shape {
    public Triangle() {
        type = "Triangle";
    }
    
    @Override
    void draw() {
        System.out.println("绘制三角形");
    }
}
```

## 实际应用场景

### 游戏开发中的敌人原型

```java
// 游戏角色原型
public class Enemy implements Cloneable {
    private String name;
    private int health;
    private int attack;
    private String weapon;
    private Position position;
    
    public Enemy(String name, int health, int attack, String weapon, Position position) {
        this.name = name;
        this.health = health;
        this.attack = attack;
        this.weapon = weapon;
        this.position = position;
    }
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        Enemy cloned = (Enemy) super.clone();
        // 深拷贝位置信息
        if (this.position != null) {
            cloned.position = (Position) this.position.clone();
        }
        // 为克隆出来的敌人生成新位置
        if (cloned.position != null) {
            cloned.position.randomize();
        }
        return cloned;
    }
    
    public void attack() {
        System.out.println(name + " 使用 " + weapon + " 攻击，造成 " + attack + " 点伤害！");
    }
    
    // Getter方法...
    public String getName() { return name; }
    public int getHealth() { return health; }
    public int getAttack() { return attack; }
    public String getWeapon() { return weapon; }
    public Position getPosition() { return position; }
}

// 位置类
class Position implements Cloneable {
    private int x, y;
    
    public Position(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public void randomize() {
        this.x = (int) (Math.random() * 100);
        this.y = (int) (Math.random() * 100);
    }
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
    
    @Override
    public String toString() {
        return "Position{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}

// 游戏工厂类
class GameFactory {
    private Enemy enemyPrototype;
    
    public GameFactory(Enemy enemyPrototype) {
        this.enemyPrototype = enemyPrototype;
    }
    
    public Enemy createEnemy() {
        try {
            return (Enemy) enemyPrototype.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

### 配置文件克隆示例

```java
import java.util.HashMap;
import java.util.Map;

// 配置原型
public class Configuration implements Cloneable {
    private String serverUrl;
    private int timeout;
    private Map<String, String> properties;
    
    public Configuration() {
        this.properties = new HashMap<>();
    }
    
    public Configuration(String serverUrl, int timeout, Map<String, String> properties) {
        this.serverUrl = serverUrl;
        this.timeout = timeout;
        this.properties = new HashMap<>(properties); // 深拷贝
    }
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        Configuration cloned = (Configuration) super.clone();
        // 深拷贝属性映射
        cloned.properties = new HashMap<>(this.properties);
        return cloned;
    }
    
    // Getter和Setter方法
    public String getServerUrl() { return serverUrl; }
    public void setServerUrl(String serverUrl) { this.serverUrl = serverUrl; }
    
    public int getTimeout() { return timeout; }
    public void setTimeout(int timeout) { this.timeout = timeout; }
    
    public Map<String, String> getProperties() { return properties; }
    public void setProperties(Map<String, String> properties) { 
        this.properties = new HashMap<>(properties); 
    }
    
    public void addProperty(String key, String value) {
        this.properties.put(key, value);
    }
    
    @Override
    public String toString() {
        return "Configuration{" +
                "serverUrl='" + serverUrl + '\'' +
                ", timeout=" + timeout +
                ", properties=" + properties +
                '}';
    }
    
    public static void main(String[] args) throws CloneNotSupportedException {
        // 创建基础配置原型
        Map<String, String> baseProps = new HashMap<>();
        baseProps.put("encoding", "UTF-8");
        baseProps.put("compression", "gzip");
        
        Configuration baseConfig = new Configuration("https://api.example.com", 5000, baseProps);
        
        // 克隆并修改生产环境配置
        Configuration prodConfig = (Configuration) baseConfig.clone();
        prodConfig.setServerUrl("https://prod.example.com");
        prodConfig.addProperty("env", "production");
        prodConfig.addProperty("logging", "verbose");
        
        // 克隆并修改测试环境配置
        Configuration testConfig = (Configuration) baseConfig.clone();
        testConfig.setServerUrl("https://test.example.com");
        testConfig.setTimeout(2000);
        testConfig.addProperty("env", "testing");
        testConfig.addProperty("debug", "true");
        
        System.out.println("基础配置: " + baseConfig);
        System.out.println("生产配置: " + prodConfig);
        System.out.println("测试配置: " + testConfig);
    }
}
```

### 图表模板克隆示例

```java
import java.util.ArrayList;
import java.util.List;

// 图表原型
public class ChartTemplate implements Cloneable {
    private String title;
    private String type; // bar, line, pie等
    private List<String> dataLabels;
    private ChartStyle style;
    private boolean showLegend;
    private String colorScheme;
    
    public ChartTemplate() {
        this.dataLabels = new ArrayList<>();
    }
    
    public ChartTemplate(String title, String type, List<String> dataLabels, 
                        ChartStyle style, boolean showLegend, String colorScheme) {
        this.title = title;
        this.type = type;
        this.dataLabels = new ArrayList<>(dataLabels);
        this.style = style;
        this.showLegend = showLegend;
        this.colorScheme = colorScheme;
    }
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        ChartTemplate cloned = (ChartTemplate) super.clone();
        // 深拷贝数据标签列表
        cloned.dataLabels = new ArrayList<>(this.dataLabels);
        // 深拷贝样式
        if (this.style != null) {
            cloned.style = (ChartStyle) this.style.clone();
        }
        return cloned;
    }
    
    // 各种getter和setter方法...
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public List<String> getDataLabels() { return dataLabels; }
    public void setDataLabels(List<String> dataLabels) { 
        this.dataLabels = new ArrayList<>(dataLabels); 
    }
    
    public ChartStyle getStyle() { return style; }
    public void setStyle(ChartStyle style) { this.style = style; }
    
    public boolean isShowLegend() { return showLegend; }
    public void setShowLegend(boolean showLegend) { this.showLegend = showLegend; }
    
    public String getColorScheme() { return colorScheme; }
    public void setColorScheme(String colorScheme) { this.colorScheme = colorScheme; }
}

// 图表样式类
class ChartStyle implements Cloneable {
    private String backgroundColor;
    private String fontColor;
    private int fontSize;
    private boolean hasBorder;
    
    public ChartStyle(String backgroundColor, String fontColor, int fontSize, boolean hasBorder) {
        this.backgroundColor = backgroundColor;
        this.fontColor = fontColor;
        this.fontSize = fontSize;
        this.hasBorder = hasBorder;
    }
    
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        try {
            // 创建原型对象
            Address address = new Address("中山路123号", "北京市", "100000");
            Employee originalEmployee = new Employee("张三", 28, "开发部", address);
            
            System.out.println("原始员工信息:");
            System.out.println(originalEmployee);
            System.out.println();
            
            // 克隆员工信息
            Employee clonedEmployee = (Employee) originalEmployee.clone();
            clonedEmployee.setName("李四");
            clonedEmployee.setAge(30);
            clonedEmployee.getDepartment().charAt(0); // 这里我们修改部门
            clonedEmployee.setDepartment("测试部");
            
            System.out.println("克隆后的员工信息:");
            System.out.println(clonedEmployee);
            System.out.println();
            
            // 验证深拷贝是否正确
            System.out.println("验证深拷贝:");
            System.out.println("原始地址: " + originalEmployee.getAddress());
            System.out.println("克隆地址: " + clonedEmployee.getAddress());
            System.out.println("地址是否相同: " + (originalEmployee.getAddress() == clonedEmployee.getAddress()));
            
            System.out.println("\n" + "=".repeat(50) + "\n");
            
            // 图形克隆示例
            Shape rectanglePrototype = new Rectangle();
            rectanglePrototype.setId("rect_001");
            
            Shape clonedRectangle = (Shape) rectanglePrototype.clone();
            System.out.println("原矩形ID: " + rectanglePrototype.getId());
            System.out.println("克隆矩形ID: " + clonedRectangle.getId());
            clonedRectangle.draw();
            
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

## 浅拷贝 vs 深拷贝

### 浅拷贝
- 只复制对象本身，不复制对象内部的引用对象
- 新旧对象共享内部引用对象

### 深拷贝
- 不仅复制对象本身，还复制对象内部的所有引用对象
- 新旧对象完全独立

```java
// 举例说明
public class ShallowVsDeepCopy {
    public static void main(String[] args) throws CloneNotSupportedException {
        // 原始对象
        Address addr = new Address("中山路123号", "北京", "100000");
        Employee emp = new Employee("张三", 25, "开发部", addr);
        
        // 浅拷贝示例（如果只用super.clone()）
        Employee shallowCopy = (Employee) emp.clone(); // 假设只用了浅拷贝
        
        // 深拷贝示例（完整clone方法）
        Employee deepCopy = (Employee) emp.clone(); // 使用了深拷贝
        
        // 修改原始对象的地址信息
        emp.getAddress().setCity("上海");
        
        // 查看结果
        System.out.println("原始员工城市: " + emp.getAddress().getCity());
        System.out.println("深拷贝员工城市: " + deepCopy.getAddress().getCity());
    }
}
```

## 原型模式的优缺点

### 优点
1. 性能优良，直接在内存中拷贝
2. 避免了构造函数的约束
3. 便于动态增加和删除产品
4. 让客户在运行时添加和删除产品

### 缺点
1. 每个类都必须配备clone方法
2. 配备clone方法需要对类的功能进行通盘考虑
3. 深拷贝和浅拷贝的处理需要特别注意

## 总结

原型模式就像程序界的"复印机"——当你有一份很好的模板需要大量复制时，直接复印比重新制作要高效得多。

记住：**原型模式适合于创建成本高、结构相似的对象场景，就像你复印合同比重新起草合同要快得多！**

在实际开发中，原型模式经常与工厂模式结合使用，或者在需要创建大量相似对象时使用。