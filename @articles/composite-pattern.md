# 组合模式 (Composite Pattern) - 程序界的“俄罗斯套娃”

## 什么是组合模式？

想象一下俄罗斯套娃——一个大娃娃里面套着一个小一点的娃娃，小娃娃里面又套着更小的娃娃，以此类推。组合模式就像这种结构——它允许你将对象组合成树形结构来表示“部分-整体”的层次关系，使得客户端对单个对象和组合对象的使用具有一致性。

**组合模式**将对象组合成树形结构以表示“部分-整体”的层次结构。组合模式使得用户对单个对象和组合对象的使用具有一致性。

## 为什么需要组合模式？

在以下场景中，组合模式特别有用：

1. 表示对象的部分-整体层次结构
2. 希望用户忽略组合对象与单个对象的不同
3. 需要递归处理树形结构

比如：
- 文件系统（文件夹包含文件和子文件夹）
- GUI组件（窗口包含按钮、文本框等）
- 组织架构（公司包含部门，部门包含员工）
- 菜单系统（菜单包含子菜单和菜单项）

## 组合模式的实现

### 基础组合结构

```java
import java.util.*;

// 组件接口 - 定义组合中的对象接口
interface Component {
    void add(Component component);
    void remove(Component component);
    Component getChild(int index);
    String getName();
    double getSize();
    void display(int depth);
}

// 叶子组件 - 不包含子组件的对象
class File implements Component {
    private String name;
    private double size; // 文件大小（MB）
    
    public File(String name, double size) {
        this.name = name;
        this.size = size;
    }
    
    @Override
    public void add(Component component) {
        System.out.println("文件不支持添加子组件");
    }
    
    @Override
    public void remove(Component component) {
        System.out.println("文件不支持移除子组件");
    }
    
    @Override
    public Component getChild(int index) {
        System.out.println("文件没有子组件");
        return null;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public double getSize() {
        return size;
    }
    
    @Override
    public void display(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "📄 " + name + " (" + size + "MB)");
    }
}

// 复合组件 - 包含子组件的对象
class Folder implements Component {
    private String name;
    private List<Component> children;
    
    public Folder(String name) {
        this.name = name;
        this.children = new ArrayList<>();
    }
    
    @Override
    public void add(Component component) {
        children.add(component);
    }
    
    @Override
    public void remove(Component component) {
        children.remove(component);
    }
    
    @Override
    public Component getChild(int index) {
        if (index >= 0 && index < children.size()) {
            return children.get(index);
        }
        return null;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public double getSize() {
        double totalSize = 0;
        for (Component child : children) {
            totalSize += child.getSize();
        }
        return totalSize;
    }
    
    @Override
    public void display(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "📁 " + name + " (" + getSize() + "MB)");
        
        for (Component child : children) {
            child.display(depth + 1);
        }
    }
}
```

### 更复杂的组合示例

```java
// 公司组织架构示例
interface Employee {
    void add(Employee employee);
    void remove(Employee employee);
    Employee getChild(int index);
    String getName();
    String getPosition();
    double getSalary();
    void showEmployeeDetails(int depth);
}

// 叶子节点 - 普通员工
class Developer implements Employee {
    private String name;
    private String position;
    private double salary;
    
    public Developer(String name, double salary) {
        this.name = name;
        this.position = "Developer";
        this.salary = salary;
    }
    
    @Override
    public void add(Employee employee) {
        System.out.println("开发者不能添加下属");
    }
    
    @Override
    public void remove(Employee employee) {
        System.out.println("开发者没有下属");
    }
    
    @Override
    public Employee getChild(int index) {
        System.out.println("开发者没有下属");
        return null;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public String getPosition() {
        return position;
    }
    
    @Override
    public double getSalary() {
        return salary;
    }
    
    @Override
    public void showEmployeeDetails(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "👨‍💻 " + name + " - " + position + " (¥" + salary + ")");
    }
}

class Designer implements Employee {
    private String name;
    private String position;
    private double salary;
    
    public Designer(String name, double salary) {
        this.name = name;
        this.position = "Designer";
        this.salary = salary;
    }
    
    @Override
    public void add(Employee employee) {
        System.out.println("设计师不能添加下属");
    }
    
    @Override
    public void remove(Employee employee) {
        System.out.println("设计师没有下属");
    }
    
    @Override
    public Employee getChild(int index) {
        System.out.println("设计师没有下属");
        return null;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public String getPosition() {
        return position;
    }
    
    @Override
    public double getSalary() {
        return salary;
    }
    
    @Override
    public void showEmployeeDetails(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "🎨 " + name + " - " + position + " (¥" + salary + ")");
    }
}

// 复合节点 - 管理者
class Manager implements Employee {
    private String name;
    private String position;
    private double salary;
    private List<Employee> subordinates;
    
    public Manager(String name, String position, double salary) {
        this.name = name;
        this.position = position;
        this.salary = salary;
        this.subordinates = new ArrayList<>();
    }
    
    @Override
    public void add(Employee employee) {
        subordinates.add(employee);
    }
    
    @Override
    public void remove(Employee employee) {
        subordinates.remove(employee);
    }
    
    @Override
    public Employee getChild(int index) {
        if (index >= 0 && index < subordinates.size()) {
            return subordinates.get(index);
        }
        return null;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public String getPosition() {
        return position;
    }
    
    @Override
    public double getSalary() {
        return salary;
    }
    
    @Override
    public void showEmployeeDetails(int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "👔 " + name + " - " + position + " (¥" + salary + ")");
        
        for (Employee subordinate : subordinates) {
            subordinate.showEmployeeDetails(depth + 1);
        }
    }
}
```

## 实际应用场景

### 菜单系统示例

```java
import java.util.*;

// 菜单项接口
interface MenuItem {
    String getName();
    String getDescription();
    double getPrice();
    boolean isVegetarian();
    void print();
}

// 叶子节点 - 具体菜单项
class MenuItemImpl implements MenuItem {
    private String name;
    private String description;
    private boolean vegetarian;
    private double price;
    
    public MenuItemImpl(String name, String description, boolean vegetarian, double price) {
        this.name = name;
        this.description = description;
        this.vegetarian = vegetarian;
        this.price = price;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public String getDescription() {
        return description;
    }
    
    @Override
    public double getPrice() {
        return price;
    }
    
    @Override
    public boolean isVegetarian() {
        return vegetarian;
    }
    
    @Override
    public void print() {
        System.out.print("  " + getName());
        if (isVegetarian()) {
            System.out.print("(v)");
        }
        System.out.println(", ¥" + getPrice());
        System.out.println("  -- " + getDescription());
    }
}

// 复合节点 - 菜单
class Menu implements MenuItem {
    private String name;
    private String description;
    private List<MenuItem> menuItems;
    
    public Menu(String name, String description) {
        this.name = name;
        this.description = description;
        this.menuItems = new ArrayList<>();
    }
    
    public void add(MenuItem menuItem) {
        menuItems.add(menuItem);
    }
    
    public void remove(MenuItem menuItem) {
        menuItems.remove(menuItem);
    }
    
    public MenuItem getChild(int index) {
        if (index >= 0 && index < menuItems.size()) {
            return menuItems.get(index);
        }
        return null;
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public String getDescription() {
        return description;
    }
    
    @Override
    public double getPrice() {
        double total = 0;
        for (MenuItem item : menuItems) {
            total += item.getPrice();
        }
        return total;
    }
    
    @Override
    public boolean isVegetarian() {
        return false; // 菜单本身不标记为素食
    }
    
    @Override
    public void print() {
        System.out.println("\n" + getName() + ", " + getDescription());
        System.out.println("---------------------");
        
        for (MenuItem item : menuItems) {
            item.print();
        }
    }
    
    // 递归查找所有菜单项
    public void printVegetarianItems() {
        for (MenuItem item : menuItems) {
            if (item.isVegetarian()) {
                item.print();
            } else if (item instanceof Menu) {
                ((Menu) item).printVegetarianItems(); // 递归查找
            }
        }
    }
}

// 菜单管理器
class Waitress {
    private Menu topLevelMenu;
    
    public Waitress(Menu menu) {
        this.topLevelMenu = menu;
    }
    
    public void printMenu() {
        topLevelMenu.print();
    }
    
    public void printVegetarianMenu() {
        System.out.println("\n素食菜单:");
        System.out.println("----------");
        topLevelMenu.printVegetarianItems();
    }
}
```

### 图形界面组件示例

```java
// UI组件接口
interface UIComponent {
    void add(UIComponent component);
    void remove(UIComponent component);
    void render();
    void setLayout(String layout);
    String getId();
}

// 叶子组件 - 按钮
class Button implements UIComponent {
    private String id;
    private String text;
    
    public Button(String id, String text) {
        this.id = id;
        this.text = text;
    }
    
    @Override
    public void add(UIComponent component) {
        System.out.println("按钮不能添加子组件");
    }
    
    @Override
    public void remove(UIComponent component) {
        System.out.println("按钮没有子组件");
    }
    
    @Override
    public void render() {
        System.out.println("渲染按钮: " + id + " (" + text + ")");
    }
    
    @Override
    public void setLayout(String layout) {
        System.out.println("按钮 " + id + " 应用布局: " + layout);
    }
    
    @Override
    public String getId() {
        return id;
    }
}

// 叶子组件 - 文本框
class TextBox implements UIComponent {
    private String id;
    private String placeholder;
    
    public TextBox(String id, String placeholder) {
        this.id = id;
        this.placeholder = placeholder;
    }
    
    @Override
    public void add(UIComponent component) {
        System.out.println("文本框不能添加子组件");
    }
    
    @Override
    public void remove(UIComponent component) {
        System.out.println("文本框没有子组件");
    }
    
    @Override
    public void render() {
        System.out.println("渲染文本框: " + id + " (占位符: " + placeholder + ")");
    }
    
    @Override
    public void setLayout(String layout) {
        System.out.println("文本框 " + id + " 应用布局: " + layout);
    }
    
    @Override
    public String getId() {
        return id;
    }
}

// 复合组件 - 面板
class Panel implements UIComponent {
    private String id;
    private String layout;
    private List<UIComponent> components;
    
    public Panel(String id) {
        this.id = id;
        this.components = new ArrayList<>();
    }
    
    @Override
    public void add(UIComponent component) {
        components.add(component);
    }
    
    @Override
    public void remove(UIComponent component) {
        components.remove(component);
    }
    
    @Override
    public void render() {
        System.out.println("渲染面板: " + id);
        for (UIComponent component : components) {
            component.render();
        }
    }
    
    @Override
    public void setLayout(String layout) {
        this.layout = layout;
        for (UIComponent component : components) {
            component.setLayout(layout);
        }
    }
    
    @Override
    public String getId() {
        return id;
    }
}

// 复合组件 - 窗口
class Window implements UIComponent {
    private String id;
    private String title;
    private List<UIComponent> components;
    
    public Window(String id, String title) {
        this.id = id;
        this.title = title;
        this.components = new ArrayList<>();
    }
    
    @Override
    public void add(UIComponent component) {
        components.add(component);
    }
    
    @Override
    public void remove(UIComponent component) {
        components.remove(component);
    }
    
    @Override
    public void render() {
        System.out.println("=== 窗口: " + title + " ===");
        for (UIComponent component : components) {
            component.render();
        }
        System.out.println("==========================");
    }
    
    @Override
    public void setLayout(String layout) {
        for (UIComponent component : components) {
            component.setLayout(layout);
        }
    }
    
    @Override
    public String getId() {
        return id;
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 文件系统示例
        System.out.println("=== 文件系统示例 ===");
        
        // 创建文件
        File file1 = new File("简历.pdf", 1.2);
        File file2 = new File("项目计划.docx", 0.8);
        File file3 = new File("设计图.png", 2.5);
        
        // 创建文件夹
        Folder documents = new Folder("文档");
        documents.add(file1);
        documents.add(file2);
        
        Folder pictures = new Folder("图片");
        pictures.add(file3);
        
        Folder home = new Folder("Home");
        home.add(documents);
        home.add(pictures);
        
        // 显示文件系统结构
        home.display(0);
        System.out.println("总大小: " + home.getSize() + "MB");
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // 组织架构示例
        System.out.println("=== 组织架构示例 ===");
        
        // 创建员工
        Employee dev1 = new Developer("张三", 15000);
        Employee dev2 = new Developer("李四", 16000);
        Employee designer1 = new Designer("王五", 14000);
        
        // 创建管理者
        Manager teamLead = new Manager("赵六", "Team Lead", 25000);
        teamLead.add(dev1);
        teamLead.add(dev2);
        teamLead.add(designer1);
        
        Manager manager = new Manager("钱七", "Manager", 35000);
        manager.add(teamLead);
        
        Manager director = new Manager("孙八", "Director", 50000);
        director.add(manager);
        
        // 显示组织架构
        director.showEmployeeDetails(0);
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // 菜单系统示例
        System.out.println("=== 菜单系统示例 ===");
        
        // 创建菜单项
        MenuItemImpl pancake = new MenuItemImpl("煎饼", "经典煎饼配蜂蜜", true, 12.99);
        MenuItemImpl burger = new MenuItemImpl("汉堡", "牛肉汉堡配薯条", false, 15.99);
        MenuItemImpl salad = new MenuItemImpl("沙拉", "新鲜蔬菜沙拉", true, 8.99);
        
        // 创建子菜单
        Menu breakfastMenu = new Menu("早餐菜单", "每日新鲜早餐");
        breakfastMenu.add(pancake);
        
        Menu lunchMenu = new Menu("午餐菜单", "丰盛午餐套餐");
        lunchMenu.add(burger);
        lunchMenu.add(salad);
        
        // 创建主菜单
        Menu mainMenu = new Menu("主菜单", "本店精选美食");
        mainMenu.add(breakfastMenu);
        mainMenu.add(lunchMenu);
        
        Waitress waitress = new Waitress(mainMenu);
        waitress.printMenu();
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // UI组件示例
        System.out.println("=== UI组件示例 ===");
        
        // 创建UI组件
        Button submitButton = new Button("btn-submit", "提交");
        TextBox nameInput = new TextBox("txt-name", "请输入姓名");
        TextBox emailInput = new TextBox("txt-email", "请输入邮箱");
        
        // 创建面板
        Panel formPanel = new Panel("panel-form");
        formPanel.add(nameInput);
        formPanel.add(emailInput);
        formPanel.add(submitButton);
        
        // 创建窗口
        Window mainWindow = new Window("win-main", "用户注册");
        mainWindow.add(formPanel);
        
        // 渲染界面
        mainWindow.render();
    }
}
```

## 安全模式 vs 透明模式

### 安全模式
- 在Component接口中只定义管理子组件的方法在Composite中实现
- 客户端只能对复合组件调用管理子组件的方法
- 类型安全，但客户端代码更复杂

### 透明模式
- 在Component接口中定义所有方法
- 叶子节点对管理子组件的方法抛出异常或忽略
- 接口统一，但运行时可能出现错误

## 组合模式的优缺点

### 优点
1. 高层模块调用简单，统一处理单个对象和组合对象
2. 容易在组合体内加入新的对象，容易扩展
3. 符合开闭原则

### 缺点
1. 设计复杂，不容易限制组合中的组件
2. 使程序中类的数量增加
3. 难以用继承的方法来增加组件的特性

## 总结

组合模式就像程序界的“俄罗斯套娃”——它将对象组织成树形结构，让客户端对单个对象和组合对象的使用具有一致性。它完美地解决了“部分-整体”层次结构的处理问题。

记住：**组合模式适用于需要处理树形结构的场景，就像你需要管理文件夹和文件一样！**

在Java标准库中，AWT/Swing的组件层次结构、DOM树的处理都体现了组合模式的思想。