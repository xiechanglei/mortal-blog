# 外观模式 (Facade Pattern) - 程序界的“一站式服务”

## 什么是外观模式？

想象一下，你去政务大厅办事，以前你需要跑好几个不同的窗口处理不同的事务，现在有了“一站式服务”窗口，你只需要跟一个工作人员打交道，他帮你处理所有复杂的后台流程。外观模式就是程序界的“一站式服务”——它为子系统中的一组接口提供一个统一的接口。

**外观模式**为子系统中的一组接口提供一个一致的界面，此模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。

## 为什么需要外观模式？

在复杂的系统中，我们经常遇到以下问题：
- 子系统内部结构复杂，外部调用困难
- 调用多个子系统需要了解太多内部细节
- 系统间的耦合度高

外观模式通过提供一个简单的统一接口，让复杂的子系统变得容易使用。

## 外观模式的实现

### 家庭影院示例

```java
// 各种设备类
class Amplifier {
    private String description;
    private Tuner tuner;
    private DvdPlayer dvd;
    private CdPlayer cd;
    
    public Amplifier(String description) {
        this.description = description;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void setStereoSound() {
        System.out.println(description + " 设置立体声音响");
    }
    
    public void setSurroundSound() {
        System.out.println(description + " 设置环绕音响");
    }
    
    public void setVolume(int level) {
        System.out.println(description + " 设置音量到: " + level);
    }
    
    public void setTuner(Tuner tuner) {
        System.out.println(description + " 设置调谐器");
        this.tuner = tuner;
    }
    
    public void setDvd(DvdPlayer dvd) {
        System.out.println(description + " 设置DVD播放器");
        this.dvd = dvd;
    }
    
    public void setCd(CdPlayer cd) {
        System.out.println(description + " 设置CD播放器");
        this.cd = cd;
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class Tuner {
    private String description;
    private Amplifier amplifier;
    
    public Tuner(String description, Amplifier amplifier) {
        this.description = description;
        this.amplifier = amplifier;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void setFrequency(double frequency) {
        System.out.println(description + " 设置频率到 " + frequency);
    }
    
    public void setAm() {
        System.out.println(description + " 设置AM");
    }
    
    public void setFm() {
        System.out.println(description + " 设置FM");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class DvdPlayer {
    private String description;
    private int currentTrack;
    private String movie;
    
    public DvdPlayer(String description) {
        this.description = description;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void eject() {
        movie = null;
        System.out.println(description + " 弹出DVD");
    }
    
    public void play(String movie) {
        this.movie = movie;
        currentTrack = 0;
        System.out.println(description + " 正在播放 \"" + movie + "\"");
    }
    
    public void play(int track) {
        if (movie == null) {
            System.out.println(description + " 请先插入DVD");
        } else {
            currentTrack = track;
            System.out.println(description + " 正在播放 \"" + movie + 
                              "\" 的第 " + track + " 首");
        }
    }
    
    public void stop() {
        currentTrack = 0;
        System.out.println(description + " 停止播放 \"" + movie + "\"");
    }
    
    public void pause() {
        System.out.println(description + " 暂停播放 \"" + movie + "\"");
    }
    
    public void setTwoChannelAudio() {
        System.out.println(description + " 设置双声道音频");
    }
    
    public void setSurroundAudio() {
        System.out.println(description + " 设置环绕音频");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class CdPlayer {
    private String description;
    private int currentTrack;
    private String title;
    
    public CdPlayer(String description) {
        this.description = description;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void eject() {
        title = null;
        currentTrack = 0;
        System.out.println(description + " 弹出CD");
    }
    
    public void play(String title) {
        this.title = title;
        this.currentTrack = 0;
        System.out.println(description + " 正在播放 \"" + title + "\"");
    }
    
    public void play(int track) {
        if (title == null) {
            System.out.println(description + " 请先插入CD");
        } else {
            this.currentTrack = track;
            System.out.println(description + " 正在播放 \"" + title + 
                              "\" 的第 " + currentTrack + " 首");
        }
    }
    
    public void stop() {
        currentTrack = 0;
        System.out.println(description + " 停止播放 \"" + title + "\"");
    }
    
    public void pause() {
        System.out.println(description + " 暂停播放 \"" + title + "\"");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class Projector {
    private String description;
    private DvdPlayer dvdPlayer;
    
    public Projector(String description, DvdPlayer dvdPlayer) {
        this.description = description;
        this.dvdPlayer = dvdPlayer;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void wideScreenMode() {
        System.out.println(description + " 设置宽屏模式 (16:9)");
    }
    
    public void tvMode() {
        System.out.println(description + " 设置电视模式 (4:3)");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class TheaterLights {
    private String description;
    
    public TheaterLights(String description) {
        this.description = description;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void dim(int level) {
        System.out.println(description + " 调暗到 " + level + "%");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class PopcornPopper {
    private String description;
    
    public PopcornPopper(String description) {
        this.description = description;
    }
    
    public void on() {
        System.out.println(description + " 开启");
    }
    
    public void off() {
        System.out.println(description + " 关闭");
    }
    
    public void pop() {
        System.out.println(description + " 正在爆米花中...");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class Screen {
    private String description;
    
    public Screen(String description) {
        this.description = description;
    }
    
    public void up() {
        System.out.println(description + " 屏幕升起");
    }
    
    public void down() {
        System.out.println(description + " 屏幕降下");
    }
    
    @Override
    public String toString() {
        return description;
    }
}

class HomeTheaterFacade {
    Amplifier amp;
    Tuner tuner;
    DvdPlayer dvd;
    CdPlayer cd;
    Projector projector;
    TheaterLights lights;
    Screen screen;
    PopcornPopper popper;
    
    public HomeTheaterFacade(Amplifier amp, 
                             Tuner tuner,
                             DvdPlayer dvd, 
                             CdPlayer cd,
                             Projector projector, 
                             TheaterLights lights,
                             Screen screen, 
                             PopcornPopper popper) {
        this.amp = amp;
        this.tuner = tuner;
        this.dvd = dvd;
        this.cd = cd;
        this.projector = projector;
        this.lights = lights;
        this.screen = screen;
        this.popper = popper;
    }
    
    public void watchMovie(String movie) {
        System.out.println("准备播放电影...");
        
        popper.on();
        popper.pop();
        lights.dim(10);
        screen.down();
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setDvd(dvd);
        amp.setSurroundSound();
        amp.setVolume(5);
        dvd.on();
        dvd.play(movie);
    }
    
    public void endMovie() {
        System.out.println("正在关闭电影...");
        
        popper.off();
        lights.on();
        screen.up();
        projector.off();
        amp.off();
        dvd.stop();
        dvd.eject();
        dvd.off();
    }
    
    public void listenToCd(String cdTitle) {
        System.out.println("准备播放CD...");
        
        lights.on();
        amp.on();
        amp.setCd(cd);
        amp.setStereoSound();
        cd.on();
        cd.play(cdTitle);
    }
    
    public void endCd() {
        System.out.println("正在停止CD...");
        
        cd.eject();
        cd.off();
        amp.off();
    }
    
    public void listenToRadio(double frequency) {
        System.out.println("准备收听广播...");
        
        tuner.on();
        tuner.setFrequency(frequency);
        amp.on();
        amp.setTuner(tuner);
        amp.setVolume(5);
    }
    
    public void endRadio() {
        System.out.println("正在停止广播...");
        
        tuner.off();
        amp.off();
    }
}
```

### 简化版外观示例

```java
// 银行系统
class BankAccount {
    private double balance;
    
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        balance += amount;
        System.out.println("存款: " + amount + ", 余额: " + balance);
    }
    
    public void withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
            System.out.println("取款: " + amount + ", 余额: " + balance);
        } else {
            System.out.println("余额不足，取款失败");
        }
    }
    
    public double getBalance() {
        return balance;
    }
}

class CreditCheck {
    public boolean hasGoodCredit(String customerId) {
        System.out.println("检查客户 " + customerId + " 的信用");
        return true; // 简化示例
    }
}

class LoanEligibility {
    public boolean hasEligibleLoan(String customerId) {
        System.out.println("检查客户 " + customerId + " 的贷款资格");
        return true; // 简化示例
    }
}

class BackgroundCheck {
    public boolean hasCleanBackground(String customerId) {
        System.out.println("检查客户 " + customerId + " 的背景");
        return true; // 简化示例
    }
}

// 复杂的银行服务外观
class BankServiceFacade {
    private BankAccount account;
    private CreditCheck creditCheck;
    private LoanEligibility loanEligibility;
    private BackgroundCheck backgroundCheck;
    
    public BankServiceFacade(BankAccount account) {
        this.account = account;
        this.creditCheck = new CreditCheck();
        this.loanEligibility = new LoanEligibility();
        this.backgroundCheck = new BackgroundCheck();
    }
    
    // 简化贷款申请流程
    public boolean applyForLoan(String customerId) {
        System.out.println("=== 开始贷款申请流程 ===");
        
        // 检查信用
        if (!creditCheck.hasGoodCredit(customerId)) {
            System.out.println("贷款申请被拒绝：信用不良");
            return false;
        }
        
        // 检查贷款资格
        if (!loanEligibility.hasEligibleLoan(customerId)) {
            System.out.println("贷款申请被拒绝：不符贷款条件");
            return false;
        }
        
        // 检查背景
        if (!backgroundCheck.hasCleanBackground(customerId)) {
            System.out.println("贷款申请被拒绝：背景调查未通过");
            return false;
        }
        
        System.out.println("贷款申请成功！");
        return true;
    }
    
    // 简化转账流程
    public boolean transferMoney(double amount, String toAccount) {
        System.out.println("=== 开始转账流程 ===");
        
        if (account.getBalance() >= amount) {
            account.withdraw(amount);
            System.out.println("转账 " + amount + " 到账户 " + toAccount + " 成功");
            return true;
        } else {
            System.out.println("转账失败：余额不足");
            return false;
        }
    }
}
```

## 实际应用场景

### 电商系统外观示例

```java
// 各种子系统
class InventorySystem {
    public boolean checkAvailability(String productId) {
        System.out.println("检查 " + productId + " 的库存");
        return true; // 简化示例
    }
    
    public void updateInventory(String productId, int quantity) {
        System.out.println("更新 " + productId + " 的库存: -" + quantity);
    }
}

class PaymentSystem {
    public boolean processPayment(String paymentDetails, double amount) {
        System.out.println("处理支付，金额: ¥" + amount + "，详情: " + paymentDetails);
        return true; // 简化示例
    }
    
    public void refund(String paymentId) {
        System.out.println("退款处理: " + paymentId);
    }
}

class ShippingSystem {
    public void processShipping(String address) {
        System.out.println("处理发货到地址: " + address);
    }
    
    public String getTrackingNumber() {
        return "TRACK123456789";
    }
}

class NotificationSystem {
    public void sendOrderConfirmation(String email, String orderId) {
        System.out.println("发送订单确认邮件到: " + email + "，订单号: " + orderId);
    }
    
    public void sendShippingNotification(String email, String trackingNumber) {
        System.out.println("发送发货通知到: " + email + "，追踪号: " + trackingNumber);
    }
}

// 电商外观
class ECommerceFacade {
    private InventorySystem inventory;
    private PaymentSystem payment;
    private ShippingSystem shipping;
    private NotificationSystem notification;
    
    public ECommerceFacade() {
        this.inventory = new InventorySystem();
        this.payment = new PaymentSystem();
        this.shipping = new ShippingSystem();
        this.notification = new NotificationSystem();
    }
    
    public boolean processOrder(String productId, int quantity, 
                               String paymentDetails, String address, String email) {
        System.out.println("=== 开始处理订单 ===");
        
        // 1. 检查库存
        if (!inventory.checkAvailability(productId)) {
            System.out.println("订单处理失败：商品无库存");
            return false;
        }
        
        // 2. 处理支付
        double orderAmount = quantity * 100.0; // 简化价格计算
        if (!payment.processPayment(paymentDetails, orderAmount)) {
            System.out.println("订单处理失败：支付失败");
            return false;
        }
        
        // 3. 更新库存
        inventory.updateInventory(productId, quantity);
        
        // 4. 处理发货
        shipping.processShipping(address);
        String trackingNumber = shipping.getTrackingNumber();
        
        // 5. 发送通知
        String orderId = "ORDER" + System.currentTimeMillis();
        notification.sendOrderConfirmation(email, orderId);
        notification.sendShippingNotification(email, trackingNumber);
        
        System.out.println("订单处理成功！订单号: " + orderId);
        System.out.println("追踪号: " + trackingNumber);
        return true;
    }
    
    public boolean processRefund(String orderId, String paymentId) {
        System.out.println("=== 开始处理退款 ===");
        
        payment.refund(paymentId);
        System.out.println("退款处理成功，订单号: " + orderId);
        return true;
    }
}
```

### 操作系统API外观示例

```java
class FileOperations {
    public void createFile(String filename) {
        System.out.println("创建文件: " + filename);
    }
    
    public void deleteFile(String filename) {
        System.out.println("删除文件: " + filename);
    }
    
    public void readFile(String filename) {
        System.out.println("读取文件: " + filename);
    }
    
    public void writeFile(String filename, String content) {
        System.out.println("写入文件: " + filename + ", 内容: " + content);
    }
}

class NetworkOperations {
    public void connect(String url) {
        System.out.println("连接到: " + url);
    }
    
    public void disconnect(String url) {
        System.out.println("断开连接: " + url);
    }
    
    public void sendRequest(String data) {
        System.out.println("发送网络请求: " + data);
    }
    
    public void receiveResponse() {
        System.out.println("接收网络响应");
    }
}

class SecurityOperations {
    public void authenticateUser(String username, String password) {
        System.out.println("验证用户: " + username);
    }
    
    public void authorizeAccess(String resource) {
        System.out.println("授权访问资源: " + resource);
    }
    
    public void encryptData(String data) {
        System.out.println("加密数据: " + data);
    }
    
    public void decryptData(String encryptedData) {
        System.out.println("解密数据: " + encryptedData);
    }
}

class OperatingSystemFacade {
    private FileOperations fileOps;
    private NetworkOperations networkOps;
    private SecurityOperations securityOps;
    
    public OperatingSystemFacade() {
        this.fileOps = new FileOperations();
        this.networkOps = new NetworkOperations();
        this.securityOps = new SecurityOperations();
    }
    
    public void saveDocument(String filename, String content, String username, String password) {
        System.out.println("=== 开始保存文档 ===");
        
        // 认证用户
        securityOps.authenticateUser(username, password);
        
        // 授权访问
        securityOps.authorizeAccess(filename);
        
        // 加密内容
        securityOps.encryptData(content);
        
        // 写入文件
        fileOps.writeFile(filename, content);
        
        System.out.println("文档保存成功: " + filename);
    }
    
    public void uploadFile(String filename, String serverUrl) {
        System.out.println("=== 开始上传文件 ===");
        
        // 读取文件
        fileOps.readFile(filename);
        
        // 建立连接
        networkOps.connect(serverUrl);
        
        // 发送请求
        networkOps.sendRequest("UPLOAD " + filename);
        
        // 断开连接
        networkOps.disconnect(serverUrl);
        
        System.out.println("文件上传成功: " + filename + " 到 " + serverUrl);
    }
    
    public void downloadFile(String serverUrl, String filename) {
        System.out.println("=== 开始下载文件 ===");
        
        // 建立连接
        networkOps.connect(serverUrl);
        
        // 发送请求
        networkOps.sendRequest("DOWNLOAD " + filename);
        
        // 接收响应
        networkOps.receiveResponse();
        
        // 创建本地文件
        fileOps.createFile(filename);
        
        // 断开连接
        networkOps.disconnect(serverUrl);
        
        System.out.println("文件下载成功: " + filename + " 从 " + serverUrl);
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 家庭影院示例 ===");
        
        // 创建各种设备
        Amplifier amp = new Amplifier("Amplifier");
        Tuner tuner = new Tuner("AM/FM Tuner", amp);
        DvdPlayer dvd = new DvdPlayer("Top-O-Line DVD Player");
        CdPlayer cd = new CdPlayer("Top-O-Line CD Player");
        Projector projector = new Projector("Top-O-Line Projector", dvd);
        TheaterLights lights = new TheaterLights("Theater Ceiling Lights");
        Screen screen = new Screen("Theater Screen");
        PopcornPopper popper = new PopcornPopper("Popcorn Popper");
        
        // 创建外观
        HomeTheaterFacade homeTheater = 
            new HomeTheaterFacade(amp, tuner, dvd, cd, 
                                 projector, lights, screen, popper);
        
        // 观看电影
        homeTheater.watchMovie("雷神3：诸神黄昏");
        System.out.println();
        homeTheater.endMovie();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 银行服务示例 ===");
        
        BankAccount account = new BankAccount(10000);
        BankServiceFacade bankService = new BankServiceFacade(account);
        
        // 申请贷款
        bankService.applyForLoan("CUST123456");
        
        System.out.println();
        
        // 转账
        bankService.transferMoney(2000, "ACC789012");
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 电商系统示例 ===");
        
        ECommerceFacade ecommerce = new ECommerceFacade();
        
        // 处理订单
        ecommerce.processOrder("PROD001", 2, "VISA-1234", 
                              "北京市朝阳区xxx街道", "customer@example.com");
        
        System.out.println();
        
        // 处理退款
        ecommerce.processRefund("ORDER123456789", "PAY987654321");
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 操作系统示例 ===");
        
        OperatingSystemFacade osFacade = new OperatingSystemFacade();
        
        // 保存文档
        osFacade.saveDocument("report.txt", "这是一份重要报告", "admin", "password");
        
        System.out.println();
        
        // 上传文件
        osFacade.uploadFile("report.txt", "ftp://server.com/upload");
        
        System.out.println();
        
        // 下载文件
        osFacade.downloadFile("http://server.com", "document.pdf");
    }
}
```

## 外观模式的优缺点

### 优点
1. 简化了客户端的使用，提供了一个简单的接口
2. 客户端与子系统之间的依赖关系减少
3. 提高了子系统的独立性和可移植性
4. 对客户屏蔽了子系统组件

### 缺点
1. 违反了开闭原则，增加新的子系统可能需要修改外观类
2. 可能成为与程序中所有类都耦合的上帝对象
3. 不符合高内聚低耦合原则

## 外观模式 vs 适配器模式 vs 装饰器模式

### 外观模式
- 为子系统提供统一接口
- 目的是简化复杂系统
- 通常是一个类

### 适配器模式
- 转换接口，使不兼容的接口可以一起工作
- 目的是接口转换
- 通常针对特定接口

### 装饰器模式
- 动态添加职责
- 目的是增强功能
- 保持原有接口

## 总结

外观模式就像程序界的“一站式服务”——它把复杂的后台操作封装起来，只给用户提供一个简单的接口。就像政务大厅的综合服务窗口，你不需要了解所有后台流程，只需要跟一个窗口打交道。

记住：**外观模式适用于需要简化复杂系统调用的场景，就像你需要一个统一的入口来操作复杂的子系统！**

在Java标准库中，JDBC API就是一个很好的外观模式的例子，它封装了数据库连接的复杂细节，为开发者提供简单易用的接口。