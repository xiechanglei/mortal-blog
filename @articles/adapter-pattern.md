# 适配器模式 (Adapter Pattern) - 程序界的“万能转换头”

## 什么是适配器模式？

想象一下，你从欧洲旅行回来，带回了一个电器，但发现家里的插座是三孔的，而你的电器插头是两孔的欧洲标准。这时候你就需要一个转换插头——这就是适配器模式的核心思想。

**适配器模式**将一个类的接口转换成客户希望的另一个接口。适配器模式让那些本来由于接口不兼容而不能一起工作的类可以一起工作。

## 为什么需要适配器模式？

在真实开发中，我们经常遇到以下情况：
- 使用第三方库，但其接口与我们的需求不匹配
- 旧系统升级，需要与新接口兼容
- 集成不同厂商的接口
- 代码复用时接口不匹配

适配器模式就像程序界的“万能转换头”，解决了接口不兼容的问题。

## 适配器模式的实现

### 对象适配器实现

```java
// 目标接口 - 期望的接口
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// 需要适配的类 - 具体的媒体播放器
class VLCPlayer {
    public void playVLC(String fileName) {
        System.out.println("播放VLC格式文件: " + fileName);
    }
    
    public void playMp4(String fileName) {
        System.out.println("播放MP4格式文件: " + fileName);
    }
}

class AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("播放VLC文件: " + fileName);
    }
    
    public void playMp4(String fileName) {
        System.out.println("播放MP4文件: " + fileName);
    }
}

// 适配器类
class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedMusicPlayer;
    
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer = new VLCPlayer();
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer = new AdvancedMediaPlayer();
        }
    }
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer.playMp4(fileName);
        }
    }
}

// 使用适配器的类
class AudioPlayer implements MediaPlayer {
    @Override
    public void play(String audioType, String fileName) {
        // 内置支持mp3格式
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("播放MP3文件: " + fileName);
        }
        // 通过适配器支持其他格式
        else if (audioType.equalsIgnoreCase("vlc") || 
                 audioType.equalsIgnoreCase("mp4")) {
            MediaAdapter mediaAdapter = new MediaAdapter(audioType);
            mediaAdapter.play(audioType, fileName);
        }
        else {
            System.out.println("格式不支持: " + audioType);
        }
    }
}
```

### 类适配器实现（使用继承）

```java
// 目标接口
interface Target {
    void request();
}

// 被适配的类
class Adaptee {
    public void specificRequest() {
        System.out.println("被适配类的方法被调用");
    }
}

// 类适配器（通过继承实现）
class ClassAdapter extends Adaptee implements Target {
    @Override
    public void request() {
        System.out.println("适配器调用适配方法:");
        specificRequest(); // 调用被适配的方法
    }
}
```

## 实际应用场景

### 支付系统适配器示例

```java
// 目标接口 - 统一的支付接口
interface PaymentProcessor {
    boolean processPayment(double amount);
    String getPaymentStatus();
}

// 第三方支付系统1 - 支付宝
class AlipaySystem {
    public boolean payWithAlipay(double amount) {
        System.out.println("通过支付宝支付: ¥" + amount);
        return true;
    }
    
    public String checkAlipayStatus() {
        return "Alipay: 处理中";
    }
}

// 第三方支付系统2 - 微信支付
class WechatPaySystem {
    public boolean payWithWechat(double amount) {
        System.out.println("通过微信支付: ¥" + amount);
        return true;
    }
    
    public String checkWechatStatus() {
        return "WechatPay: 成功";
    }
}

// 第三方支付系统3 - PayPal
class PayPalSystem {
    public boolean payViaPayPal(double amount) {
        System.out.println("通过PayPal支付: $" + amount);
        return true;
    }
    
    public String getPayPalStatus() {
        return "PayPal: 完成";
    }
}

// 支付适配器
class AlipayAdapter implements PaymentProcessor {
    private AlipaySystem alipay;
    
    public AlipayAdapter() {
        this.alipay = new AlipaySystem();
    }
    
    @Override
    public boolean processPayment(double amount) {
        return alipay.payWithAlipay(amount);
    }
    
    @Override
    public String getPaymentStatus() {
        return alipay.checkAlipayStatus();
    }
}

class WechatPayAdapter implements PaymentProcessor {
    private WechatPaySystem wechatPay;
    
    public WechatPayAdapter() {
        this.wechatPay = new WechatPaySystem();
    }
    
    @Override
    public boolean processPayment(double amount) {
        return wechatPay.payWithWechat(amount);
    }
    
    @Override
    public String getPaymentStatus() {
        return wechatPay.checkWechatStatus();
    }
}

class PayPalAdapter implements PaymentProcessor {
    private PayPalSystem paypal;
    
    public PayPalAdapter() {
        this.paypal = new PayPalSystem();
    }
    
    @Override
    public boolean processPayment(double amount) {
        return paypal.payViaPayPal(amount);
    }
    
    @Override
    public String getPaymentStatus() {
        return paypal.getPayPalStatus();
    }
}

// 订单处理系统
class OrderProcessor {
    private PaymentProcessor paymentProcessor;
    
    public OrderProcessor(PaymentProcessor paymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }
    
    public boolean processOrder(double amount) {
        System.out.println("开始处理订单，金额: " + amount);
        boolean result = paymentProcessor.processPayment(amount);
        if (result) {
            System.out.println("订单支付状态: " + paymentProcessor.getPaymentStatus());
            return true;
        }
        return false;
    }
    
    public static void main(String[] args) {
        // 使用支付宝支付
        PaymentProcessor alipayAdapter = new AlipayAdapter();
        OrderProcessor alipayOrder = new OrderProcessor(alipayAdapter);
        alipayOrder.processOrder(199.99);
        System.out.println();
        
        // 使用微信支付
        PaymentProcessor wechatAdapter = new WechatPayAdapter();
        OrderProcessor wechatOrder = new OrderProcessor(wechatAdapter);
        wechatOrder.processOrder(299.99);
        System.out.println();
        
        // 使用PayPal支付
        PaymentProcessor paypalAdapter = new PayPalAdapter();
        OrderProcessor paypalOrder = new OrderProcessor(paypalAdapter);
        paypalOrder.processOrder(49.99);
    }
}
```

### 数据库连接适配器示例

```java
import java.sql.Connection;

// 目标接口 - 统一的数据库接口
interface DBConnection {
    Connection connect();
    void executeQuery(String query);
    void close();
}

// MySQL数据库类（需要被适配）
class MySQLDatabase {
    public Connection createMySQLConnection() {
        System.out.println("创建MySQL连接");
        return null; // 实际开发中会返回真实的Connection
    }
    
    public void runMySQLQuery(String query) {
        System.out.println("执行MySQL查询: " + query);
    }
    
    public void disconnectMySQL() {
        System.out.println("关闭MySQL连接");
    }
}

// Oracle数据库类（需要被适配）
class OracleDatabase {
    public Connection getOracleConnection() {
        System.out.println("创建Oracle连接");
        return null;
    }
    
    public void executeOracleQuery(String query) {
        System.out.println("执行Oracle查询: " + query);
    }
    
    public void oracleClose() {
        System.out.println("关闭Oracle连接");
    }
}

// MySQL适配器
class MySQLAdapter implements DBConnection {
    private MySQLDatabase mySQLDatabase;
    
    public MySQLAdapter() {
        this.mySQLDatabase = new MySQLDatabase();
    }
    
    @Override
    public Connection connect() {
        return mySQLDatabase.createMySQLConnection();
    }
    
    @Override
    public void executeQuery(String query) {
        mySQLDatabase.runMySQLQuery(query);
    }
    
    @Override
    public void close() {
        mySQLDatabase.disconnectMySQL();
    }
}

// Oracle适配器
class OracleAdapter implements DBConnection {
    private OracleDatabase oracleDatabase;
    
    public OracleAdapter() {
        this.oracleDatabase = new OracleDatabase();
    }
    
    @Override
    public Connection connect() {
        return oracleDatabase.getOracleConnection();
    }
    
    @Override
    public void executeQuery(String query) {
        oracleDatabase.executeOracleQuery(query);
    }
    
    @Override
    public void close() {
        oracleDatabase.oracleClose();
    }
}
```

### 数据格式转换适配器示例

```java
import java.util.Map;
import java.util.HashMap;

// 目标接口 - 期望的数据接口
interface DataProcessor {
    Map<String, Object> process();
}

// 被适配的XML数据处理器
class XMLDataProcessor {
    private String xmlData;
    
    public XMLDataProcessor(String xmlData) {
        this.xmlData = xmlData;
    }
    
    public Map<String, String> parseXML() {
        System.out.println("解析XML数据: " + xmlData);
        Map<String, String> result = new HashMap<>();
        result.put("name", "John");
        result.put("age", "25");
        result.put("city", "Beijing");
        return result;
    }
}

// 被适配的JSON数据处理器
class JSONDataProcessor {
    private String jsonData;
    
    public JSONDataProcessor(String jsonData) {
        this.jsonData = jsonData;
    }
    
    public Map<String, Object> processJSON() {
        System.out.println("解析JSON数据: " + jsonData);
        Map<String, Object> result = new HashMap<>();
        result.put("name", "Jane");
        result.put("age", 30);
        result.put("city", "Shanghai");
        return result;
    }
}

// XML适配器
class XMLAdapter implements DataProcessor {
    private XMLDataProcessor xmlProcessor;
    
    public XMLAdapter(String xmlData) {
        this.xmlProcessor = new XMLDataProcessor(xmlData);
    }
    
    @Override
    public Map<String, Object> process() {
        Map<String, String> xmlResult = xmlProcessor.parseXML();
        Map<String, Object> convertedResult = new HashMap<>();
        
        for (Map.Entry<String, String> entry : xmlResult.entrySet()) {
            convertedResult.put(entry.getKey(), entry.getValue());
        }
        
        return convertedResult;
    }
}

// JSON适配器
class JSONAdapter implements DataProcessor {
    private JSONDataProcessor jsonProcessor;
    
    public JSONAdapter(String jsonData) {
        this.jsonProcessor = new JSONDataProcessor(jsonData);
    }
    
    @Override
    public Map<String, Object> process() {
        return jsonProcessor.processJSON();
    }
}

// 统一数据处理服务
class DataProcessorService {
    public void processData(DataProcessor processor) {
        Map<String, Object> result = processor.process();
        System.out.println("处理结果: " + result);
    }
    
    public static void main(String[] args) {
        // 处理XML数据
        DataProcessorService service = new DataProcessorService();
        
        DataProcessor xmlProcessor = new XMLAdapter("<xml><name>张三</name></xml>");
        service.processData(xmlProcessor);
        
        System.out.println();
        
        DataProcessor jsonProcessor = new JSONAdapter("{\"name\":\"李四\",\"age\":28}");
        service.processData(jsonProcessor);
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 使用音频播放器
        AudioPlayer audioPlayer = new AudioPlayer();
        
        audioPlayer.play("mp3", "song.mp3");
        audioPlayer.play("vlc", "movie.vlc");
        audioPlayer.play("mp4", "video.mp4");
        audioPlayer.play("avi", "film.avi");
        
        System.out.println("\n" + "=".repeat(40) + "\n");
        
        // 使用类适配器
        Target target = new ClassAdapter();
        target.request();
    }
}
```

## 适配器模式的优缺点

### 优点
1. 实现了接口的复用，提高了类的复用性
2. 将目标类和适配者解耦，通过引入适配器重用现有的适配者类
3. 增加了类的透明性和复用性
4. 灵活性好，可以随时替换适配器

### 缺点
1. 过多使用适配器会让系统复杂
2. 增加了系统的理解难度
3. 适配器的维护可能比较困难

## 对象适配器 vs 类适配器

### 对象适配器
- 优点：使用组合关系，更灵活，Java推荐
- 缺点：需要维护适配者对象的引用

### 类适配器
- 优点：直接继承适配者，可以直接调用适配者方法
- 缺点：只能适配一个适配者类，不够灵活

## 与装饰器模式的区别

- **适配器模式**：改变接口，让不兼容的接口能一起工作
- **装饰器模式**：保持接口，增强功能

## 总结

适配器模式就像程序界的“万能转换头”——当你有一个很好的工具，但接口不匹配时，适配器帮你解决问题。它让不兼容的接口能够协同工作，是集成第三方库时的有力工具。

记住：**适配器模式是解决接口不兼容问题的“万能钥匙”，就像万能转换头解决不同插头的问题一样！**

在Java标准库中，Collections的适配器方法（如Collections.list()）、Stream API等都使用了适配器模式的思想。