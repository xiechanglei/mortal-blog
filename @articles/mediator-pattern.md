# 中介者模式 (Mediator Pattern) - 程序界的“调度中心”

## 什么是中介者模式？

想象一下机场的塔台控制中心，所有的飞机起飞、降落、滑行都需要通过塔台的统一调度。如果没有塔台，飞机之间需要互相通信来协调飞行，这将导致极其复杂的通信网络。中介者模式就是这样——它用一个中介对象来封装一系列对象之间的交互。

**中介者模式**用一个中介对象来封装一系列对象之间的交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

## 为什么需要中介者模式？

在以下场景中，中介者模式特别有用：

1. 当一组对象以定义良好但是复杂的方式进行通信
2. 当想定制一个分布在多个类中的行为，而又不想生成太多子类时
3. 当类之间存在网状结构的依赖关系时

传统方式的问题：对象间直接通信形成网状结构，导致系统难以维护和扩展。

## 中介者模式的实现

### 聊天室系统示例

```java
import java.util.*;

// 中介者接口
interface ChatMediator {
    void sendMessage(String message, User user);
    void addUser(User user);
    void removeUser(User user);
}

// 具体中介者
class ChatRoom implements ChatMediator {
    private List<User> users;
    
    public ChatRoom() {
        this.users = new ArrayList<>();
    }
    
    @Override
    public void addUser(User user) {
        this.users.add(user);
    }
    
    @Override
    public void removeUser(User user) {
        this.users.remove(user);
    }
    
    @Override
    public void sendMessage(String message, User sender) {
        for (User user : users) {
            if (user != sender) { // 不发送给自己
                user.receive(message, sender);
            }
        }
    }
    
    public List<User> getUsers() {
        return new ArrayList<>(users);
    }
}

// 同事接口
abstract class User {
    protected String name;
    protected ChatMediator mediator;
    
    public User(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }
    
    public abstract void send(String message);
    public abstract void receive(String message, User sender);
    
    public String getName() {
        return name;
    }
}

// 具体同事类
class ChatUser extends User {
    public ChatUser(String name, ChatMediator mediator) {
        super(name, mediator);
    }
    
    @Override
    public void send(String message) {
        System.out.println(this.name + " 发送消息: " + message);
        mediator.sendMessage(message, this);
    }
    
    @Override
    public void receive(String message, User sender) {
        System.out.println(this.name + " 收到 " + sender.getName() + 
                          " 的消息: " + message);
    }
}
```

### GUI组件系统示例

```java
// GUI中介者接口
interface GUIMediator {
    void registerComponent(Component component);
    void componentChanged(Component component);
    void notify(String event, Component sender);
}

// GUI组件抽象类
abstract class Component {
    protected GUIMediator mediator;
    protected String name;
    
    public Component(GUIMediator mediator, String name) {
        this.mediator = mediator;
        this.name = name;
        if (mediator != null) {
            mediator.registerComponent(this);
        }
    }
    
    public String getName() {
        return name;
    }
    
    public void click() {
        mediator.componentChanged(this);
    }
    
    public void change() {
        mediator.componentChanged(this);
    }
}

// 具体组件
class Button extends Component {
    public Button(GUIMediator mediator, String name) {
        super(mediator, name);
    }
    
    public void click() {
        System.out.println("按钮 " + name + " 被点击");
        mediator.notify("click", this);
    }
}

class TextBox extends Component {
    private String text;
    
    public TextBox(GUIMediator mediator, String name) {
        super(mediator, name);
        this.text = "";
    }
    
    public void setText(String text) {
        this.text = text;
        System.out.println("文本框 " + name + " 被设置为: " + text);
        mediator.notify("change", this);
    }
    
    public String getText() {
        return text;
    }
}

class ListBox extends Component {
    private List<String> items;
    private String selection;
    
    public ListBox(GUIMediator mediator, String name) {
        super(mediator, name);
        this.items = new ArrayList<>();
        this.selection = null;
    }
    
    public void add(String item) {
        items.add(item);
    }
    
    public void select(String item) {
        if (items.contains(item)) {
            this.selection = item;
            System.out.println("列表框 " + name + " 选择: " + item);
            mediator.notify("select", this);
        }
    }
    
    public List<String> getItems() {
        return new ArrayList<>(items);
    }
    
    public String getSelection() {
        return selection;
    }
}

// 具体内存者
class AuthenticationDialog implements GUIMediator {
    private Button loginButton;
    private Button cancelButton;
    private TextBox username;
    private TextBox password;
    private ListBox userList;
    
    public AuthenticationDialog() {
        // 创建组件并关联中介者
        loginButton = new Button(this, "登录");
        cancelButton = new Button(this, "取消");
        username = new TextBox(this, "用户名");
        password = new TextBox(this, "密码");
        userList = new ListBox(this, "用户列表");
        
        // 初始化用户列表
        userList.add("admin");
        userList.add("user1");
        userList.add("user2");
    }
    
    @Override
    public void registerComponent(Component component) {
        if (component instanceof Button) {
            if (component.getName().equals("登录")) {
                this.loginButton = (Button) component;
            } else if (component.getName().equals("取消")) {
                this.cancelButton = (Button) component;
            }
        } else if (component instanceof TextBox) {
            if (component.getName().equals("用户名")) {
                this.username = (TextBox) component;
            } else if (component.getName().equals("密码")) {
                this.password = (TextBox) component;
            }
        } else if (component instanceof ListBox) {
            this.userList = (ListBox) component;
        }
    }
    
    @Override
    public void componentChanged(Component component) {
        // 根据组件变化执行相应逻辑
        if (component == userList) {
            // 用户在列表中选择了一个用户，自动填充用户名
            username.setText(userList.getSelection());
            password.setText("");
        } else if (component == loginButton) {
            // 登录按钮被点击
            if (doAuthenticate(username.getText(), password.getText())) {
                System.out.println("登录成功！");
            } else {
                System.out.println("登录失败！");
            }
        } else if (component == cancelButton) {
            System.out.println("取消登录");
            username.setText("");
            password.setText("");
        } else if (component == username || component == password) {
            // 用户名或密码改变，更新登录按钮状态
            boolean allFilled = !username.getText().isEmpty() && 
                               !password.getText().isEmpty();
            System.out.println("登录按钮状态: " + (allFilled ? "可用" : "禁用"));
        }
    }
    
    @Override
    public void notify(String event, Component sender) {
        System.out.println("收到组件 " + sender.getName() + " 的 " + event + " 事件");
        componentChanged(sender);
    }
    
    private boolean doAuthenticate(String username, String password) {
        // 简化的认证逻辑
        return "admin".equals(username) && "123456".equals(password);
    }
}
```

## 实际应用场景

### 航空塔台控制系统示例

```java
import java.util.*;

// 飞机类
class Aircraft {
    private String flightNumber;
    private String status; // "takeoff", "landing", "cruise"
    private int altitude;
    private double fuelLevel;
    private TowerControl tower;
    
    public Aircraft(String flightNumber, TowerControl tower) {
        this.flightNumber = flightNumber;
        this.status = "ground"; // 初始状态
        this.altitude = 0;
        this.fuelLevel = 100.0; // 100% 油量
        this.tower = tower;
    }
    
    public void requestTakeoff() {
        System.out.println(flightNumber + " 请求起飞");
        tower.processTakeoffRequest(this);
    }
    
    public void requestLanding() {
        System.out.println(flightNumber + " 请求降落");
        tower.processLandingRequest(this);
    }
    
    public void updateStatus(String newStatus) {
        this.status = newStatus;
        System.out.println(flightNumber + " 状态更新为: " + status);
    }
    
    public void adjustAltitude(int newAltitude) {
        if (newAltitude >= 0 && newAltitude <= 40000) {
            this.altitude = newAltitude;
            System.out.println(flightNumber + " 高度调整为: " + altitude + "英尺");
        }
    }
    
    public void consumeFuel(double amount) {
        this.fuelLevel -= amount;
        if (fuelLevel < 0) fuelLevel = 0;
        System.out.println(flightNumber + " 燃油剩余: " + String.format("%.2f%%", fuelLevel));
    }
    
    // Getter方法
    public String getFlightNumber() { return flightNumber; }
    public String getStatus() { return status; }
    public int getAltitude() { return altitude; }
    public double getFuelLevel() { return fuelLevel; }
}

// 塔台控制类
class TowerControl {
    private List<Aircraft> aircrafts;
    private Set<String> busyRunways; // 忙碌的跑道
    private int runwayCount;
    
    public TowerControl(int runwayCount) {
        this.aircrafts = new ArrayList<>();
        this.busyRunways = new HashSet<>();
        this.runwayCount = runwayCount;
        System.out.println("塔台就绪，跑道数量: " + runwayCount);
    }
    
    public void addAircraft(Aircraft aircraft) {
        aircrafts.add(aircraft);
        System.out.println("航班 " + aircraft.getFlightNumber() + " 加入控制范围");
    }
    
    public void processTakeoffRequest(Aircraft aircraft) {
        if (aircraft.getStatus().equals("ground")) {
            if (busyRunways.size() < runwayCount) {
                // 分配跑道
                String runway = assignRunway();
                busyRunways.add(runway);
                
                System.out.println("塔台批准 " + aircraft.getFlightNumber() + 
                                 " 起飞，使用跑道: " + runway);
                aircraft.updateStatus("takingoff");
                aircraft.adjustAltitude(1000);
                aircraft.consumeFuel(2.0);
                
                // 起飞完成后释放跑道
                releaseRunway(runway);
                aircraft.updateStatus("cruise");
            } else {
                System.out.println("塔台: " + aircraft.getFlightNumber() + 
                                 "，所有跑道繁忙，请等待");
            }
        } else {
            System.out.println("塔台: " + aircraft.getFlightNumber() + 
                             "，您不在地面，无法起飞");
        }
    }
    
    public void processLandingRequest(Aircraft aircraft) {
        if (aircraft.getStatus().equals("cruise")) {
            if (busyRunways.size() < runwayCount) {
                // 分配跑道用于降落
                String runway = assignRunway();
                busyRunways.add(runway);
                
                System.out.println("塔台批准 " + aircraft.getFlightNumber() + 
                                 " 降落，使用跑道: " + runway);
                aircraft.updateStatus("landing");
                aircraft.adjustAltitude(0);
                
                // 降落完成后释放跑道
                releaseRunway(runway);
                aircraft.updateStatus("ground");
                aircraft.consumeFuel(1.0);
            } else {
                System.out.println("塔台: " + aircraft.getFlightNumber() + 
                                 "，所有跑道繁忙，请盘旋等待");
            }
        } else {
            System.out.println("塔台: " + aircraft.getFlightNumber() + 
                             "，您不在巡航状态，无法降落");
        }
    }
    
    public void handleEmergency(Aircraft aircraft) {
        System.out.println("塔台: " + aircraft.getFlightNumber() + " 发出紧急请求！");
        // 紧急情况下，优先安排降落
        String emergencyRunway = assignRunway();
        busyRunways.add(emergencyRunway);
        
        System.out.println("塔台为 " + aircraft.getFlightNumber() + 
                         " 清空跑道 " + emergencyRunway + " 用于紧急降落");
        aircraft.updateStatus("emergency_landing");
        aircraft.adjustAltitude(0);
        releaseRunway(emergencyRunway);
        aircraft.updateStatus("ground");
    }
    
    private String assignRunway() {
        // 简化的跑道分配逻辑
        for (int i = 1; i <= runwayCount; i++) {
            String runway = "RW" + i;
            if (!busyRunways.contains(runway)) {
                return runway;
            }
        }
        return "RW1"; // 默认返回第一个跑道
    }
    
    private void releaseRunway(String runway) {
        busyRunways.remove(runway);
        System.out.println("跑道 " + runway + " 已释放");
    }
    
    public void displayStatus() {
        System.out.println("\n=== 塔台状态 ===");
        System.out.println("可用跑道: " + (runwayCount - busyRunways.size()) + "/" + runwayCount);
        System.out.println("运行中航班数量: " + aircrafts.size());
        for (Aircraft aircraft : aircrafts) {
            System.out.println("- " + aircraft.getFlightNumber() + 
                             " | 状态: " + aircraft.getStatus() + 
                             " | 高度: " + aircraft.getAltitude() + 
                             " | 燃油: " + String.format("%.2f%%", aircraft.getFuelLevel()));
        }
        System.out.println();
    }
}
```

### 电商系统中介者示例

```java
// 电商中介者接口
interface ECommerceMediator {
    void registerUser(User user);
    void registerProduct(Product product);
    void registerOrder(Order order);
    void notify(String event, Object source);
}

// 电商中介者实现
class ECommerceSystem implements ECommerceMediator {
    private List<User> users;
    private List<Product> products;
    private List<Order> orders;
    private NotificationService notificationService;
    
    public ECommerceSystem() {
        this.users = new ArrayList<>();
        this.products = new ArrayList<>();
        this.orders = new ArrayList<>();
        this.notificationService = new NotificationService();
    }
    
    @Override
    public void registerUser(User user) {
        users.add(user);
    }
    
    @Override
    public void registerProduct(Product product) {
        products.add(product);
    }
    
    @Override
    public void registerOrder(Order order) {
        orders.add(order);
    }
    
    @Override
    public void notify(String event, Object source) {
        if ("orderCreated".equals(event) && source instanceof Order) {
            Order order = (Order) source;
            // 发送订单确认通知
            notificationService.sendOrderConfirmation(order);
            // 更新库存
            updateInventory(order);
        } else if ("paymentProcessed".equals(event) && source instanceof Order) {
            Order order = (Order) source;
            // 发送支付确认通知
            notificationService.sendPaymentConfirmation(order);
        } else if ("inventoryChanged".equals(event) && source instanceof Product) {
            Product product = (Product) source;
            // 检查是否有用户在等待该商品到货
            notifyWaitlist(product);
        }
    }
    
    private void updateInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            for (Product product : products) {
                if (product.getId().equals(item.getProductId())) {
                    product.reduceStock(item.getQuantity());
                }
            }
        }
    }
    
    private void notifyWaitlist(Product product) {
        if (product.getStock() > 0) {
            System.out.println("商品 " + product.getName() + " 重新有货，通知等待用户");
            // 实际应用中，这里会发送通知给订阅该商品的用户
        }
    }
}

// 通知服务
class NotificationService {
    public void sendOrderConfirmation(Order order) {
        System.out.println("发送订单确认通知 - 订单号: " + order.getOrderId() + 
                          ", 用户: " + order.getUserId());
    }
    
    public void sendPaymentConfirmation(Order order) {
        System.out.println("发送支付确认通知 - 订单号: " + order.getOrderId() + 
                          ", 金额: ¥" + order.getTotalAmount());
    }
    
    public void sendInventoryAlert(Product product) {
        System.out.println("发送库存不足警报 - 商品: " + product.getName() + 
                          ", 当前库存: " + product.getStock());
    }
}

// 简化的电商实体类
class Product {
    private String id;
    private String name;
    private double price;
    private int stock;
    private ECommerceMediator mediator;
    
    public Product(String id, String name, double price, int stock, ECommerceMediator mediator) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.mediator = mediator;
        if (mediator != null) {
            mediator.registerProduct(this);
        }
    }
    
    public void reduceStock(int quantity) {
        if (stock >= quantity) {
            stock -= quantity;
            System.out.println("商品 " + name + " 库存减少 " + quantity + 
                             "，当前库存: " + stock);
            if (stock == 0) {
                System.out.println("警告: 商品 " + name + " 库存不足！");
            }
            if (mediator != null) {
                mediator.notify("inventoryChanged", this);
            }
        }
    }
    
    // Getter方法
    public String getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public int getStock() { return stock; }
}

class OrderItem {
    private String productId;
    private int quantity;
    private double price;
    
    public OrderItem(String productId, int quantity, double price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
    
    public String getProductId() { return productId; }
    public int getQuantity() { return quantity; }
    public double getPrice() { return price; }
}

class Order {
    private String orderId;
    private String userId;
    private List<OrderItem> items;
    private double totalAmount;
    private String status;
    private ECommerceMediator mediator;
    
    public Order(String orderId, String userId, ECommerceMediator mediator) {
        this.orderId = orderId;
        this.userId = userId;
        this.items = new ArrayList<>();
        this.status = "CREATED";
        this.mediator = mediator;
        if (mediator != null) {
            mediator.registerOrder(this);
        }
    }
    
    public void addItem(OrderItem item) {
        items.add(item);
        totalAmount += item.getPrice() * item.getQuantity();
    }
    
    public void processPayment() {
        System.out.println("处理订单支付 - 订单号: " + orderId + 
                          ", 金额: ¥" + totalAmount);
        this.status = "PAID";
        if (mediator != null) {
            mediator.notify("paymentProcessed", this);
        }
    }
    
    // Getter方法
    public String getOrderId() { return orderId; }
    public String getUserId() { return userId; }
    public List<OrderItem> getItems() { return new ArrayList<>(items); }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 聊天室系统示例 ===");
        
        ChatMediator chatRoom = new ChatRoom();
        
        User alice = new ChatUser("Alice", chatRoom);
        User bob = new ChatUser("Bob", chatRoom);
        User charlie = new ChatUser("Charlie", chatRoom);
        
        chatRoom.addUser(alice);
        chatRoom.addUser(bob);
        chatRoom.addUser(charlie);
        
        alice.send("大家好！");
        System.out.println();
        bob.send("你好，Alice！");
        System.out.println();
        charlie.send("会议时间改到下午3点");
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== GUI系统示例 ===");
        
        GUIMediator dialog = new AuthenticationDialog();
        
        // 模拟用户操作
        ListBox userList = new ListBox(dialog, "用户列表");
        userList.select("admin");
        System.out.println();
        
        TextBox password = new TextBox(dialog, "密码");
        password.setText("123456");
        System.out.println();
        
        Button loginButton = new Button(dialog, "登录");
        loginButton.click();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 航空塔台系统示例 ===");
        
        TowerControl tower = new TowerControl(2); // 2条跑道
        
        Aircraft flight1 = new Aircraft("CA1234", tower);
        Aircraft flight2 = new Aircraft("MU5678", tower);
        Aircraft flight3 = new Aircraft("CZ9012", tower);
        
        tower.addAircraft(flight1);
        tower.addAircraft(flight2);
        tower.addAircraft(flight3);
        
        tower.displayStatus();
        
        flight1.requestTakeoff();
        System.out.println();
        flight2.requestTakeoff();
        System.out.println();
        flight3.requestTakeoff(); // 这个会等待，因为跑道满了
        
        System.out.println();
        tower.displayStatus();
        
        flight1.requestLanding();
        System.out.println();
        tower.displayStatus();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 电商系统示例 ===");
        
        ECommerceMediator ecomSystem = new ECommerceSystem();
        
        // 创建商品
        Product laptop = new Product("P001", "笔记本电脑", 5999.99, 10, ecomSystem);
        Product mouse = new Product("P002", "无线鼠标", 99.99, 50, ecomSystem);
        
        // 创建订单
        Order order = new Order("ORD001", "USER001", ecomSystem);
        order.addItem(new OrderItem("P001", 1, 5999.99));
        order.addItem(new OrderItem("P002", 2, 99.99));
        
        // 处理订单
        ecomSystem.notify("orderCreated", order);
        order.processPayment();
    }
}
```

## 中介者模式的优缺点

### 优点
1. 降低了多个对象和类之间的耦合性
2. 提供了对对象间交互的集中控制
3. 简化了对象间的通信，使对象不再需要显式地引用其他对象
4. 使各对象可以独立地改变和复用

### 缺点
1. 中介者类可能会变得很复杂，维护困难
2. 中介者类可能成为系统性能的瓶颈
3. 中介者类需要知道所有同事类的细节，违反了最少知识原则

## 中介者模式 vs 观察者模式

### 中介者模式
- 关注对象间的协作关系
- 中介者封装对象间的交互
- 降低多个对象间的耦合

### 观察者模式
- 关注一个对象的状态变化
- 一个对象状态变化时通知依赖它的对象
- 实现对象间的一对多依赖关系

## 总结

中介者模式就像程序界的"调度中心"——它将多个对象之间的复杂交互关系封装到一个中介对象中，使得对象间不需要直接通信。就像机场塔台控制飞机起降一样，中介者模式让系统的控制逻辑更加清晰。

记住：**中介者模式适用于对象间存在复杂交互关系的场景，但要注意中介者本身不要变得过于复杂！**

在实际开发中，中介者模式被广泛应用于：
- GUI界面组件间的交互
- 系统架构中的协调器
- 消息队列系统
- 工作流引擎
- MVC架构中的Controller等