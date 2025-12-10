# 模板方法模式 (Template Method Pattern) - 程序界的“标准化流程”

## 什么是模板方法模式？

想象一下制作咖啡和茶的过程：首先都需要烧水，然后准备杯子，接着放入相应的原料（咖啡粉或茶叶），最后倒入热水。整个流程是相似的，只是具体步骤有所不同。模板方法模式就是这样——它在一个方法中定义算法的骨架，而将一些步骤延迟到子类中实现。

**模板方法模式**定义一个操作中的算法骨架，而将一些步骤延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下，重新定义算法的某些特定步骤。

## 为什么需要模板方法模式？

在以下场景中，模板方法模式特别有用：

1. 当一次性实现一个算法的不变部分，并将可变的行为留给子类来实现
2. 当子类中的公共行为应该被提取出来并集中到一个公共父类中以避免代码重复
3. 当控制子类的扩展，子类必须遵守算法框架

## 模板方法模式的实现

### 饮品制作示例

```java
// 抽象类 - 饮品制作
abstract class CaffeineBeverage {
    // 模板方法 - 定义制作流程的骨架
    public final void prepareRecipe() {
        System.out.println("--- 开始制作饮品 ---");
        boilWater();           // 准备热水
        brew();               // 冲泡
        pourInCup();          // 倒入杯中
        addCondiments();      // 添加调料
        System.out.println("--- 饮品制作完成 ---");
    }
    
    // 具体方法 - 所有饮品都需要烧水
    protected void boilWater() {
        System.out.println("烧开水");
    }
    
    // 具体方法 - 所有饮品都需要倒入杯中
    protected void pourInCup() {
        System.out.println("将饮品倒入杯中");
    }
    
    // 抽象方法 - 不同饮品有不同的冲泡方式
    protected abstract void brew();
    
    // 抽象方法 - 不同饮品添加不同的调料
    protected abstract void addCondiments();
}

// 具体子类 - 咖啡
class Coffee extends CaffeineBeverage {
    @Override
    protected void brew() {
        System.out.println("用沸水冲泡咖啡");
    }
    
    @Override
    protected void addCondiments() {
        System.out.println("添加牛奶和糖");
    }
}

// 具体子类 - 茶
class Tea extends CaffeineBeverage {
    @Override
    protected void brew() {
        System.out.println("用沸水浸泡茶叶");
    }
    
    @Override
    protected void addCondiments() {
        System.out.println("添加柠檬");
    }
}
```

### 算法框架示例

```java
// 抽象算法类
abstract class Algorithm {
    // 模板方法 - 定义算法执行的骨架
    public final void execute() {
        System.out.println("开始执行算法");
        preProcess();      // 预处理
        process();         // 主要处理
        postProcess();     // 后处理
        System.out.println("算法执行完成");
    }
    
    // 预处理步骤
    protected void preProcess() {
        System.out.println("执行预处理");
        validateInput();   // 验证输入
    }
    
    // 后处理步骤
    protected void postProcess() {
        System.out.println("执行后处理");
        cleanup();         // 清理资源
    }
    
    // 抽象方法 - 子类必须实现主要处理逻辑
    protected abstract void process();
    
    // 钩子方法 - 子类可以选择性地重写
    protected void validateInput() {
        System.out.println("验证输入数据");
    }
    
    // 钩子方法 - 子类可以选择性地重写
    protected void cleanup() {
        System.out.println("清理资源");
    }
}

// 具体算法实现 - 数据分析算法
class DataAnalysisAlgorithm extends Algorithm {
    @Override
    protected void process() {
        System.out.println("执行数据分析");
        System.out.println("计算统计指标");
        System.out.println("生成分析报告");
    }
}

// 具体算法实现 - 图像处理算法
class ImageProcessingAlgorithm extends Algorithm {
    @Override
    protected void process() {
        System.out.println("执行图像处理");
        System.out.println("应用滤镜效果");
        System.out.println("调整图像参数");
    }
    
    @Override
    protected void validateInput() {
        System.out.println("验证图像格式和尺寸");
    }
    
    @Override
    protected void cleanup() {
        System.out.println("释放图像缓存");
    }
}
```

## 实际应用场景

### 数据库操作模板示例

```java
import java.sql.*;

// 抽象数据库操作类
abstract class DatabaseOperation<T> {
    protected String url;
    protected String username;
    protected String password;
    
    public DatabaseOperation(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
    }
    
    // 模板方法 - 定义数据库操作的骨架
    public final T execute() throws SQLException {
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        
        try {
            // 1. 建立连接
            connection = getConnection();
            
            // 2. 创建语句
            statement = createStatement(connection);
            
            // 3. 执行操作
            if (isQuery()) {
                resultSet = statement.executeQuery();
                // 4. 处理结果
                return processResults(resultSet);
            } else {
                int affectedRows = statement.executeUpdate();
                return processUpdateResult(affectedRows);
            }
        } finally {
            // 5. 关闭资源
            closeResources(connection, statement, resultSet);
        }
    }
    
    // 具体方法 - 获取数据库连接
    private Connection getConnection() throws SQLException {
        System.out.println("连接到数据库: " + url);
        return DriverManager.getConnection(url, username, password);
    }
    
    // 具体方法 - 关闭资源
    private void closeResources(Connection connection, PreparedStatement statement, ResultSet resultSet) {
        System.out.println("关闭数据库资源");
        try {
            if (resultSet != null) resultSet.close();
            if (statement != null) statement.close();
            if (connection != null) connection.close();
        } catch (SQLException e) {
            System.err.println("关闭资源时出错: " + e.getMessage());
        }
    }
    
    // 抽象方法 - 由子类定义具体的SQL语句和参数
    protected abstract PreparedStatement createStatement(Connection connection) throws SQLException;
    
    // 抽象方法 - 由子类定义如何处理查询结果
    protected abstract T processResults(ResultSet resultSet) throws SQLException;
    
    // 抽象方法 - 由子类定义如何处理更新结果
    protected abstract T processUpdateResult(int affectedRows) throws SQLException;
    
    // 钩子方法 - 判断是否为查询操作
    protected boolean isQuery() {
        return true;
    }
}

// 具体实现 - 查询操作
class QueryOperation extends DatabaseOperation<java.util.List<String>> {
    private String sql;
    
    public QueryOperation(String url, String username, String password, String sql) {
        super(url, username, password);
        this.sql = sql;
    }
    
    @Override
    protected PreparedStatement createStatement(Connection connection) throws SQLException {
        System.out.println("创建查询语句: " + sql);
        return connection.prepareStatement(sql);
    }
    
    @Override
    protected java.util.List<String> processResults(ResultSet resultSet) throws SQLException {
        System.out.println("处理查询结果");
        java.util.List<String> results = new java.util.ArrayList<>();
        while (resultSet.next()) {
            results.add(resultSet.getString(1)); // 简化处理，只取第一列
        }
        System.out.println("查询到 " + results.size() + " 条记录");
        return results;
    }
    
    @Override
    protected java.util.List<String> processUpdateResult(int affectedRows) throws SQLException {
        return null; // 查询操作不使用此方法
    }
    
    @Override
    protected boolean isQuery() {
        return true;
    }
}

// 具体实现 - 更新操作
class UpdateOperation extends DatabaseOperation<Integer> {
    private String sql;
    private Object[] params;
    
    public UpdateOperation(String url, String username, String password, String sql, Object... params) {
        super(url, username, password);
        this.sql = sql;
        this.params = params;
    }
    
    @Override
    protected PreparedStatement createStatement(Connection connection) throws SQLException {
        System.out.println("创建更新语句: " + sql);
        PreparedStatement stmt = connection.prepareStatement(sql);
        // 设置参数（简化实现）
        for (int i = 0; i < params.length; i++) {
            stmt.setObject(i + 1, params[i]);
        }
        return stmt;
    }
    
    @Override
    protected Integer processResults(ResultSet resultSet) throws SQLException {
        return 0; // 更新操作不使用此方法
    }
    
    @Override
    protected Integer processUpdateResult(int affectedRows) throws SQLException {
        System.out.println("更新操作影响 " + affectedRows + " 行");
        return affectedRows;
    }
    
    @Override
    protected boolean isQuery() {
        return false;
    }
}
```

### 游戏开发框架示例

```java
import java.util.*;

// 抽象游戏类
abstract class Game {
    // 模板方法 - 定义游戏的通用流程
    public final void playGame() {
        System.out.println("游戏开始！");
        initializeGame();   // 初始化游戏
        startPlay();        // 开始游戏
        endPlay();          // 结束游戏
        System.out.println("游戏结束！");
    }
    
    // 具体方法 - 所有游戏都需要的通用初始化
    protected void initializeGame() {
        System.out.println("初始化游戏引擎");
        System.out.println("加载游戏资源");
    }
    
    // 具体方法 - 所有游戏都需要的通用结束操作
    protected void endPlay() {
        System.out.println("保存游戏进度");
        System.out.println("清理游戏资源");
    }
    
    // 抽象方法 - 不同游戏有不同的玩法
    protected abstract void startPlay();
    
    // 钩子方法 - 子类可以重写以改变默认行为
    protected boolean isGameOver() {
        return false;
    }
    
    // 钩子方法 - 子类可以重写以改变默认行为
    protected void updateGame() {
        // 默认实现，子类可以重写
    }
}

// 具体游戏实现 - 象棋
class Chess extends Game {
    private int moveCount = 0;
    private static final int MAX_MOVES = 100; // 最大步数
    
    @Override
    protected void startPlay() {
        System.out.println("设置象棋棋盘");
        System.out.println("放置棋子");
        
        while (!isGameOver()) {
            makeAMove();
            moveCount++;
            updateGame();
        }
    }
    
    private void makeAMove() {
        System.out.println("玩家走棋，当前步数: " + (moveCount + 1));
        // 模拟走棋逻辑
    }
    
    @Override
    protected boolean isGameOver() {
        return moveCount >= MAX_MOVES;
    }
    
    @Override
    protected void updateGame() {
        System.out.println("更新棋盘显示");
        System.out.println("检查游戏状态");
    }
}

// 具体游戏实现 - 跳棋
class Checkers extends Game {
    private int playerCount = 0;
    private static final int MAX_PLAYERS = 2;
    
    @Override
    protected void startPlay() {
        System.out.println("设置跳棋棋盘");
        System.out.println("放置跳棋棋子");
        
        while (!isGameOver()) {
            takeTurn();
            playerCount = (playerCount + 1) % MAX_PLAYERS;
            updateGame();
        }
    }
    
    private void takeTurn() {
        System.out.println("玩家 " + (playerCount + 1) + " 进行回合");
        // 模拟回合逻辑
    }
    
    @Override
    protected boolean isGameOver() {
        return playerCount > 20; // 模拟游戏结束条件
    }
    
    @Override
    protected void updateGame() {
        System.out.println("更新跳棋棋盘状态");
    }
}
```

### 框架组件示例

```java
// 抽象服务类
abstract class ServiceTemplate {
    // 模板方法 - 定义服务执行流程
    public final void executeService() {
        System.out.println("开始执行服务: " + this.getClass().getSimpleName());
        
        try {
            validateRequest();    // 验证请求
            authorizeRequest();   // 授权检查
            prepareData();        // 准备数据
            processRequest();     // 处理请求
            generateResponse();   // 生成响应
        } catch (Exception e) {
            handleError(e);       // 错误处理
        } finally {
            cleanup();           // 清理资源
        }
        
        System.out.println("服务执行完成");
    }
    
    // 具体方法 - 验证请求
    protected void validateRequest() {
        System.out.println("验证请求参数");
    }
    
    // 具体方法 - 授权检查
    protected void authorizeRequest() {
        System.out.println("检查用户权限");
    }
    
    // 具体方法 - 准备数据
    protected void prepareData() {
        System.out.println("准备服务数据");
    }
    
    // 具体方法 - 生成响应
    protected void generateResponse() {
        System.out.println("生成服务响应");
    }
    
    // 具体方法 - 清理资源
    protected void cleanup() {
        System.out.println("清理服务资源");
    }
    
    // 具体方法 - 错误处理
    protected void handleError(Exception e) {
        System.err.println("服务执行出错: " + e.getMessage());
    }
    
    // 抽象方法 - 子类必须实现具体的请求处理逻辑
    protected abstract void processRequest();
}

// 具体服务实现 - 用户服务
class UserService extends ServiceTemplate {
    @Override
    protected void processRequest() {
        System.out.println("处理用户相关请求");
        System.out.println("查询用户信息");
        System.out.println("更新用户数据");
    }
}

// 具体服务实现 - 订单服务
class OrderService extends ServiceTemplate {
    @Override
    protected void processRequest() {
        System.out.println("处理订单相关请求");
        System.out.println("创建订单");
        System.out.println("计算订单金额");
    }
    
    @Override
    protected void authorizeRequest() {
        System.out.println("订单服务特殊授权检查");
        // 订单相关的特殊授权逻辑
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) throws SQLException {
        System.out.println("=== 饮品制作示例 ===");
        
        CaffeineBeverage coffee = new Coffee();
        System.out.println("制作咖啡:");
        coffee.prepareRecipe();
        System.out.println();
        
        CaffeineBeverage tea = new Tea();
        System.out.println("制作茶:");
        tea.prepareRecipe();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 算法框架示例 ===");
        
        Algorithm dataAnalysis = new DataAnalysisAlgorithm();
        System.out.println("执行数据分析算法:");
        dataAnalysis.execute();
        System.out.println();
        
        Algorithm imageProcessing = new ImageProcessingAlgorithm();
        System.out.println("执行图像处理算法:");
        imageProcessing.execute();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 游戏框架示例 ===");
        
        Game chess = new Chess();
        System.out.println("开始象棋游戏:");
        chess.playGame();
        System.out.println();
        
        Game checkers = new Checkers();
        System.out.println("开始跳棋游戏:");
        checkers.playGame();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 服务框架示例 ===");
        
        ServiceTemplate userService = new UserService();
        System.out.println("执行用户服务:");
        userService.executeService();
        System.out.println();
        
        ServiceTemplate orderService = new OrderService();
        System.out.println("执行订单服务:");
        orderService.executeService();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 数据库操作示例 ===");
        
        // 注意：这里只是演示模板方法模式，实际需要数据库连接
        // 在真实环境中，你需要有相应的数据库设置
        try {
            String dbUrl = "jdbc:h2:mem:testdb"; // 使用内存数据库做演示
            String user = "sa";
            String password = "";
            
            // QueryOperation queryOp = new QueryOperation(dbUrl, user, password, "SELECT * FROM users");
            // List<String> results = queryOp.execute();
            
            // UpdateOperation updateOp = new UpdateOperation(dbUrl, user, password, "INSERT INTO users (name) VALUES (?)", "张三");
            // Integer affected = updateOp.execute();
            
            System.out.println("数据库操作模板演示");
            System.out.println("（实际数据库连接需要相应的驱动和配置）");
            
        } catch (Exception e) {
            System.out.println("数据库操作演示需要相应的环境配置");
        }
    }
}
```

## 模板方法模式的优缺点

### 优点
1. 封装了不变的部分，扩展可变的部分
2. 在抽象父类中提取了公共方法的行为，便于代码复用
3. 通过子类来扩展基类的行为，符合开闭原则
4. 行为由父类控制，子类实现

### 缺点
1. 每个不同的实现都需要一个子类，会导致类的数量增加
2. 父类中的抽象方法由子类实现，子类的执行结果会影响父类的结果，这称为"反向控制"，提高了耦合度

## 钩子方法 (Hook Methods)

钩子方法是模板方法模式中的一个重要概念，它是在抽象类中定义的空方法或默认实现的方法，子类可以选择性地重写这些方法来影响算法的行为。

```java
// 钩子方法示例
abstract class HookTemplate {
    // 模板方法
    public final void templateMethod() {
        step1();
        if (hook1()) {  // 钩子方法，决定是否执行某个步骤
            step2();
        }
        step3();
    }
    
    protected abstract void step1();
    protected abstract void step2();
    protected abstract void step3();
    
    // 钩子方法，子类可以重写来改变行为
    protected boolean hook1() {
        return true;  // 默认返回true，子类可以重写
    }
}
```

## 模板方法模式 vs 策略模式

### 模板方法模式
- 通过继承实现，定义算法骨架
- 算法结构固定，某些步骤可变
- 适用于算法步骤固定但具体实现不同的场景

### 策略模式
- 通过组合实现，封装算法
- 算法完全可替换
- 适用于需要在运行时选择不同算法的场景

## 总结

模板方法模式就像程序界的"标准化流程"——它定义了算法的骨架，让子类在不改变算法结构的情况下重新定义某些特定步骤。就像不同餐厅制作菜式的标准流程一样，步骤是固定的，但具体实现可以不同。

记住：**模板方法模式适用于算法结构固定，但某些步骤需要根据不同情况进行定制的场景！**

在实际开发中，模板方法模式被广泛应用于：
- 框架设计（如Spring的JdbcTemplate、HibernateTemplate等）
- 游戏开发框架
- Web框架中的请求处理
- 构建工具的执行流程等