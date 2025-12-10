# 责任链模式 (Chain of Responsibility Pattern) - 程序界的“流水线工人”

## 什么是责任链模式？

想象一下工厂的流水线作业，一个产品从第一个工人开始，如果这个工人能处理就处理，如果不能处理就传给下一个工人，依次类推，直到有工人能够处理这个产品。如果没有工人能处理，产品就无法完成。

责任链模式就是这样——它让多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递请求，直到有一个对象处理它。

**责任链模式**使多个对象都有机会处理请求，从而解耦发送者和接收者。这些对象被连接成一条链，沿着这条链传递请求，直到有一个对象处理它。

## 为什么需要责任链模式？

在以下场景中，责任链模式特别有用：

1. 有多个对象可以处理一个请求，具体哪个对象处理在运行时确定
2. 需要在不明确指定接收者的情况下，向多个对象中的一个提交请求
3. 需要动态指定一组对象处理请求

## 责任链模式的实现

### 基础责任链结构

```java
// 请求类
class Request {
    private String type;
    private double amount;
    private String description;
    
    public Request(String type, double amount, String description) {
        this.type = type;
        this.amount = amount;
        this.description = description;
    }
    
    // Getter方法
    public String getType() { return type; }
    public double getAmount() { return amount; }
    public String getDescription() { return description; }
    
    @Override
    public String toString() {
        return "Request{" +
                "type='" + type + '\'' +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                '}';
    }
}

// 处理器接口
interface Handler {
    void setNext(Handler handler);
    String handle(Request request);
}

// 抽象处理器
abstract class AbstractHandler implements Handler {
    private Handler nextHandler;
    
    @Override
    public void setNext(Handler handler) {
        this.nextHandler = handler;
    }
    
    @Override
    public String handle(Request request) {
        if (nextHandler != null) {
            return nextHandler.handle(request);
        } else {
            return "无法处理请求: " + request;
        }
    }
}
```

### 具体处理器实现

```java
// 经理处理器
class ManagerHandler extends AbstractHandler {
    private double maxApproveLimit;
    
    public ManagerHandler(double maxApproveLimit) {
        this.maxApproveLimit = maxApproveLimit;
    }
    
    @Override
    public String handle(Request request) {
        if (request.getAmount() <= maxApproveLimit) {
            return "经理批准了请求: " + request + " (金额: ¥" + request.getAmount() + ")";
        } else {
            return super.handle(request); // 传递给下一个处理器
        }
    }
}

// 总监处理器
class DirectorHandler extends AbstractHandler {
    private double maxApproveLimit;
    
    public DirectorHandler(double maxApproveLimit) {
        this.maxApproveLimit = maxApproveLimit;
    }
    
    @Override
    public String handle(Request request) {
        if (request.getAmount() <= maxApproveLimit) {
            return "总监批准了请求: " + request + " (金额: ¥" + request.getAmount() + ")";
        } else {
            return super.handle(request); // 传递给下一个处理器
        }
    }
}

// 总裁处理器
class PresidentHandler extends AbstractHandler {
    private double maxApproveLimit;
    
    public PresidentHandler(double maxApproveLimit) {
        this.maxApproveLimit = maxApproveLimit;
    }
    
    @Override
    public String handle(Request request) {
        if (request.getAmount() <= maxApproveLimit) {
            return "总裁批准了请求: " + request + " (金额: ¥" + request.getAmount() + ")";
        } else {
            return "请求被拒绝，超出总裁审批权限: " + request + " (金额: ¥" + request.getAmount() + ")";
        }
    }
}
```

## 实际应用场景

### 日志处理器示例

```java
// 日志级别枚举
enum LogLevel {
    INFO(1), WARNING(2), ERROR(3), DEBUG(4);
    
    private int level;
    
    LogLevel(int level) {
        this.level = level;
    }
    
    public int getLevel() {
        return level;
    }
}

// 日志消息
class LogMessage {
    private LogLevel level;
    private String message;
    private long timestamp;
    
    public LogMessage(LogLevel level, String message) {
        this.level = level;
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }
    
    public LogLevel getLevel() { return level; }
    public String getMessage() { return message; }
    public long getTimestamp() { return timestamp; }
    
    @Override
    public String toString() {
        return "[" + level + "] " + message + " (Time: " + timestamp + ")";
    }
}

// 日志处理器接口
interface LogHandler {
    void setNext(LogHandler nextHandler);
    void handle(LogMessage message);
}

// 抽象日志处理器
abstract class AbstractLogHandler implements LogHandler {
    protected LogHandler nextHandler;
    protected LogLevel level;
    
    public AbstractLogHandler(LogLevel level) {
        this.level = level;
    }
    
    @Override
    public void setNext(LogHandler nextHandler) {
        this.nextHandler = nextHandler;
    }
    
    @Override
    public void handle(LogMessage message) {
        if (message.getLevel().getLevel() >= this.level.getLevel()) {
            write(message);
        }
        
        if (nextHandler != null) {
            nextHandler.handle(message);
        }
    }
    
    protected abstract void write(LogMessage message);
}

// 控制台日志处理器
class ConsoleLogHandler extends AbstractLogHandler {
    public ConsoleLogHandler(LogLevel level) {
        super(level);
    }
    
    @Override
    protected void write(LogMessage message) {
        System.out.println("控制台日志: " + message);
    }
}

// 文件日志处理器
class FileLogHandler extends AbstractLogHandler {
    public FileLogHandler(LogLevel level) {
        super(level);
    }
    
    @Override
    protected void write(LogMessage message) {
        System.out.println("文件日志: " + message);
        // 实际开发中这里会写入文件
    }
}

// 邮件日志处理器
class EmailLogHandler extends AbstractLogHandler {
    public EmailLogHandler(LogLevel level) {
        super(level);
    }
    
    @Override
    protected void write(LogMessage message) {
        System.out.println("邮件通知: " + message);
        // 实际开发中这里会发送邮件
    }
}
```

### HTTP请求过滤器示例

```java
// HTTP请求
class HttpRequest {
    private String url;
    private String method;
    private String[] headers;
    private String body;
    private boolean authenticated = false;
    private boolean authorized = false;
    
    public HttpRequest(String url, String method, String body) {
        this.url = url;
        this.method = method;
        this.body = body;
    }
    
    // Getter和Setter方法
    public String getUrl() { return url; }
    public String getMethod() { return method; }
    public String getBody() { return body; }
    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }
    public boolean isAuthorized() { return authorized; }
    public void setAuthorized(boolean authorized) { this.authorized = authorized; }
}

// HTTP响应
class HttpResponse {
    private int statusCode;
    private String body;
    private String[] headers;
    
    public HttpResponse(int statusCode, String body) {
        this.statusCode = statusCode;
        this.body = body;
    }
    
    public int getStatusCode() { return statusCode; }
    public String getBody() { return body; }
    
    @Override
    public String toString() {
        return "HTTP " + statusCode + ": " + body;
    }
}

// 过滤器接口
interface Filter {
    void setNext(Filter nextFilter);
    HttpResponse doFilter(HttpRequest request, FilterChain chain);
}

// 过滤器链
class FilterChain {
    private Filter currentFilter;
    private int currentFilterIndex = 0;
    
    public FilterChain(Filter firstFilter) {
        this.currentFilter = firstFilter;
    }
    
    public HttpResponse doFilter(HttpRequest request) {
        return currentFilter.doFilter(request, this);
    }
}

// 抽象过滤器
abstract class AbstractFilter implements Filter {
    protected Filter nextFilter;
    
    @Override
    public void setNext(Filter nextFilter) {
        this.nextFilter = nextFilter;
    }
    
    @Override
    public HttpResponse doFilter(HttpRequest request, FilterChain chain) {
        if (nextFilter != null) {
            return nextFilter.doFilter(request, chain);
        } else {
            // 默认响应
            return new HttpResponse(404, "请求未被任何过滤器处理");
        }
    }
}

// 认证过滤器
class AuthenticationFilter extends AbstractFilter {
    @Override
    public HttpResponse doFilter(HttpRequest request, FilterChain chain) {
        System.out.println("执行认证过滤器...");
        
        // 模拟认证逻辑
        String authHeader = "Bearer token123"; // 假设从请求头获取
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            request.setAuthenticated(true);
            System.out.println("认证成功");
        } else {
            return new HttpResponse(401, "未认证");
        }
        
        return super.doFilter(request, chain);
    }
}

// 授权过滤器
class AuthorizationFilter extends AbstractFilter {
    @Override
    public HttpResponse doFilter(HttpRequest request, FilterChain chain) {
        System.out.println("执行授权过滤器...");
        
        if (!request.isAuthenticated()) {
            return new HttpResponse(401, "需要先认证");
        }
        
        // 模拟授权逻辑
        if (request.getUrl().contains("/admin")) {
            // 只有特定用户才能访问管理员接口
            return new HttpResponse(403, "权限不足");
        } else {
            request.setAuthorized(true);
            System.out.println("授权成功");
        }
        
        return super.doFilter(request, chain);
    }
}

// 请求日志过滤器
class RequestLoggingFilter extends AbstractFilter {
    @Override
    public HttpResponse doFilter(HttpRequest request, FilterChain chain) {
        System.out.println("记录请求日志: " + request.getMethod() + " " + request.getUrl());
        
        long startTime = System.currentTimeMillis();
        HttpResponse response = super.doFilter(request, chain);
        long endTime = System.currentTimeMillis();
        
        System.out.println("请求处理完成，耗时: " + (endTime - startTime) + "ms");
        return response;
    }
}
```

### 客户服务处理系统示例

```java
// 客户服务请求类型
enum ServiceRequestType {
    BASIC_INFO, TECHNICAL_SUPPORT, BILLING_ISSUE, COMPLAINT
}

// 客户服务请求
class ServiceRequest {
    private ServiceRequestType type;
    private String description;
    private int priority; // 1-5, 5为最高优先级
    private String customerId;
    private boolean resolved = false;
    
    public ServiceRequest(ServiceRequestType type, String description, int priority, String customerId) {
        this.type = type;
        this.description = description;
        this.priority = priority;
        this.customerId = customerId;
    }
    
    public ServiceRequestType getType() { return type; }
    public String getDescription() { return description; }
    public int getPriority() { return priority; }
    public String getCustomerId() { return customerId; }
    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
    
    @Override
    public String toString() {
        return "ServiceRequest{" +
                "type=" + type +
                ", description='" + description + '\'' +
                ", priority=" + priority +
                ", customerId='" + customerId + '\'' +
                ", resolved=" + resolved +
                '}';
    }
}

// 客户服务处理器接口
interface ServiceHandler {
    void setNext(ServiceHandler nextHandler);
    String handle(ServiceRequest request);
    boolean canHandle(ServiceRequest request);
}

// 抽象客户服务处理器
abstract class AbstractServiceHandler implements ServiceHandler {
    protected ServiceHandler nextHandler;
    
    @Override
    public void setNext(ServiceHandler nextHandler) {
        this.nextHandler = nextHandler;
    }
    
    @Override
    public String handle(ServiceRequest request) {
        if (canHandle(request)) {
            return processRequest(request);
        } else if (nextHandler != null) {
            return nextHandler.handle(request);
        } else {
            return "无法处理请求: " + request.getDescription();
        }
    }
    
    protected abstract String processRequest(ServiceRequest request);
    protected abstract boolean canHandle(ServiceRequest request);
}

// 自动回复处理器
class AutoReplyHandler extends AbstractServiceHandler {
    @Override
    protected String processRequest(ServiceRequest request) {
        request.setResolved(true);
        return "自动回复: 感谢您的咨询，我们已收到您的请求，类型: " + request.getType();
    }
    
    @Override
    protected boolean canHandle(ServiceRequest request) {
        return request.getType() == ServiceRequestType.BASIC_INFO && request.getPriority() <= 2;
    }
}

// 一级客服处理器
class LevelOneSupportHandler extends AbstractServiceHandler {
    @Override
    protected String processRequest(ServiceRequest request) {
        request.setResolved(true);
        return "一级客服处理: " + request.getDescription() + " - 问题已解决";
    }
    
    @Override
    protected boolean canHandle(ServiceRequest request) {
        return request.getPriority() <= 3 && 
               (request.getType() == ServiceRequestType.BASIC_INFO || 
                request.getType() == ServiceRequestType.TECHNICAL_SUPPORT);
    }
}

// 二级客服处理器
class LevelTwoSupportHandler extends AbstractServiceHandler {
    @Override
    protected String processRequest(ServiceRequest request) {
        request.setResolved(true);
        return "二级客服处理: " + request.getDescription() + " - 技术问题已解决";
    }
    
    @Override
    protected boolean canHandle(ServiceRequest request) {
        return request.getPriority() <= 4 && 
               request.getType() == ServiceRequestType.TECHNICAL_SUPPORT;
    }
}

// 高级客服处理器
class SeniorSupportHandler extends AbstractServiceHandler {
    @Override
    protected String processRequest(ServiceRequest request) {
        request.setResolved(true);
        return "高级客服处理: " + request.getDescription() + " - 复杂问题已解决";
    }
    
    @Override
    protected boolean canHandle(ServiceRequest request) {
        return request.getType() == ServiceRequestType.COMPLAINT || 
               request.getType() == ServiceRequestType.BILLING_ISSUE || 
               request.getPriority() == 5;
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 审批流程示例 ===");
        
        // 创建处理器链
        Handler manager = new ManagerHandler(1000);      // 经理：1000元以下
        Handler director = new DirectorHandler(5000);    // 总监：5000元以下
        Handler president = new PresidentHandler(10000); // 总裁：10000元以下
        
        // 设置责任链
        manager.setNext(director);
        director.setNext(president);
        
        // 测试不同金额的请求
        Request request1 = new Request("采购", 500, "购买办公用品");
        Request request2 = new Request("差旅", 2000, "出差费用");
        Request request3 = new Request("设备", 8000, "购买服务器");
        Request request4 = new Request("合作", 15000, "合作伙伴项目");
        
        System.out.println(manager.handle(request1));
        System.out.println(manager.handle(request2));
        System.out.println(manager.handle(request3));
        System.out.println(manager.handle(request4));
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 日志处理示例 ===");
        
        // 创建日志处理器链
        LogHandler consoleHandler = new ConsoleLogHandler(LogLevel.INFO);
        LogHandler fileHandler = new FileLogHandler(LogLevel.WARNING);
        LogHandler emailHandler = new EmailLogHandler(LogLevel.ERROR);
        
        consoleHandler.setNext(fileHandler);
        fileHandler.setNext(emailHandler);
        
        // 测试不同级别的日志
        consoleHandler.handle(new LogMessage(LogLevel.INFO, "应用启动"));
        System.out.println();
        consoleHandler.handle(new LogMessage(LogLevel.WARNING, "内存使用较高"));
        System.out.println();
        consoleHandler.handle(new LogMessage(LogLevel.ERROR, "数据库连接失败"));
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== HTTP请求过滤示例 ===");
        
        // 创建过滤器链
        Filter authFilter = new AuthenticationFilter();
        Filter authzFilter = new AuthorizationFilter();
        Filter logFilter = new RequestLoggingFilter();
        
        authFilter.setNext(authzFilter);
        authzFilter.setNext(logFilter);
        
        FilterChain chain = new FilterChain(authFilter);
        
        // 测试请求
        HttpRequest request = new HttpRequest("/api/user", "GET", "{}");
        HttpResponse response = chain.doFilter(request);
        System.out.println("最终响应: " + response);
        
        System.out.println();
        
        // 测试管理员请求
        HttpRequest adminRequest = new HttpRequest("/api/admin/users", "GET", "{}");
        HttpResponse adminResponse = chain.doFilter(adminRequest);
        System.out.println("管理员请求响应: " + adminResponse);
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 客户服务处理示例 ===");
        
        // 创建客户服务处理器链
        ServiceHandler autoReply = new AutoReplyHandler();
        ServiceHandler levelOne = new LevelOneSupportHandler();
        ServiceHandler levelTwo = new LevelTwoSupportHandler();
        ServiceHandler senior = new SeniorSupportHandler();
        
        autoReply.setNext(levelOne);
        levelOne.setNext(levelTwo);
        levelTwo.setNext(senior);
        
        // 测试不同类型的服务请求
        ServiceRequest basicInfo = new ServiceRequest(
            ServiceRequestType.BASIC_INFO, "如何重置密码？", 1, "CUST001");
        ServiceRequest techIssue = new ServiceRequest(
            ServiceRequestType.TECHNICAL_SUPPORT, "登录失败", 3, "CUST002");
        ServiceRequest billingIssue = new ServiceRequest(
            ServiceRequestType.BILLING_ISSUE, "账单错误", 4, "CUST003");
        ServiceRequest complaint = new ServiceRequest(
            ServiceRequestType.COMPLAINT, "服务不满意", 5, "CUST004");
        
        System.out.println(autoReply.handle(basicInfo));
        System.out.println(autoReply.handle(techIssue));
        System.out.println(autoReply.handle(billingIssue));
        System.out.println(autoReply.handle(complaint));
    }
}
```

## 责任链模式的优缺点

### 优点
1. 降低耦合度：请求发送者不需要知道具体处理者是谁
2. 增强给对象指派职责的灵活性：可以动态地改变处理链
3. 增加新的请求处理类很方便
4. 责任链可以灵活组合，可以改变处理的顺序

### 缺点
1. 不能保证请求一定被处理：可能没有合适的处理者
2. 系统性能将受到一定影响，且在进行代码调试时不太方便
3. 可能会导致处理过程过长，影响系统性能

## 责任链模式 vs 策略模式 vs 状态模式

### 责任链模式
- 目的是让多个对象都有机会处理请求
- 关注的是请求的传递和处理
- 请求沿着链传递直到被处理

### 策略模式
- 目的是定义一系列算法，使其可以互换
- 关注的是算法的选择

### 状态模式
- 目的是让对象在内部状态改变时改变行为
- 关注的是对象状态的改变

## 总结

责任链模式就像程序界的“流水线工人”——它创建了一条处理请求的链条，请求在链上传递，直到有合适的处理者来处理它。就像工厂流水线一样，每个工人都只处理自己能处理的部分，处理不了就传给下一个工人。

记住：**责任链模式适用于需要多个对象协作处理请求的场景，就像你需要把任务在团队成员之间传递一样！**

在实际开发中，责任链模式广泛应用于：
- Web框架的过滤器链（如Servlet Filter）
- Spring Security的认证授权链
- 日志处理系统
- 事件处理系统
- 工作流引擎等