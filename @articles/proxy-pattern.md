# 代理模式 (Proxy Pattern) - 程序界的“代购小哥”

## 什么是代理模式？

想象一下，你想购买国外的限量商品，但你无法直接购买，于是你找了一个代购小哥。代购小哥代替你与国外商家沟通、下单、付款，最终把商品交给你。在你看来，你就是在和代购小哥打交道，但实际上他在背后处理了所有复杂的海外购买流程。

代理模式就是这样——它为其他对象提供一个替身或占位符以控制对这个对象的访问。

**代理模式**为其他对象提供一种代理以控制对这个对象的访问。

## 为什么需要代理模式？

代理模式在以下场景中特别有用：

1. **远程代理**：为远程对象提供本地代表
2. **虚拟代理**：根据需要创建开销很大的对象
3. **保护代理**：控制对原始对象的访问权限
4. **智能引用**：在访问对象时执行额外操作

## 代理模式的实现

### 基础代理结构

```java
// 主题接口 - 定义真实主题和代理的共同接口
interface Image {
    void display();
}

// 真实主题 - 真正执行操作的对象
class RealImage implements Image {
    private String filename;
    
    public RealImage(String filename) {
        this.filename = filename;
        loadImageFromDisk();
    }
    
    private void loadImageFromDisk() {
        System.out.println("从磁盘加载图片: " + filename);
        // 模拟加载时间
        try {
            Thread.sleep(1000); // 模拟加载耗时
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void display() {
        System.out.println("显示图片: " + filename);
    }
}

// 代理类 - 控制对真实主题的访问
class ProxyImage implements Image {
    private RealImage realImage;
    private String filename;
    
    public ProxyImage(String filename) {
        this.filename = filename;
    }
    
    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename);
        }
        realImage.display();
    }
}
```

### 虚拟代理示例

```java
import java.util.*;

// 文档接口
interface Document {
    void openDocument();
    void editDocument();
}

// 真实文档类
class RealDocument implements Document {
    private String filename;
    private String content;
    
    public RealDocument(String filename) {
        this.filename = filename;
        System.out.println("装载大文档: " + filename);
        // 模拟加载大文档的耗时操作
        loadDocument();
    }
    
    private void loadDocument() {
        System.out.println("正在加载文档内容...");
        // 模拟加载时间
        try {
            Thread.sleep(2000); // 2秒加载时间
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        this.content = "这是文档的大量内容...";
    }
    
    @Override
    public void openDocument() {
        System.out.println("打开文档: " + filename);
        System.out.println("内容预览: " + content.substring(0, Math.min(20, content.length())));
    }
    
    @Override
    public void editDocument() {
        System.out.println("编辑文档: " + filename);
        System.out.println("当前内容: " + content);
    }
}

// 虚拟代理
class VirtualDocument implements Document {
    private RealDocument realDocument;
    private String filename;
    private boolean loaded = false;
    
    public VirtualDocument(String filename) {
        this.filename = filename;
        System.out.println("创建虚拟文档代理: " + filename + " (尚未加载)");
    }
    
    @Override
    public void openDocument() {
        if (!loaded) {
            System.out.println("首次访问，现在加载真实文档...");
            realDocument = new RealDocument(filename);
            loaded = true;
        }
        realDocument.openDocument();
    }
    
    @Override
    public void editDocument() {
        if (!loaded) {
            System.out.println("首次访问，现在加载真实文档...");
            realDocument = new RealDocument(filename);
            loaded = true;
        }
        realDocument.editDocument();
    }
}
```

### 保护代理示例

```java
// 账户接口
interface BankAccount {
    void deposit(double amount);
    void withdraw(double amount);
    double getBalance();
}

// 真实账户实现
class RealBankAccount implements BankAccount {
    private double balance;
    private String accountNumber;
    
    public RealBankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        System.out.println("创建真实银行账户: " + accountNumber);
    }
    
    @Override
    public void deposit(double amount) {
        balance += amount;
        System.out.println("存入: ¥" + amount + ", 余额: ¥" + balance);
    }
    
    @Override
    public void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
            System.out.println("取出: ¥" + amount + ", 余额: ¥" + balance);
        } else {
            System.out.println("余额不足，取款失败");
        }
    }
    
    @Override
    public double getBalance() {
        return balance;
    }
}

// 保护代理
class ProtectedBankAccount implements BankAccount {
    private RealBankAccount realAccount;
    private String role; // 用户角色
    
    public ProtectedBankAccount(String accountNumber, double initialBalance, String role) {
        this.realAccount = new RealBankAccount(accountNumber, initialBalance);
        this.role = role;
    }
    
    @Override
    public void deposit(double amount) {
        if (hasPermission("deposit")) {
            realAccount.deposit(amount);
        } else {
            System.out.println("权限不足，无法存款");
        }
    }
    
    @Override
    public void withdraw(double amount) {
        if (hasPermission("withdraw")) {
            if (amount > 10000 && !role.equals("admin")) {
                System.out.println("大额取款需要管理员权限");
                return;
            }
            realAccount.withdraw(amount);
        } else {
            System.out.println("权限不足，无法取款");
        }
    }
    
    @Override
    public double getBalance() {
        if (hasPermission("balance")) {
            return realAccount.getBalance();
        } else {
            System.out.println("权限不足，无法查询余额");
            return -1;
        }
    }
    
    private boolean hasPermission(String operation) {
        switch (operation) {
            case "deposit":
                return role.equals("user") || role.equals("admin");
            case "withdraw":
                return role.equals("user") || role.equals("admin");
            case "balance":
                return true; // 所有用户都可以查询余额
            default:
                return false;
        }
    }
}
```

## 实际应用场景

### 远程代理示例（概念展示）

```java
// 模拟远程服务接口
interface RemoteService {
    String processRequest(String request);
    int getServerStatus();
}

// 模拟远程服务实现
class RemoteServiceImpl implements RemoteService {
    @Override
    public String processRequest(String request) {
        System.out.println("服务器处理请求: " + request);
        // 模拟网络延迟
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "服务器响应: " + request.toUpperCase();
    }
    
    @Override
    public int getServerStatus() {
        System.out.println("检查服务器状态");
        return 200; // 正常状态
    }
}

// 远程代理
class RemoteServiceProxy implements RemoteService {
    private RemoteServiceImpl realService;
    
    public RemoteServiceProxy() {
        System.out.println("建立远程连接...");
        // 实际开发中这里会建立网络连接
        this.realService = new RemoteServiceImpl();
    }
    
    @Override
    public String processRequest(String request) {
        System.out.println("通过代理发送请求到远程服务器: " + request);
        String result = realService.processRequest(request);
        System.out.println("收到远程服务器响应: " + result);
        return result;
    }
    
    @Override
    public int getServerStatus() {
        System.out.println("通过代理检查远程服务器状态");
        return realService.getServerStatus();
    }
}
```

### 缓存代理示例

```java
import java.util.HashMap;
import java.util.Map;

// 数据库接口
interface Database {
    String query(String sql);
}

// 真实数据库实现
class RealDatabase implements Database {
    @Override
    public String query(String sql) {
        System.out.println("执行数据库查询: " + sql);
        // 模拟数据库查询时间
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "查询结果: " + sql; // 简化返回值
    }
}

// 缓存代理
class CachedDatabase implements Database {
    private RealDatabase realDatabase;
    private Map<String, String> cache;
    
    public CachedDatabase() {
        this.realDatabase = new RealDatabase();
        this.cache = new HashMap<>();
    }
    
    @Override
    public String query(String sql) {
        // 先检查缓存
        if (cache.containsKey(sql)) {
            System.out.println("从缓存返回结果: " + sql);
            return cache.get(sql);
        }
        
        // 缓存中没有，执行真实查询
        System.out.println("缓存未命中，执行真实查询: " + sql);
        String result = realDatabase.query(sql);
        
        // 将结果存入缓存
        cache.put(sql, result);
        return result;
    }
    
    public void clearCache() {
        System.out.println("清空缓存");
        cache.clear();
    }
}
```

### 智能引用代理示例

```java
import java.util.ArrayList;
import java.util.List;

// 文件接口
interface File {
    void read();
    void write(String content);
    void delete();
    String getName();
}

// 真实文件实现
class RealFile implements File {
    private String name;
    private String content;
    private boolean exists;
    
    public RealFile(String name) {
        this.name = name;
        this.exists = true;
        this.content = "文件内容...";
        System.out.println("创建文件: " + name);
    }
    
    @Override
    public void read() {
        if (exists) {
            System.out.println("读取文件: " + name);
            System.out.println("内容: " + content);
        } else {
            System.out.println("文件不存在: " + name);
        }
    }
    
    @Override
    public void write(String content) {
        if (exists) {
            System.out.println("写入文件: " + name);
            this.content = content;
        } else {
            System.out.println("文件不存在: " + name);
        }
    }
    
    @Override
    public void delete() {
        System.out.println("删除文件: " + name);
        exists = false;
    }
    
    @Override
    public String getName() {
        return name;
    }
}

// 智能引用代理
class SmartFileReference implements File {
    private RealFile realFile;
    private List<String> accessLog;
    private int referenceCount;
    
    public SmartFileReference(String filename) {
        this.realFile = new RealFile(filename);
        this.accessLog = new ArrayList<>();
        this.referenceCount = 1;
    }
    
    @Override
    public void read() {
        logAccess("读取");
        realFile.read();
    }
    
    @Override
    public void write(String content) {
        logAccess("写入");
        realFile.write(content);
    }
    
    @Override
    public void delete() {
        logAccess("删除");
        realFile.delete();
    }
    
    @Override
    public String getName() {
        return realFile.getName();
    }
    
    private void logAccess(String operation) {
        String logEntry = "时间: " + System.currentTimeMillis() + 
                         ", 操作: " + operation + 
                         ", 文件: " + getName();
        accessLog.add(logEntry);
        System.out.println("记录访问: " + logEntry);
    }
    
    public void addReference() {
        referenceCount++;
        System.out.println("增加引用，当前引用数: " + referenceCount);
    }
    
    public void removeReference() {
        referenceCount--;
        System.out.println("减少引用，当前引用数: " + referenceCount);
        if (referenceCount <= 0) {
            System.out.println("引用数为0，可以释放资源");
        }
    }
    
    public void printAccessLog() {
        System.out.println("=== 文件访问日志 ===");
        for (String log : accessLog) {
            System.out.println(log);
        }
    }
}
```

### Spring AOP 代理示例（概念展示）

```java
// 业务接口
interface UserService {
    String getUserInfo(String userId);
    boolean updateUser(String userId, String data);
}

// 业务实现
class UserServiceImpl implements UserService {
    @Override
    public String getUserInfo(String userId) {
        System.out.println("获取用户信息: " + userId);
        return "用户数据: " + userId;
    }
    
    @Override
    public boolean updateUser(String userId, String data) {
        System.out.println("更新用户: " + userId + ", 数据: " + data);
        return true;
    }
}

// 代理工厂 - 模拟Spring AOP
class UserServiceProxy implements UserService {
    private UserServiceImpl target;
    
    public UserServiceProxy(UserServiceImpl target) {
        this.target = target;
    }
    
    @Override
    public String getUserInfo(String userId) {
        // 前置通知
        System.out.println("方法执行前 - 记录日志: 开始获取用户信息");
        
        try {
            String result = target.getUserInfo(userId);
            
            // 后置通知
            System.out.println("方法执行后 - 记录日志: 成功获取用户信息");
            return result;
        } catch (Exception e) {
            // 异常通知
            System.out.println("方法执行异常 - 记录错误: " + e.getMessage());
            throw e;
        } finally {
            // 最终通知
            System.out.println("方法执行完毕 - 清理资源");
        }
    }
    
    @Override
    public boolean updateUser(String userId, String data) {
        System.out.println("方法执行前 - 验证权限");
        
        boolean result = target.updateUser(userId, data);
        
        System.out.println("方法执行后 - 发送通知");
        return result;
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 基础代理示例 ===");
        
        // 创建代理对象
        Image image1 = new ProxyImage("photo1.jpg");
        Image image2 = new ProxyImage("photo2.png");
        
        // 第一次访问，会加载图片
        image1.display();
        System.out.println();
        
        // 第二次访问同一图片，不会重复加载
        image1.display();
        System.out.println();
        
        // 访问另一张图片
        image2.display();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 虚拟代理示例 ===");
        
        // 创建虚拟文档代理（此时不加载真实文档）
        Document doc = new VirtualDocument("large_document.pdf");
        System.out.println("文档代理已创建，但真实文档尚未加载");
        
        // 第一次访问，触发真实文档加载
        doc.openDocument();
        System.out.println();
        
        // 再次访问，使用已加载的文档
        doc.editDocument();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 保护代理示例 ===");
        
        // 普通用户代理
        BankAccount userAccount = new ProtectedBankAccount("ACC123", 10000, "user");
        
        userAccount.deposit(5000);
        userAccount.withdraw(2000);
        System.out.println("当前余额: ¥" + userAccount.getBalance());
        
        // 尝试大额取款（普通用户权限不够）
        userAccount.withdraw(15000);
        
        System.out.println();
        
        // 管理员账户
        BankAccount adminAccount = new ProtectedBankAccount("ACC123", 10000, "admin");
        adminAccount.withdraw(15000); // 管理员可以大额取款
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 缓存代理示例 ===");
        
        CachedDatabase db = new CachedDatabase();
        
        // 第一次查询，会执行真实查询
        db.query("SELECT * FROM users WHERE id = 1");
        System.out.println();
        
        // 第二次相同查询，会从缓存返回
        db.query("SELECT * FROM users WHERE id = 1");
        System.out.println();
        
        // 不同查询，会执行真实查询
        db.query("SELECT * FROM orders WHERE id = 1");
        System.out.println();
        
        // 再次执行第一个查询，从缓存返回
        db.query("SELECT * FROM users WHERE id = 1");
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 智能引用代理示例 ===");
        
        SmartFileReference fileRef = new SmartFileReference("test.txt");
        
        fileRef.read();
        fileRef.write("新内容");
        fileRef.read();
        
        System.out.println();
        fileRef.printAccessLog();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== AOP代理示例 ===");
        
        UserService userService = new UserServiceProxy(new UserServiceImpl());
        
        userService.getUserInfo("user001");
        System.out.println();
        userService.updateUser("user001", "new data");
    }
}
```

## 代理模式 vs 装饰器模式

### 代理模式
- 目的是控制对对象的访问
- 通常只有一个代理类
- 关注的是如何访问对象
- 客户端通常不知道在和代理打交道

### 装饰器模式
- 目的是动态添加功能
- 可以有多个装饰器层层包装
- 关注的是增强对象功能
- 客户端明确知道自己在使用装饰器

## 代理模式的优缺点

### 优点
1. 代理模式能够协调调用者和被调用者，在一定程度上降低了系统的耦合度
2. 代理对象可以在客户端和目标对象之间起到中介的作用，保护目标对象
3. 代理可以扩展目标对象的功能
4. 在访问控制方面，可以对不同的客户端提供不同的访问权限

### 缺点
1. 由于在客户端和真实主题之间增加了代理对象，因此会造成请求的处理速度变慢
2. 实现代理模式需要额外的工作，有些代理模式的实现非常复杂

## 总结

代理模式就像程序界的“代购小哥”——它在客户端和真实服务之间充当桥梁，控制对真实服务的访问。根据不同的需求，代理可以提供不同的功能：延迟加载、权限控制、缓存、日志记录等。

记住：**代理模式适用于需要在访问对象时添加额外控制的场景，就像你需要一个中间人来帮你处理某些事务一样！**

在现代Java开发中，代理模式被广泛应用：
- Spring AOP（面向切面编程）
- RMI（远程方法调用）
- Hibernate的懒加载
- MyBatis的Mapper代理
- Web框架中的拦截器等