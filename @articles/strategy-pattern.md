# 策略模式 (Strategy Pattern) - 程序界的“多面手”

## 什么是策略模式？

想象一下，你要从北京去上海，你可以选择多种方式：飞机、高铁、汽车、轮船。每种方式都是一种策略，都能达到目的，但各有优缺点。策略模式就是这样——它定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，让算法的变化独立于使用算法的客户。

**策略模式**定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，让算法的变化独立于使用算法的客户。

## 为什么需要策略模式？

在以下场景中，策略模式特别有用：

1. 当你想用不同的方式来处理一个问题时
2. 当你的类中有大量的条件语句来选择不同的行为时
3. 当你需要在运行时选择不同的算法变体时
4. 当不同的算法提供的功能基本相同，只是实现方式不同时

## 策略模式的实现

### 旅行策略示例

```java
// 策略接口 - 旅行方式
interface TravelStrategy {
    void travel(String from, String to);
    double calculateCost(double distance);
    double calculateTime(double distance);
}

// 具体策略 - 飞机
class AirplaneStrategy implements TravelStrategy {
    @Override
    public void travel(String from, String to) {
        System.out.println("乘坐飞机从 " + from + " 到 " + to);
    }
    
    @Override
    public double calculateCost(double distance) {
        return distance * 0.8; // 每公里0.8元
    }
    
    @Override
    public double calculateTime(double distance) {
        return distance / 800.0 + 2.0; // 飞行速度800km/h + 起降时间2小时
    }
}

// 具体策略 - 高铁
class HighSpeedRailStrategy implements TravelStrategy {
    @Override
    public void travel(String from, String to) {
        System.out.println("乘坐高铁从 " + from + " 到 " + to);
    }
    
    @Override
    public double calculateCost(double distance) {
        return distance * 0.5; // 每公里0.5元
    }
    
    @Override
    public double calculateTime(double distance) {
        return distance / 300.0 + 0.5; // 高铁速度300km/h + 换乘时间0.5小时
    }
}

// 具体策略 - 自驾
class CarStrategy implements TravelStrategy {
    @Override
    public void travel(String from, String to) {
        System.out.println("自驾从 " + from + " 到 " + to);
    }
    
    @Override
    public double calculateCost(double distance) {
        return distance * 0.6 + 400; // 每公里0.6元 + 过路费400元
    }
    
    @Override
    public double calculateTime(double distance) {
        return distance / 100.0 + 1.0; // 驾驶速度100km/h + 准备时间1小时
    }
}

// 具体策略 - 公交
class BusStrategy implements TravelStrategy {
    @Override
    public void travel(String from, String to) {
        System.out.println("乘坐长途汽车从 " + from + " 到 " + to);
    }
    
    @Override
    public double calculateCost(double distance) {
        return distance * 0.3; // 每公里0.3元
    }
    
    @Override
    public double calculateTime(double distance) {
        return distance / 60.0 + 2.0; // 公交速度60km/h + 等车时间2小时
    }
}

// 上下文类 - 旅行规划器
class TravelPlanner {
    private TravelStrategy strategy;
    
    public void setStrategy(TravelStrategy strategy) {
        this.strategy = strategy;
    }
    
    public void planTrip(String from, String to, double distance) {
        if (strategy != null) {
            strategy.travel(from, to);
            System.out.println("费用: ¥" + String.format("%.2f", strategy.calculateCost(distance)));
            System.out.println("时间: " + String.format("%.2f", strategy.calculateTime(distance)) + " 小时");
        } else {
            System.out.println("请先设置旅行策略");
        }
    }
}
```

### 排序策略示例

```java
import java.util.*;

// 排序策略接口
interface SortStrategy {
    <T extends Comparable<T>> void sort(List<T> list);
}

// 具体策略 - 快速排序
class QuickSortStrategy implements SortStrategy {
    @Override
    public <T extends Comparable<T>> void sort(List<T> list) {
        System.out.println("使用快速排序");
        quickSort(list, 0, list.size() - 1);
    }
    
    @SuppressWarnings("unchecked")
    private <T extends Comparable<T>> void quickSort(List<T> list, int low, int high) {
        if (low < high) {
            int pi = partition((List)list, low, high);
            quickSort((List)list, low, pi - 1);
            quickSort((List)list, pi + 1, high);
        }
    }
    
    @SuppressWarnings("unchecked")
    private <T extends Comparable<T>> int partition(List<T> list, int low, int high) {
        T pivot = list.get(high);
        int i = (low - 1);
        
        for (int j = low; j < high; j++) {
            if (list.get(j).compareTo(pivot) <= 0) {
                i++;
                Collections.swap(list, i, j);
            }
        }
        Collections.swap(list, i + 1, high);
        return i + 1;
    }
}

// 具体策略 - 归并排序
class MergeSortStrategy implements SortStrategy {
    @Override
    public <T extends Comparable<T>> void sort(List<T> list) {
        System.out.println("使用归并排序");
        if (list.size() > 1) {
            mergeSort(list, 0, list.size() - 1);
        }
    }
    
    @SuppressWarnings("unchecked")
    private <T extends Comparable<T>> void mergeSort(List<T> list, int left, int right) {
        if (left < right) {
            int middle = (left + right) / 2;
            mergeSort((List)list, left, middle);
            mergeSort((List)list, middle + 1, right);
            merge((List)list, left, middle, right);
        }
    }
    
    @SuppressWarnings("unchecked")
    private <T extends Comparable<T>> void merge(List<T> list, int left, int middle, int right) {
        int n1 = middle - left + 1;
        int n2 = right - middle;
        
        List<T> leftList = new ArrayList<>();
        List<T> rightList = new ArrayList<>();
        
        for (int i = 0; i < n1; i++) {
            leftList.add(list.get(left + i));
        }
        for (int j = 0; j < n2; j++) {
            rightList.add(list.get(middle + 1 + j));
        }
        
        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (leftList.get(i).compareTo(rightList.get(j)) <= 0) {
                list.set(k, leftList.get(i));
                i++;
            } else {
                list.set(k, rightList.get(j));
                j++;
            }
            k++;
        }
        
        while (i < n1) {
            list.set(k, leftList.get(i));
            i++;
            k++;
        }
        
        while (j < n2) {
            list.set(k, rightList.get(j));
            j++;
            k++;
        }
    }
}

// 具体策略 - 冒泡排序
class BubbleSortStrategy implements SortStrategy {
    @Override
    public <T extends Comparable<T>> void sort(List<T> list) {
        System.out.println("使用冒泡排序");
        int n = list.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (list.get(j).compareTo(list.get(j + 1)) > 0) {
                    Collections.swap(list, j, j + 1);
                }
            }
        }
    }
}

// 排序上下文
class SortContext {
    private SortStrategy strategy;
    
    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }
    
    public <T extends Comparable<T>> void executeSort(List<T> list) {
        if (strategy != null) {
            List<T> copy = new ArrayList<>(list); // 创建副本以保留原列表
            strategy.sort(copy);
            System.out.println("排序结果: " + copy);
        } else {
            System.out.println("请先设置排序策略");
        }
    }
}
```

## 实际应用场景

### 支付策略示例

```java
import java.util.*;

// 支付策略接口
interface PaymentStrategy {
    boolean pay(double amount);
    String getPaymentMethod();
}

// 信用卡支付策略
class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    private String cvv;
    private String expiryDate;
    
    public CreditCardPayment(String cardNumber, String cvv, String expiryDate) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiryDate = expiryDate;
    }
    
    @Override
    public boolean pay(double amount) {
        System.out.println("使用信用卡支付 ¥" + amount);
        System.out.println("卡号: ****-****-****-" + cardNumber.substring(cardNumber.length() - 4));
        System.out.println("处理信用卡支付...");
        return true; // 简化实现，总是成功
    }
    
    @Override
    public String getPaymentMethod() {
        return "信用卡";
    }
}

// 支付宝支付策略
class AlipayPayment implements PaymentStrategy {
    private String account;
    
    public AlipayPayment(String account) {
        this.account = account;
    }
    
    @Override
    public boolean pay(double amount) {
        System.out.println("使用支付宝支付 ¥" + amount);
        System.out.println("账户: " + account);
        System.out.println("验证支付宝账户...");
        System.out.println("从支付宝账户扣款...");
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "支付宝";
    }
}

// 微信支付策略
class WeChatPayPayment implements PaymentStrategy {
    private String wechatId;
    
    public WeChatPayPayment(String wechatId) {
        this.wechatId = wechatId;
    }
    
    @Override
    public boolean pay(double amount) {
        System.out.println("使用微信支付 ¥" + amount);
        System.out.println("微信ID: " + wechatId);
        System.out.println("生成微信支付二维码...");
        System.out.println("等待微信支付确认...");
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "微信支付";
    }
}

// 银行转账策略
class BankTransferPayment implements PaymentStrategy {
    private String accountNumber;
    private String bankName;
    
    public BankTransferPayment(String accountNumber, String bankName) {
        this.accountNumber = accountNumber;
        this.bankName = bankName;
    }
    
    @Override
    public boolean pay(double amount) {
        System.out.println("使用银行转账支付 ¥" + amount);
        System.out.println("银行: " + bankName);
        System.out.println("账号: ****-" + accountNumber.substring(accountNumber.length() - 4));
        System.out.println("处理银行转账...");
        System.out.println("转账可能需要1-3个工作日处理完成");
        return true;
    }
    
    @Override
    public String getPaymentMethod() {
        return "银行转账";
    }
}

// 购物车类
class ShoppingCart {
    private List<Item> items;
    private PaymentStrategy paymentStrategy;
    
    public ShoppingCart() {
        this.items = new ArrayList<>();
    }
    
    public void addItem(Item item) {
        items.add(item);
    }
    
    public void removeItem(Item item) {
        items.remove(item);
    }
    
    public double getCartTotal() {
        return items.stream().mapToDouble(Item::getPrice).sum();
    }
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public boolean checkout() {
        if (paymentStrategy == null) {
            System.out.println("请先选择支付方式");
            return false;
        }
        
        double total = getCartTotal();
        System.out.println("购物车商品: ");
        for (Item item : items) {
            System.out.println("  " + item.getName() + " - ¥" + item.getPrice());
        }
        System.out.println("总计: ¥" + total);
        
        return paymentStrategy.pay(total);
    }
}

// 商品类
class Item {
    private String name;
    private double price;
    
    public Item(String name, double price) {
        this.name = name;
        this.price = price;
    }
    
    public String getName() { return name; }
    public double getPrice() { return price; }
}
```

### 数据压缩策略示例

```java
import java.util.zip.*;
import java.io.*;

// 压缩策略接口
interface CompressionStrategy {
    byte[] compress(byte[] data) throws IOException;
    byte[] decompress(byte[] compressedData) throws IOException;
    String getAlgorithmName();
}

// ZIP压缩策略
class ZipCompressionStrategy implements CompressionStrategy {
    @Override
    public byte[] compress(byte[] data) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (ZipOutputStream zipOut = new ZipOutputStream(byteArrayOutputStream)) {
            ZipEntry entry = new ZipEntry("file");
            zipOut.putNextEntry(entry);
            zipOut.write(data);
            zipOut.closeEntry();
        }
        return byteArrayOutputStream.toByteArray();
    }
    
    @Override
    public byte[] decompress(byte[] compressedData) throws IOException {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(compressedData);
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        
        try (ZipInputStream zipIn = new ZipInputStream(byteArrayInputStream)) {
            ZipEntry entry = zipIn.getNextEntry();
            if (entry != null) {
                byte[] buffer = new byte[1024];
                int length;
                while ((length = zipIn.read(buffer)) > 0) {
                    result.write(buffer, 0, length);
                }
            }
        }
        return result.toByteArray();
    }
    
    @Override
    public String getAlgorithmName() {
        return "ZIP";
    }
}

// GZIP压缩策略
class GzipCompressionStrategy implements CompressionStrategy {
    @Override
    public byte[] compress(byte[] data) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (GZIPOutputStream gzipOut = new GZIPOutputStream(byteArrayOutputStream)) {
            gzipOut.write(data);
        }
        return byteArrayOutputStream.toByteArray();
    }
    
    @Override
    public byte[] decompress(byte[] compressedData) throws IOException {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(compressedData);
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        
        try (GZIPInputStream gzipIn = new GZIPInputStream(byteArrayInputStream)) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = gzipIn.read(buffer)) > 0) {
                result.write(buffer, 0, length);
            }
        }
        return result.toByteArray();
    }
    
    @Override
    public String getAlgorithmName() {
        return "GZIP";
    }
}

// 无压缩策略
class NoCompressionStrategy implements CompressionStrategy {
    @Override
    public byte[] compress(byte[] data) throws IOException {
        System.out.println("无压缩：直接返回原数据");
        return data;
    }
    
    @Override
    public byte[] decompress(byte[] compressedData) throws IOException {
        System.out.println("无压缩：直接返回原数据");
        return compressedData;
    }
    
    @Override
    public String getAlgorithmName() {
        return "无压缩";
    }
}

// 文件压缩器
class FileCompressor {
    private CompressionStrategy strategy;
    
    public void setStrategy(CompressionStrategy strategy) {
        this.strategy = strategy;
    }
    
    public byte[] compressFile(String fileName, String content) throws IOException {
        byte[] data = content.getBytes();
        System.out.println("使用 " + strategy.getAlgorithmName() + " 算法压缩文件: " + fileName);
        
        byte[] compressedData = strategy.compress(data);
        System.out.println("原始大小: " + data.length + " bytes");
        System.out.println("压缩后大小: " + compressedData.length + " bytes");
        System.out.println("压缩率: " + String.format("%.2f%%", 
            (1.0 - (double)compressedData.length / data.length) * 100));
        
        return compressedData;
    }
    
    public String decompressFile(byte[] compressedData) throws IOException {
        System.out.println("使用 " + strategy.getAlgorithmName() + " 算法解压文件");
        byte[] decompressedData = strategy.decompress(compressedData);
        return new String(decompressedData);
    }
}
```

### 税务计算策略示例

```java
import java.util.*;

// 税务计算策略接口
interface TaxCalculationStrategy {
    double calculateTax(double income);
    String getTaxType();
}

// 个人所得税策略
class PersonalIncomeTaxStrategy implements TaxCalculationStrategy {
    @Override
    public double calculateTax(double income) {
        // 简化的个人所得税计算（中国2023年标准）
        double taxableIncome = Math.max(0, income - 60000); // 起征点6万
        double tax = 0.0;
        
        if (taxableIncome <= 36000) {
            tax = taxableIncome * 0.03;
        } else if (taxableIncome <= 144000) {
            tax = 1080 + (taxableIncome - 36000) * 0.10;
        } else if (taxableIncome <= 300000) {
            tax = 1080 + 10800 + (taxableIncome - 144000) * 0.20;
        } else if (taxableIncome <= 420000) {
            tax = 1080 + 10800 + 31200 + (taxableIncome - 300000) * 0.25;
        } else if (taxableIncome <= 660000) {
            tax = 1080 + 10800 + 31200 + 30000 + (taxableIncome - 420000) * 0.30;
        } else if (taxableIncome <= 960000) {
            tax = 1080 + 10800 + 31200 + 30000 + 72000 + (taxableIncome - 660000) * 0.35;
        } else {
            tax = 1080 + 10800 + 31200 + 30000 + 72000 + 105000 + (taxableIncome - 960000) * 0.45;
        }
        
        return tax;
    }
    
    @Override
    public String getTaxType() {
        return "个人所得税";
    }
}

// 增值税策略
class ValueAddedTaxStrategy implements TaxCalculationStrategy {
    private double taxRate;
    
    public ValueAddedTaxStrategy(double taxRate) {
        this.taxRate = taxRate; // 通常为0.13(13%)等
    }
    
    @Override
    public double calculateTax(double income) {
        // 增值税 = 销售额 × 税率
        return income * taxRate;
    }
    
    @Override
    public String getTaxType() {
        return "增值税(" + (taxRate * 100) + "%)";
    }
}

// 营业税策略
class BusinessTaxStrategy implements TaxCalculationStrategy {
    private double taxRate;
    
    public BusinessTaxStrategy(double taxRate) {
        this.taxRate = taxRate;
    }
    
    @Override
    public double calculateTax(double income) {
        // 营业税 = 营业额 × 税率
        return income * taxRate;
    }
    
    @Override
    public String getTaxType() {
        return "营业税(" + (taxRate * 100) + "%)";
    }
}

// 税务计算器
class TaxCalculator {
    private TaxCalculationStrategy strategy;
    
    public void setStrategy(TaxCalculationStrategy strategy) {
        this.strategy = strategy;
    }
    
    public double calculateTax(double income) {
        if (strategy != null) {
            double tax = strategy.calculateTax(income);
            System.out.println("收入: ¥" + income);
            System.out.println("税种: " + strategy.getTaxType());
            System.out.println("应缴税额: ¥" + String.format("%.2f", tax));
            System.out.println("税后收入: ¥" + String.format("%.2f", income - tax));
            return tax;
        } else {
            System.out.println("请先设置税务计算策略");
            return 0;
        }
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) throws IOException {
        System.out.println("=== 旅行策略示例 ===");
        
        TravelPlanner planner = new TravelPlanner();
        double distance = 1200; // 北京到上海约1200公里
        
        // 使用飞机策略
        planner.setStrategy(new AirplaneStrategy());
        planner.planTrip("北京", "上海", distance);
        System.out.println();
        
        // 使用高铁策略
        planner.setStrategy(new HighSpeedRailStrategy());
        planner.planTrip("北京", "上海", distance);
        System.out.println();
        
        // 使用自驾策略
        planner.setStrategy(new CarStrategy());
        planner.planTrip("北京", "上海", distance);
        System.out.println();
        
        // 使用公交策略
        planner.setStrategy(new BusStrategy());
        planner.planTrip("北京", "上海", distance);
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 排序策略示例 ===");
        
        List<Integer> numbers = Arrays.asList(64, 34, 25, 12, 22, 11, 90);
        System.out.println("原始列表: " + numbers);
        
        SortContext sortContext = new SortContext();
        
        // 使用快速排序
        sortContext.setStrategy(new QuickSortStrategy());
        sortContext.executeSort(new ArrayList<>(numbers));
        
        // 使用归并排序
        sortContext.setStrategy(new MergeSortStrategy());
        sortContext.executeSort(new ArrayList<>(numbers));
        
        // 使用冒泡排序
        sortContext.setStrategy(new BubbleSortStrategy());
        sortContext.executeSort(new ArrayList<>(numbers));
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 支付策略示例 ===");
        
        ShoppingCart cart = new ShoppingCart();
        cart.addItem(new Item("苹果", 5.50));
        cart.addItem(new Item("香蕉", 3.20));
        cart.addItem(new Item("橙子", 4.80));
        
        // 使用信用卡支付
        cart.setPaymentStrategy(new CreditCardPayment("1234567890123456", "123", "12/25"));
        cart.checkout();
        System.out.println();
        
        // 使用支付宝支付
        cart.setPaymentStrategy(new AlipayPayment("user@example.com"));
        cart.checkout();
        System.out.println();
        
        // 使用微信支付
        cart.setPaymentStrategy(new WeChatPayPayment("wxid_123456"));
        cart.checkout();
        System.out.println();
        
        // 使用银行转账
        cart.setPaymentStrategy(new BankTransferPayment("6222021234567890123", "中国工商银行"));
        cart.checkout();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 文件压缩策略示例 ===");
        
        FileCompressor compressor = new FileCompressor();
        String content = "这是一个用于测试压缩算法的长字符串。" +
                        "The quick brown fox jumps over the lazy dog. ".repeat(50);
        
        // 使用ZIP压缩
        compressor.setStrategy(new ZipCompressionStrategy());
        byte[] zipCompressed = compressor.compressFile("test.txt", content);
        String zipDecompressed = compressor.decompressFile(zipCompressed);
        System.out.println("解压内容长度: " + zipDecompressed.length());
        System.out.println();
        
        // 使用GZIP压缩
        compressor.setStrategy(new GzipCompressionStrategy());
        byte[] gzipCompressed = compressor.compressFile("test.txt", content);
        String gzipDecompressed = compressor.decompressFile(gzipCompressed);
        System.out.println("解压内容长度: " + gzipDecompressed.length());
        System.out.println();
        
        // 使用无压缩
        compressor.setStrategy(new NoCompressionStrategy());
        byte[] noCompressed = compressor.compressFile("test.txt", content);
        String noDecompressed = compressor.decompressFile(noCompressed);
        System.out.println("解压内容长度: " + noDecompressed.length());
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 税务计算策略示例 ===");
        
        TaxCalculator taxCalculator = new TaxCalculator();
        double annualIncome = 200000; // 年收入20万
        
        // 计算个人所得税
        taxCalculator.setStrategy(new PersonalIncomeTaxStrategy());
        taxCalculator.calculateTax(annualIncome);
        System.out.println();
        
        // 计算增值税（假设税率13%）
        taxCalculator.setStrategy(new ValueAddedTaxStrategy(0.13));
        taxCalculator.calculateTax(annualIncome);
        System.out.println();
        
        // 计算营业税（假设税率5%）
        taxCalculator.setStrategy(new BusinessTaxStrategy(0.05));
        taxCalculator.calculateTax(annualIncome);
    }
}
```

## 策略模式的优缺点

### 优点
1. 算法可以自由切换，客户可以根据需要选择不同的算法
2. 避免使用多重条件判断，提高代码的可读性和可维护性
3. 扩展性良好，增加新的算法策略很容易
4. 符合开闭原则，对扩展开放，对修改关闭

### 缺点
1. 策略类数量增多，每个策略都是一个类，复用的可能性很小
2. 所有策略类都需要对外暴露，客户端必须知道有哪些策略可供选择
3. 增加了对象的数量，可能会消耗更多内存

## 策略模式 vs 状态模式

### 策略模式
- 重点在于算法的替换
- 策略之间通常是独立的
- 客户端主动选择策略

### 状态模式
- 重点在于对象状态的转换
- 状态之间有明确的转换关系
- 状态转换通常是自动的

## 总结

策略模式就像程序界的"多面手"——它让你可以轻松地在不同算法之间切换，就像你可以根据具体情况选择不同的出行方式一样。策略模式将算法的实现和使用分离，使得算法可以独立变化。

记住：**策略模式适用于需要在运行时选择不同算法的场景，特别是当有大量条件语句用于选择算法时！**

在实际开发中，策略模式被广泛应用于：
- 排序算法的选择
- 支付方式的选择
- 数据压缩算法
- 验证算法
- 缓存策略等