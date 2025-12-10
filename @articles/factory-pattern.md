# 工厂模式 (Factory Pattern) - 程序界的“制造车间”

## 什么是工厂模式？

想象一下，你是麦当劳的顾客，你只需要说“来个巨无霸”，而不需要关心汉堡是怎么制作的——厨师们在后厨按照标准流程制作，最后给你完美的汉堡。工厂模式就是这样一个“后厨”——它负责创建对象，而你只需要告诉它你想要什么类型的产品。

**工厂模式**定义了一个创建对象的接口，但让子类决定实例化哪个类。工厂方法让类的实例化推迟到子类。

## 为什么需要工厂模式？

在没有工厂模式的代码中，我们经常看到这样的场景：

```java
// 不使用工厂模式的代码
if (type.equals("car")) {
    product = new Car();
} else if (type.equals("bike")) {
    product = new Bike();
} else if (type.equals("truck")) {
    product = new Truck();
}
```

如果新增产品类型，就需要修改这段代码。工厂模式帮我们解决了这个问题——就像麦当劳不会因为推出新品汉堡而改变整个点餐系统。

## 工厂模式的实现

### 产品接口和实现类

```java
// 交通工具接口
public interface Vehicle {
    void start();
    void stop();
}

// 具体产品类
class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("汽车启动了，嗡嗡嗡...");
    }
    
    @Override
    public void stop() {
        System.out.println("汽车停下来了，滴滴滴...");
    }
}

class Bike implements Vehicle {
    @Override
    public void start() {
        System.out.println("自行车启动了，蹬蹬蹬...");
    }
    
    @Override
    public void stop() {
        System.out.println("自行车停下来了，吱吱吱...");
    }
}

class Truck implements Vehicle {
    @Override
    public void start() {
        System.out.println("卡车启动了，轰隆隆...");
    }
    
    @Override
    public void stop() {
        System.out.println("卡车停下来了，哐当当...");
    }
}
```

### 工厂接口和实现

```java
// 工厂接口
public interface VehicleFactory {
    Vehicle createVehicle();
}

// 具体工厂类
class CarFactory implements VehicleFactory {
    @Override
    public Vehicle createVehicle() {
        System.out.println("正在生产汽车...");
        return new Car();
    }
}

class BikeFactory implements VehicleFactory {
    @Override
    public Vehicle createVehicle() {
        System.out.println("正在生产自行车...");
        return new Bike();
    }
}

class TruckFactory implements VehicleFactory {
    @Override
    public Vehicle createVehicle() {
        System.out.println("正在生产卡车...");
        return new Truck();
    }
}
```

## 简单工厂模式

有时候我们会看到简单工厂模式，虽然不是GoF中正式的模式，但很实用：

```java
public class SimpleVehicleFactory {
    public static Vehicle createVehicle(String type) {
        switch (type.toLowerCase()) {
            case "car":
                return new Car();
            case "bike":
                return new Bike();
            case "truck":
                return new Truck();
            default:
                throw new IllegalArgumentException("未知的车辆类型: " + type);
        }
    }
}
```

## 实际应用场景

### 餐厅订单系统示例

```java
// 食物接口
interface Food {
    void prepare();
    void serve();
}

// 具体食物类
class Burger implements Food {
    @Override
    public void prepare() {
        System.out.println("准备汉堡：煎肉饼、加生菜、涂酱料");
    }
    
    @Override
    public void serve() {
        System.out.println("汉堡已上菜，请慢用！");
    }
}

class Pizza implements Food {
    @Override
    public void prepare() {
        System.out.println("准备披萨：和面、加料、烘烤");
    }
    
    @Override
    public void serve() {
        System.out.println("披萨已上菜，请慢用！");
    }
}

class Salad implements Food {
    @Override
    public void prepare() {
        System.out.println("准备沙拉：洗菜、切菜、加调料");
    }
    
    @Override
    public void serve() {
        System.out.println("沙拉已上菜，请慢用！");
    }
}

// 食物工厂接口
interface FoodFactory {
    Food createFood();
}

// 具体工厂
class BurgerFactory implements FoodFactory {
    @Override
    public Food createFood() {
        System.out.println("厨房开始制作汉堡...");
        return new Burger();
    }
}

class PizzaFactory implements FoodFactory {
    @Override
    public Food createFood() {
        System.out.println("厨房开始制作披萨...");
        return new Pizza();
    }
}

class SaladFactory implements FoodFactory {
    @Override
    public Food createFood() {
        System.out.println("厨房开始制作沙拉...");
        return new Salad();
    }
}

// 餐厅订单处理类
public class RestaurantOrderProcessor {
    private FoodFactory factory;
    
    public RestaurantOrderProcessor(FoodFactory factory) {
        this.factory = factory;
    }
    
    public void processOrder() {
        Food food = factory.createFood();
        food.prepare();
        food.serve();
    }
    
    public static void main(String[] args) {
        // 订购汉堡
        FoodFactory burgerFactory = new BurgerFactory();
        RestaurantOrderProcessor burgerOrder = new RestaurantOrderProcessor(burgerFactory);
        burgerOrder.processOrder();
        
        System.out.println("---");
        
        // 订购披萨
        FoodFactory pizzaFactory = new PizzaFactory();
        RestaurantOrderProcessor pizzaOrder = new RestaurantOrderProcessor(pizzaFactory);
        pizzaOrder.processOrder();
    }
}
```

### 数据库连接工厂示例

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// 数据库连接接口
interface DatabaseConnector {
    Connection getConnection() throws SQLException;
}

// 具体实现
class MySQLConnector implements DatabaseConnector {
    @Override
    public Connection getConnection() throws SQLException {
        System.out.println("创建MySQL连接...");
        return DriverManager.getConnection("jdbc:mysql://localhost:3306/mydb", "user", "pass");
    }
}

class PostgreSQLConnector implements DatabaseConnector {
    @Override
    public Connection getConnection() throws SQLException {
        System.out.println("创建PostgreSQL连接...");
        return DriverManager.getConnection("jdbc:postgresql://localhost:5432/mydb", "user", "pass");
    }
}

class OracleConnector implements DatabaseConnector {
    @Override
    public Connection getConnection() throws SQLException {
        System.out.println("创建Oracle连接...");
        return DriverManager.getConnection("jdbc:oracle:thin:@localhost:1521:xe", "user", "pass");
    }
}

// 数据库连接工厂
interface DatabaseFactory {
    DatabaseConnector createConnector();
}

class MySQLFactory implements DatabaseFactory {
    @Override
    public DatabaseConnector createConnector() {
        return new MySQLConnector();
    }
}

class PostgreSQLFactory implements DatabaseFactory {
    @Override
    public DatabaseConnector createConnector() {
        return new PostgreSQLConnector();
    }
}

class OracleFactory implements DatabaseFactory {
    @Override
    public DatabaseConnector createConnector() {
        return new OracleConnector();
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 使用工厂创建汽车
        VehicleFactory carFactory = new CarFactory();
        Vehicle car = carFactory.createVehicle();
        car.start();
        car.stop();
        
        System.out.println("---");
        
        // 使用工厂创建自行车
        VehicleFactory bikeFactory = new BikeFactory();
        Vehicle bike = bikeFactory.createVehicle();
        bike.start();
        bike.stop();
        
        System.out.println("---");
        
        // 使用简单工厂
        Vehicle truck = SimpleVehicleFactory.createVehicle("truck");
        truck.start();
        truck.stop();
    }
}
```

## 工厂模式的优缺点

### 优点
1. 遵循开闭原则，新增产品类型无需修改现有代码
2. 封装了对象创建逻辑
3. 便于管理同一类型的产品族
4. 客户端与具体产品类解耦

### 缺点
1. 每增加一个产品，就需要增加一个具体工厂类
2. 类的数量增加，系统复杂度提高
3. 工厂类职责过重，违反单一职责原则

## 总结

工厂模式就像一个专门的制造车间——你告诉它要什么产品，它就给你生产什么产品，而不需要你了解生产过程。它把对象的创建过程封装起来，让代码更加清晰、可维护。

记住：**工厂模式适合于产品种类相对稳定、创建过程复杂的场景。就像麦当劳的厨房，标准流程制造标准产品。**

在实际开发中，工厂模式经常与Spring等依赖注入框架结合使用，更优雅地管理对象的创建。