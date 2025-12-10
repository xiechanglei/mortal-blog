# 观察者模式 (Observer Pattern) - 程序界的“广播站”

## 什么是观察者模式？

想象一下电视广播站，当有重要新闻发生时，广播站会向所有电视机发送信号，所有正在收看的电视机都会立即显示这条新闻。观察者模式就是这样——它定义了对象之间的一对多依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新。

**观察者模式**定义了对象之间的一对多依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新。

## 为什么需要观察者模式？

在以下场景中，观察者模式特别有用：

1. 当一个对象的改变需要同时改变其他对象，而不知道具体有多少对象有待改变时
2. 当一个对象必须通知其他对象，但不能假定其他对象是谁时
3. 需要在系统中创建一种松耦合的通信机制

## 观察者模式的实现

### 基础观察者结构

```java
import java.util.*;

// 观察者接口
interface Observer {
    void update(String message);
}

// 被观察者接口
interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers(String message);
}

// 具体被观察者 - 新闻发布系统
class NewsAgency implements Subject {
    private List<Observer> observers;
    private String news;
    
    public NewsAgency() {
        this.observers = new ArrayList<>();
    }
    
    @Override
    public void registerObserver(Observer observer) {
        observers.add(observer);
        System.out.println("新增订阅者");
    }
    
    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
        System.out.println("移除订阅者");
    }
    
    @Override
    public void notifyObservers(String message) {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
    
    // 当新闻发布时，通知所有观察者
    public void setNews(String news) {
        this.news = news;
        System.out.println("新闻机构发布: " + news);
        notifyObservers(news);
    }
}

// 具体观察者 - 新闻频道
class NewsChannel implements Observer {
    private String channelName;
    
    public NewsChannel(String channelName) {
        this.channelName = channelName;
    }
    
    @Override
    public void update(String message) {
        System.out.println(channelName + " 接收到新闻: " + message);
    }
}
```

### 气象监测系统示例

```java
// 气象数据类
class WeatherData {
    private float temperature;
    private float humidity;
    private float pressure;
    
    public WeatherData(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
    }
    
    public float getTemperature() { return temperature; }
    public float getHumidity() { return humidity; }
    public float getPressure() { return pressure; }
    
    @Override
    public String toString() {
        return String.format("温度: %.2f°C, 湿度: %.2f%%, 气压: %.2f hPa", 
                           temperature, humidity, pressure);
    }
}

// 气象站 - 被观察者
class WeatherStation {
    private List<WeatherDisplay> displays;
    private WeatherData currentWeather;
    
    public WeatherStation() {
        this.displays = new ArrayList<>();
    }
    
    public void registerDisplay(WeatherDisplay display) {
        displays.add(display);
    }
    
    public void removeDisplay(WeatherDisplay display) {
        displays.remove(display);
    }
    
    public void setWeatherData(WeatherData weatherData) {
        this.currentWeather = weatherData;
        System.out.println("气象站更新数据: " + weatherData);
        notifyDisplays();
    }
    
    private void notifyDisplays() {
        for (WeatherDisplay display : displays) {
            display.update(currentWeather);
        }
    }
}

// 气象显示接口
interface WeatherDisplay {
    void update(WeatherData weatherData);
}

// 当前状况显示板
class CurrentConditionDisplay implements WeatherDisplay {
    private WeatherData weatherData;
    
    @Override
    public void update(WeatherData weatherData) {
        this.weatherData = weatherData;
        display();
    }
    
    public void display() {
        if (weatherData != null) {
            System.out.println("当前状况显示板 - " + weatherData);
        }
    }
}

// 统计显示板
class StatisticsDisplay implements WeatherDisplay {
    private float maxTemp = 0.0f;
    private float minTemp = 200.0f;
    private float tempSum = 0.0f;
    private int numReadings;
    
    @Override
    public void update(WeatherData weatherData) {
        float temp = weatherData.getTemperature();
        tempSum += temp;
        numReadings++;
        
        if (temp > maxTemp) {
            maxTemp = temp;
        }
        
        if (temp < minTemp) {
            minTemp = temp;
        }
        
        display();
    }
    
    public void display() {
        System.out.printf("统计显示板 - 平均温度: %.2f°C, 最高温度: %.2f°C, 最低温度: %.2f°C\n",
                         (tempSum / numReadings), maxTemp, minTemp);
    }
}

// 预测显示板
class ForecastDisplay implements WeatherDisplay {
    private float currentPressure = 29.92f;
    private float lastPressure;
    
    @Override
    public void update(WeatherData weatherData) {
        lastPressure = currentPressure;
        currentPressure = weatherData.getPressure();
        display();
    }
    
    public void display() {
        System.out.print("预测显示板 - 天气预报: ");
        if (currentPressure > lastPressure) {
            System.out.println("天气将变得更好！");
        } else if (currentPressure < lastPressure) {
            System.out.println("天气可能变坏！");
        } else {
            System.out.println("天气保持稳定");
        }
    }
}
```

## 实际应用场景

### 股票交易系统示例

```java
import java.util.*;

// 股票数据类
class StockData {
    private String symbol;
    private double price;
    private double change;
    private String timestamp;
    
    public StockData(String symbol, double price, double change, String timestamp) {
        this.symbol = symbol;
        this.price = price;
        this.change = change;
        this.timestamp = timestamp;
    }
    
    public String getSymbol() { return symbol; }
    public double getPrice() { return price; }
    public double getChange() { return change; }
    public String getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return String.format("%s: ¥%.2f (¥%.2f)", symbol, price, change);
    }
}

// 股票交易所
class StockExchange {
    private Map<String, Double> stockPrices;
    private List<StockObserver> observers;
    
    public StockExchange() {
        this.stockPrices = new HashMap<>();
        this.observers = new ArrayList<>();
        
        // 初始化一些股票价格
        stockPrices.put("AAPL", 150.0);
        stockPrices.put("GOOGL", 2500.0);
        stockPrices.put("MSFT", 300.0);
    }
    
    public void addObserver(StockObserver observer) {
        observers.add(observer);
    }
    
    public void removeObserver(StockObserver observer) {
        observers.remove(observer);
    }
    
    public void updatePrice(String symbol, double newPrice) {
        double oldPrice = stockPrices.getOrDefault(symbol, 0.0);
        double change = newPrice - oldPrice;
        stockPrices.put(symbol, newPrice);
        
        StockData stockData = new StockData(symbol, newPrice, change, 
                                          new java.util.Date().toString());
        
        System.out.println("股票价格更新: " + stockData);
        notifyObservers(stockData);
    }
    
    private void notifyObservers(StockData stockData) {
        for (StockObserver observer : observers) {
            observer.update(stockData);
        }
    }
    
    public double getPrice(String symbol) {
        return stockPrices.get(symbol);
    }
}

// 股票观察者接口
interface StockObserver {
    void update(StockData stockData);
}

// 个人投资者观察者
class IndividualInvestor implements StockObserver {
    private String investorName;
    private Set<String> watchedStocks;
    private Map<String, Double> purchasePrices; // 记录购买价格以便计算盈亏
    
    public IndividualInvestor(String investorName) {
        this.investorName = investorName;
        this.watchedStocks = new HashSet<>();
        this.purchasePrices = new HashMap<>();
    }
    
    public void watchStock(String symbol) {
        watchedStocks.add(symbol);
    }
    
    public void buyStock(String symbol, double purchasePrice) {
        purchasePrices.put(symbol, purchasePrice);
        watchStock(symbol);
        System.out.println(investorName + " 购买 " + symbol + " 股票，价格: ¥" + purchasePrice);
    }
    
    @Override
    public void update(StockData stockData) {
        if (watchedStocks.contains(stockData.getSymbol())) {
            System.out.print(investorName + " 收到通知: " + stockData);
            
            // 计算盈亏
            Double purchasePrice = purchasePrices.get(stockData.getSymbol());
            if (purchasePrice != null) {
                double profit = (stockData.getPrice() - purchasePrice) * 100; // 假设持有100股
                System.out.print(" (盈亏: " + (profit >= 0 ? "¥" + profit : "-¥" + Math.abs(profit)) + ")");
            }
            System.out.println();
        }
    }
}

// 机构投资者观察者
class InstitutionalInvestor implements StockObserver {
    private String institutionName;
    private List<String> monitoredStocks;
    
    public InstitutionalInvestor(String institutionName) {
        this.institutionName = institutionName;
        this.monitoredStocks = new ArrayList<>();
    }
    
    public void monitorStock(String symbol) {
        if (!monitoredStocks.contains(symbol)) {
            monitoredStocks.add(symbol);
        }
    }
    
    @Override
    public void update(StockData stockData) {
        if (monitoredStocks.contains(stockData.getSymbol())) {
            System.out.println(institutionName + " 监控到 " + stockData);
            
            // 如果股价大幅波动，可能触发交易决策
            if (Math.abs(stockData.getChange()) > 10.0) {
                System.out.println(institutionName + " 考虑调整 " + 
                                 stockData.getSymbol() + " 的持仓");
            }
        }
    }
}

// 新闻服务观察者
class FinancialNewsService implements StockObserver {
    @Override
    public void update(StockData stockData) {
        if (Math.abs(stockData.getChange()) > 5.0) { // 大幅波动才报道
            System.out.println("财经新闻: " + stockData.getSymbol() + 
                             " 股价大幅波动: " + stockData.getChange());
        }
    }
}
```

### 用户界面更新示例

```java
// 数据模型
class UserModel {
    private String username;
    private String email;
    private int score;
    private List<DataObserver> observers;
    
    public UserModel() {
        this.observers = new ArrayList<>();
    }
    
    // 观察者接口
    interface DataObserver {
        void onDataChanged(String field, Object newValue);
    }
    
    public void addObserver(DataObserver observer) {
        observers.add(observer);
    }
    
    public void removeObserver(DataObserver observer) {
        observers.remove(observer);
    }
    
    private void notifyObservers(String field, Object newValue) {
        for (DataObserver observer : observers) {
            observer.onDataChanged(field, newValue);
        }
    }
    
    public void setUsername(String username) {
        this.username = username;
        notifyObservers("username", username);
    }
    
    public void setEmail(String email) {
        this.email = email;
        notifyObservers("email", email);
    }
    
    public void setScore(int score) {
        this.score = score;
        notifyObservers("score", score);
    }
    
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public int getScore() { return score; }
}

// UI组件观察者
class UserProfileView implements UserModel.DataObserver {
    @Override
    public void onDataChanged(String field, Object newValue) {
        System.out.println("UI更新: " + field + " 变更为 " + newValue);
        // 在实际应用中，这里会更新UI组件
        updateField(field, newValue);
    }
    
    private void updateField(String field, Object value) {
        switch (field) {
            case "username":
                System.out.println("  更新用户名显示: " + value);
                break;
            case "email":
                System.out.println("  更新邮箱显示: " + value);
                break;
            case "score":
                System.out.println("  更新积分显示: " + value);
                break;
        }
    }
}

class LeaderboardView implements UserModel.DataObserver {
    @Override
    public void onDataChanged(String field, Object newValue) {
        if ("score".equals(field)) {
            System.out.println("排行榜更新: 用户积分变更为 " + newValue);
            // 更新排行榜显示
        }
    }
}
```

### 消息队列观察者示例

```java
import java.util.concurrent.*;

// 简单的消息
class Message {
    private String topic;
    private String content;
    private long timestamp;
    
    public Message(String topic, String content) {
        this.topic = topic;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
    }
    
    public String getTopic() { return topic; }
    public String getContent() { return content; }
    public long getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return "[" + topic + "] " + content + " (时间: " + timestamp + ")";
    }
}

// 消息队列观察者
interface MessageObserver {
    void onMessageReceived(Message message);
}

// 消息队列系统
class MessageQueue {
    private Map<String, List<MessageObserver>> topicObservers;
    private ExecutorService executor;
    
    public MessageQueue() {
        this.topicObservers = new ConcurrentHashMap<>();
        this.executor = Executors.newFixedThreadPool(5);
    }
    
    public void subscribe(String topic, MessageObserver observer) {
        topicObservers.computeIfAbsent(topic, k -> new CopyOnWriteArrayList<>()).add(observer);
        System.out.println("订阅者加入主题: " + topic);
    }
    
    public void unsubscribe(String topic, MessageObserver observer) {
        List<MessageObserver> observers = topicObservers.get(topic);
        if (observers != null) {
            observers.remove(observer);
            System.out.println("订阅者离开主题: " + topic);
        }
    }
    
    public void publish(String topic, String content) {
        Message message = new Message(topic, content);
        System.out.println("发布消息到主题 " + topic + ": " + content);
        
        List<MessageObserver> observers = topicObservers.get(topic);
        if (observers != null) {
            for (MessageObserver observer : observers) {
                // 异步通知观察者
                executor.submit(() -> observer.onMessageReceived(message));
            }
        }
    }
    
    public void shutdown() {
        executor.shutdown();
    }
}

// 消息处理器 - 具体观察者
class EmailService implements MessageObserver {
    @Override
    public void onMessageReceived(Message message) {
        if (message.getTopic().startsWith("notification")) {
            System.out.println("邮件服务收到消息，发送邮件: " + message.getContent());
        }
    }
}

class SMSService implements MessageObserver {
    @Override
    public void onMessageReceived(Message message) {
        if (message.getTopic().startsWith("alert")) {
            System.out.println("短信服务收到消息，发送短信: " + message.getContent());
        }
    }
}

class LogService implements MessageObserver {
    @Override
    public void onMessageReceived(Message message) {
        System.out.println("日志服务记录消息: " + message);
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 基础观察者示例 ===");
        
        NewsAgency agency = new NewsAgency();
        
        NewsChannel channel1 = new NewsChannel("CCTV-1");
        NewsChannel channel2 = new NewsChannel("CCTV-13");
        NewsChannel channel3 = new NewsChannel("BBC");
        
        agency.registerObserver(channel1);
        agency.registerObserver(channel2);
        agency.registerObserver(channel3);
        
        agency.setNews("重大新闻：新的科技突破！");
        
        System.out.println();
        agency.removeObserver(channel2);
        agency.setNews("体育新闻：足球比赛结果");
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 气象监测系统示例 ===");
        
        WeatherStation weatherStation = new WeatherStation();
        
        CurrentConditionDisplay currentDisplay = new CurrentConditionDisplay();
        StatisticsDisplay statisticsDisplay = new StatisticsDisplay();
        ForecastDisplay forecastDisplay = new ForecastDisplay();
        
        weatherStation.registerDisplay(currentDisplay);
        weatherStation.registerDisplay(statisticsDisplay);
        weatherStation.registerDisplay(forecastDisplay);
        
        // 模拟几次天气数据更新
        weatherStation.setWeatherData(new WeatherData(25.5f, 65.0f, 1013.2f));
        weatherStation.setWeatherData(new WeatherData(26.2f, 70.0f, 1012.8f));
        weatherStation.setWeatherData(new WeatherData(24.8f, 60.0f, 1013.5f));
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 股票交易系统示例 ===");
        
        StockExchange exchange = new StockExchange();
        
        IndividualInvestor investor1 = new IndividualInvestor("张三");
        IndividualInvestor investor2 = new IndividualInvestor("李四");
        InstitutionalInvestor institution = new InstitutionalInvestor("华泰证券");
        FinancialNewsService newsService = new FinancialNewsService();
        
        // 投资者购买股票
        investor1.buyStock("AAPL", 145.0);
        investor2.buyStock("GOOGL", 2480.0);
        investor2.buyStock("MSFT", 295.0);
        
        // 设置监控
        institution.monitorStock("AAPL");
        institution.monitorStock("GOOGL");
        
        // 注册观察者
        exchange.addObserver(investor1);
        exchange.addObserver(investor2);
        exchange.addObserver(institution);
        exchange.addObserver(newsService);
        
        // 更新股价
        exchange.updatePrice("AAPL", 155.0);
        System.out.println();
        exchange.updatePrice("GOOGL", 2520.0);
        System.out.println();
        exchange.updatePrice("MSFT", 305.0);
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 用户界面观察者示例 ===");
        
        UserModel user = new UserModel();
        
        UserProfileView profileView = new UserProfileView();
        LeaderboardView leaderboardView = new LeaderboardView();
        
        user.addObserver(profileView);
        user.addObserver(leaderboardView);
        
        user.setUsername("Alice");
        user.setEmail("alice@example.com");
        user.setScore(1500);
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 消息队列观察者示例 ===");
        
        MessageQueue messageQueue = new MessageQueue();
        
        EmailService emailService = new EmailService();
        SMSService smsService = new SMSService();
        LogService logService = new LogService();
        
        // 订阅不同主题
        messageQueue.subscribe("notification.user", emailService);
        messageQueue.subscribe("alert.security", smsService);
        messageQueue.subscribe("log.system", logService);
        
        // 发布消息
        messageQueue.publish("notification.user", "欢迎新用户注册");
        messageQueue.publish("alert.security", "检测到异常登录");
        messageQueue.publish("log.system", "系统启动");
        
        // 演示取消订阅
        messageQueue.unsubscribe("notification.user", emailService);
        messageQueue.publish("notification.user", "第二次欢迎消息");
        
        // 关闭消息队列
        messageQueue.shutdown();
    }
}
```

## 观察者模式的优缺点

### 优点
1. 建立了一套触发机制，被观察者状态改变时能自动通知观察者
2. 观察者和被观察者之间是抽象耦合关系，容易扩展
3. 支持广播通信，简化了一对多系统的设计难度

### 缺点
1. 如果观察者数量过多，通知所有观察者会花费很多时间
2. 如果观察者和被观察者之间有循环依赖，可能导致系统崩溃
3. 观察者只知道被观察者状态发生了变化，但不知道变化的具体内容

## Java内置观察者模式

Java提供了内置的观察者模式实现：

```java
import java.util.*;

// 继承Observable类
class ConcreteObservable extends Observable {
    private String data;
    
    public void setData(String data) {
        this.data = data;
        setChanged(); // 标记状态已改变
        notifyObservers(data); // 通知观察者
    }
    
    public String getData() {
        return data;
    }
}

// 实现Observer接口
class ConcreteObserver implements Observer {
    private String name;
    
    public ConcreteObserver(String name) {
        this.name = name;
    }
    
    @Override
    public void update(Observable o, Object arg) {
        System.out.println(name + " 收到更新: " + arg);
    }
}

// 使用Java内置的观察者模式
class JavaObserverExample {
    public static void main(String[] args) {
        ConcreteObservable observable = new ConcreteObservable();
        
        Observer observer1 = new ConcreteObserver("观察者1");
        Observer observer2 = new ConcreteObserver("观察者2");
        
        observable.addObserver(observer1);
        observable.addObserver(observer2);
        
        observable.setData("新的数据");
    }
}
```

## 观察者模式 vs 发布-订阅模式

### 观察者模式
- 观察者和被观察者之间直接通信
- 紧耦合关系
- 主要用于对象状态变化的通知

### 发布-订阅模式
- 通过消息代理进行通信
- 松耦合关系
- 主要用于异步消息传递

## 总结

观察者模式就像程序界的"广播站"——它建立了一对多的依赖关系，当被观察者状态改变时，所有观察者都能自动收到通知。就像电视台广播新闻时，所有电视机都能接收到信号一样。

记住：**观察者模式适用于需要建立松耦合的一对多依赖关系的场景，特别是在需要实时通知的系统中！**

在现代Java开发中，观察者模式被广泛应用于：
- GUI事件处理系统
- Spring框架的事件机制
- 消息队列系统
- MVC架构中的Model-View通信
- 响应式编程等