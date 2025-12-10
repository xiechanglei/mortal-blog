# 单例模式 (Singleton Pattern) - 程序界的“独行侠”

## 什么是单例模式？

想象一下，你家里只有一个厕所，不管有多少人要上厕所，都只能排队使用这一个厕所。这就是单例模式的核心思想——**全世界只有一个实例**，不管你在程序的哪个角落调用它，拿到的都是同一个对象。

单例模式确保一个类只有一个实例，并提供一个全局访问点。

## 为什么要用单例模式？

在现实开发中，有些对象我们不希望有多个实例：

- 数据库连接池
- 配置文件管理器
- 日志管理器
- 缓存管理器
- 线程池

想象一下如果系统里有100个数据库连接池实例，那系统不就乱套了吗？就像你家有100个厕所但只有一套下水道一样...

## 经典实现方式

### 1. 饿汉式（线程安全，但“饿”）

> 就像你饿得不行，一睁眼就开始吃饭，不管饿不饿

```java
public class EagerSingleton {
    // 在类加载时就创建实例
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    private EagerSingleton() {
        // 私有构造函数，防止外部实例化
    }
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

**特点**：简单、线程安全，但在类加载时就会创建实例，即使可能用不到。

### 2. 懒汉式（延迟加载，但线程不安全）

> 就像你懒癌晚期，能躺着绝不坐着，能坐着绝不站着

```java
public class LazySingleton {
    private static LazySingleton instance;
    
    private LazySingleton() {
        // 私有构造函数
    }
    
    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton(); // 延迟加载
        }
        return instance;
    }
}
```

**缺点**：多线程环境下可能创建多个实例。

### 3. 双重检查锁定（推荐）

> 就像你上厕所前要先听听有没有人，再推门确认一下

```java
public class DoubleCheckSingleton {
    private static volatile DoubleCheckSingleton instance;
    
    private DoubleCheckSingleton() {
        // 私有构造函数
    }
    
    public static DoubleCheckSingleton getInstance() {
        if (instance == null) { // 第一次检查
            synchronized (DoubleCheckSingleton.class) {
                if (instance == null) { // 第二次检查
                    instance = new DoubleCheckSingleton();
                }
            }
        }
        return instance;
    }
}
```

**优点**：线程安全，延迟加载，性能好。

### 4. 静态内部类（推荐）

> 就像你的私密保险箱，只有真正需要的时候才打开

```java
public class StaticInnerClassSingleton {
    private StaticInnerClassSingleton() {
        // 私有构造函数
    }
    
    private static class SingletonHolder {
        private static final StaticInnerClassSingleton INSTANCE = 
            new StaticInnerClassSingleton();
    }
    
    public static StaticInnerClassSingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

**优点**：线程安全，延迟加载，性能好，推荐使用。

## 实际应用场景

### 配置管理器示例

```java
public class ConfigManager {
    private static volatile ConfigManager instance;
    private Properties config;
    
    private ConfigManager() {
        // 加载配置文件
        config = new Properties();
        try {
            config.load(new FileInputStream("config.properties"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config", e);
        }
    }
    
    public static ConfigManager getInstance() {
        if (instance == null) {
            synchronized (ConfigManager.class) {
                if (instance == null) {
                    instance = new ConfigManager();
                }
            }
        }
        return instance;
    }
    
    public String getProperty(String key) {
        return config.getProperty(key);
    }
    
    public void setProperty(String key, String value) {
        config.setProperty(key, value);
    }
}
```

### 数据库连接池示例

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;
    private BlockingQueue<Connection> connectionPool;
    private final int POOL_SIZE = 10;
    
    private DatabaseConnectionPool() {
        connectionPool = new ArrayBlockingQueue<>(POOL_SIZE);
        initializePool();
    }
    
    private void initializePool() {
        for (int i = 0; i < POOL_SIZE; i++) {
            try {
                // 创建数据库连接并放入池中
                Connection conn = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/mydb", 
                    "user", "password");
                connectionPool.offer(conn);
            } catch (SQLException e) {
                throw new RuntimeException("Failed to initialize connection pool", e);
            }
        }
    }
    
    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
    
    public Connection getConnection() throws InterruptedException {
        return connectionPool.take(); // 获取连接
    }
    
    public void releaseConnection(Connection conn) {
        if (conn != null) {
            connectionPool.offer(conn); // 归还连接
        }
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 配置管理器
        ConfigManager config1 = ConfigManager.getInstance();
        ConfigManager config2 = ConfigManager.getInstance();
        
        System.out.println("两个配置管理器是同一个对象吗？" + (config1 == config2)); // true
        
        // 数据库连接池
        DatabaseConnectionPool pool1 = DatabaseConnectionPool.getInstance();
        DatabaseConnectionPool pool2 = DatabaseConnectionPool.getInstance();
        
        System.out.println("两个连接池是同一个对象吗？" + (pool1 == pool2)); // true
        
        // 使用连接
        try {
            Connection conn = pool1.getConnection();
            // 执行数据库操作...
            pool1.releaseConnection(conn); // 归还连接
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 单例模式的优缺点

### 优点
1. 内存中只有一个实例，节省内存
2. 避免对资源的重复占用
3. 全局访问点

### 缺点
1. 没有接口，扩展困难
2. 不符合开闭原则
3. 与单一职责原则冲突（既要管理自身创建，又要实现业务功能）
4. 单元测试困难

## 总结

单例模式就像你家的厕所——全世界只有一个，不管有多少人要排队使用。它解决了全局唯一性问题，但也带来了扩展性差的问题。在使用时要权衡利弊，选择合适的实现方式。

记住：**不是所有类都需要单例，就像不是所有人都需要共享一个厕所一样！**

在现代开发中，我们更多地使用依赖注入容器（如Spring）来管理单例，而不是手动实现单例模式。