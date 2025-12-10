# 建造者模式 (Builder Pattern) - 程序界的“乐高积木大师”

## 什么是建造者模式？

想象一下你正在玩乐高积木，你可以一步一步地按照说明书搭建，每一步都添加一个组件，最终完成一个完整的模型。建造者模式就是这样——它将一个复杂对象的构建与其表示分离，使得同样的构建过程可以创建不同的表示。

建造者模式允许你分步骤创建复杂对象，用户可以精确控制对象的创建过程。

## 为什么需要建造者模式？

当我们需要创建复杂对象，特别是：
- 对象需要多个步骤创建
- 对象的组成部分可能不同
- 创建过程需要根据条件改变
- 不想让使用者知道具体的创建细节

比如：
- 构建复杂的SQL查询语句
- 创建复杂的消息对象
- 组装配置文件
- 构建复杂的UI界面

## 建造者模式的实现

### 产品类定义

```java
// 产品类 - 汉堡套餐
public class BurgerMeal {
    private String burger;      // 汉堡
    private String drink;       // 饮料
    private String side;        // 小食
    private String toy;         // 玩具（儿童套餐）
    private String sauce;       // 酱料包
    
    // 用于构建器的私有构造函数
    private BurgerMeal(Builder builder) {
        this.burger = builder.burger;
        this.drink = builder.drink;
        this.side = builder.side;
        this.toy = builder.toy;
        this.sauce = builder.sauce;
    }
    
    // Getter方法
    public String getBurger() { return burger; }
    public String getDrink() { return drink; }
    public String getSide() { return side; }
    public String getToy() { return toy; }
    public String getSauce() { return sauce; }
    
    @Override
    public String toString() {
        return "套餐信息:\n" +
               "汉堡: " + burger + "\n" +
               "饮料: " + drink + "\n" +
               "小食: " + side + "\n" +
               "玩具: " + (toy != null ? toy : "无") + "\n" +
               "酱料: " + (sauce != null ? sauce : "无");
    }
    
    // 建造者类
    public static class Builder {
        private String burger;
        private String drink;
        private String side;
        private String toy;
        private String sauce;
        
        public Builder setBurger(String burger) {
            this.burger = burger;
            return this;
        }
        
        public Builder setDrink(String drink) {
            this.drink = drink;
            return this;
        }
        
        public Builder setSide(String side) {
            this.side = side;
            return this;
        }
        
        public Builder setToy(String toy) {
            this.toy = toy;
            return this;
        }
        
        public Builder setSauce(String sauce) {
            this.sauce = sauce;
            return this;
        }
        
        public BurgerMeal build() {
            return new BurgerMeal(this);
        }
    }
}
```

### 更复杂的建造者示例 - 家庭装修

```java
// 房屋类
public class House {
    private String foundation;    // 地基
    private String structure;     // 结构
    private String roof;          // 屋顶
    private String interior;      // 内部装修
    private String exterior;      // 外部装修
    private boolean hasGarden;    // 是否有花园
    private String garage;        // 车库
    
    private House(Builder builder) {
        this.foundation = builder.foundation;
        this.structure = builder.structure;
        this.roof = builder.roof;
        this.interior = builder.interior;
        this.exterior = builder.exterior;
        this.hasGarden = builder.hasGarden;
        this.garage = builder.garage;
    }
    
    @Override
    public String toString() {
        return "房屋详情:\n" +
               "地基: " + foundation + "\n" +
               "结构: " + structure + "\n" +
               "屋顶: " + roof + "\n" +
               "内部装修: " + interior + "\n" +
               "外部装修: " + exterior + "\n" +
               "花园: " + (hasGarden ? "有" : "无") + "\n" +
               "车库: " + (garage != null ? garage : "无");
    }
    
    public static class Builder {
        private String foundation;
        private String structure;
        private String roof;
        private String interior;
        private String exterior;
        private boolean hasGarden = false;
        private String garage;
        
        public Builder setFoundation(String foundation) {
            this.foundation = foundation;
            return this;
        }
        
        public Builder setStructure(String structure) {
            this.structure = structure;
            return this;
        }
        
        public Builder setRoof(String roof) {
            this.roof = roof;
            return this;
        }
        
        public Builder setInterior(String interior) {
            this.interior = interior;
            return this;
        }
        
        public Builder setExterior(String exterior) {
            this.exterior = exterior;
            return this;
        }
        
        public Builder setHasGarden(boolean hasGarden) {
            this.hasGarden = hasGarden;
            return this;
        }
        
        public Builder setGarage(String garage) {
            this.garage = garage;
            return this;
        }
        
        public House build() {
            // 验证必要字段
            if (foundation == null || structure == null || roof == null) {
                throw new IllegalStateException("地基、结构和屋顶是必须的！");
            }
            return new House(this);
        }
    }
}
```

## 实际应用场景

### SQL查询构建器示例

```java
public class SQLQueryBuilder {
    private StringBuilder query;
    private String table;
    private String columns = "*";
    private String whereClause;
    private String orderBy;
    private int limit;
    
    private SQLQueryBuilder(Builder builder) {
        this.query = new StringBuilder();
        this.table = builder.table;
        this.columns = builder.columns;
        this.whereClause = builder.whereClause;
        this.orderBy = builder.orderBy;
        this.limit = builder.limit;
        
        buildQuery();
    }
    
    private void buildQuery() {
        query.append("SELECT ")
             .append(columns)
             .append(" FROM ")
             .append(table);
        
        if (whereClause != null && !whereClause.isEmpty()) {
            query.append(" WHERE ").append(whereClause);
        }
        
        if (orderBy != null && !orderBy.isEmpty()) {
            query.append(" ORDER BY ").append(orderBy);
        }
        
        if (limit > 0) {
            query.append(" LIMIT ").append(limit);
        }
    }
    
    public String getQuery() {
        return query.toString();
    }
    
    public static class Builder {
        private String table;
        private String columns = "*";
        private String whereClause;
        private String orderBy;
        private int limit = 0;
        
        public Builder from(String table) {
            this.table = table;
            return this;
        }
        
        public Builder select(String columns) {
            this.columns = columns;
            return this;
        }
        
        public Builder where(String condition) {
            this.whereClause = condition;
            return this;
        }
        
        public Builder orderBy(String orderBy) {
            this.orderBy = orderBy;
            return this;
        }
        
        public Builder limit(int limit) {
            this.limit = limit;
            return this;
        }
        
        public SQLQueryBuilder build() {
            if (table == null) {
                throw new IllegalArgumentException("表名是必须的！");
            }
            return new SQLQueryBuilder(this);
        }
    }
    
    public static void main(String[] args) {
        // 使用建造者模式构建复杂查询
        SQLQueryBuilder query1 = new SQLQueryBuilder.Builder()
            .from("users")
            .select("name, email, age")
            .where("age > 18 AND status = 'active'")
            .orderBy("name ASC")
            .limit(10)
            .build();
        
        System.out.println("查询1: " + query1.getQuery());
        
        SQLQueryBuilder query2 = new SQLQueryBuilder.Builder()
            .from("products")
            .select("id, name, price")
            .where("price < 100")
            .orderBy("price DESC")
            .build();
        
        System.out.println("查询2: " + query2.getQuery());
    }
}
```

### 邮件构建器示例

```java
import java.util.ArrayList;
import java.util.List;

public class Email {
    private String from;
    private String to;
    private String cc;
    private String bcc;
    private String subject;
    private String body;
    private List<String> attachments;
    
    private Email(Builder builder) {
        this.from = builder.from;
        this.to = builder.to;
        this.cc = builder.cc;
        this.bcc = builder.bcc;
        this.subject = builder.subject;
        this.body = builder.body;
        this.attachments = new ArrayList<>(builder.attachments);
    }
    
    @Override
    public String toString() {
        return "邮件详情:\n" +
               "发件人: " + from + "\n" +
               "收件人: " + to + "\n" +
               "抄送: " + (cc != null ? cc : "无") + "\n" +
               "密送: " + (bcc != null ? bcc : "无") + "\n" +
               "主题: " + subject + "\n" +
               "正文: " + body + "\n" +
               "附件数量: " + attachments.size();
    }
    
    public static class Builder {
        private String from;
        private String to;
        private String cc;
        private String bcc;
        private String subject;
        private String body;
        private List<String> attachments = new ArrayList<>();
        
        public Builder from(String from) {
            this.from = from;
            return this;
        }
        
        public Builder to(String to) {
            this.to = to;
            return this;
        }
        
        public Builder cc(String cc) {
            this.cc = cc;
            return this;
        }
        
        public Builder bcc(String bcc) {
            this.bcc = bcc;
            return this;
        }
        
        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }
        
        public Builder body(String body) {
            this.body = body;
            return this;
        }
        
        public Builder addAttachment(String attachment) {
            this.attachments.add(attachment);
            return this;
        }
        
        public Email build() {
            if (from == null || to == null || subject == null || body == null) {
                throw new IllegalArgumentException("发件人、收件人、主题和正文都是必须的！");
            }
            return new Email(this);
        }
    }
    
    public static void main(String[] args) {
        Email email = new Email.Builder()
            .from("boss@company.com")
            .to("employee@company.com")
            .cc("manager@company.com")
            .subject("月度报告")
            .body("请查收本月的工作报告，详见附件。")
            .addAttachment("report.pdf")
            .addAttachment("charts.xlsx")
            .build();
        
        System.out.println(email);
    }
}
```

### JSON构建器示例

```java
public class JSONBuilder {
    private StringBuilder json;
    
    private JSONBuilder(Builder builder) {
        this.json = builder.json;
    }
    
    @Override
    public String toString() {
        return json.toString();
    }
    
    public static class Builder {
        private StringBuilder json = new StringBuilder("{");
        private boolean first = true;
        
        public Builder addField(String key, String value) {
            if (!first) {
                json.append(",");
            }
            json.append("\"").append(key).append("\":\"").append(value).append("\"");
            first = false;
            return this;
        }
        
        public Builder addField(String key, int value) {
            if (!first) {
                json.append(",");
            }
            json.append("\"").append(key).append("\":").append(value);
            first = false;
            return this;
        }
        
        public Builder addField(String key, boolean value) {
            if (!first) {
                json.append(",");
            }
            json.append("\"").append(key).append("\":").append(value);
            first = false;
            return this;
        }
        
        public JSONBuilder build() {
            json.append("}");
            return new JSONBuilder(this);
        }
    }
    
    public static void main(String[] args) {
        JSONBuilder json = new JSONBuilder.Builder()
            .addField("name", "张三")
            .addField("age", 25)
            .addField("isActive", true)
            .addField("email", "zhangsan@example.com")
            .build();
        
        System.out.println("JSON: " + json);
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        // 创建普通汉堡套餐
        BurgerMeal regularMeal = new BurgerMeal.Builder()
            .setBurger("牛肉汉堡")
            .setDrink("可乐")
            .setSide("薯条")
            .setSauce("番茄酱")
            .build();
        
        System.out.println("普通套餐:");
        System.out.println(regularMeal);
        System.out.println("\n" + "=".repeat(30) + "\n");
        
        // 创建儿童汉堡套餐
        BurgerMeal kidsMeal = new BurgerMeal.Builder()
            .setBurger("鸡肉汉堡")
            .setDrink("橙汁")
            .setSide("苹果块")
            .setToy("小汽车")
            .build();
        
        System.out.println("儿童套餐:");
        System.out.println(kidsMeal);
        System.out.println("\n" + "=".repeat(30) + "\n");
        
        // 创建豪华住宅
        House luxuryHouse = new House.Builder()
            .setFoundation("钢筋混凝土深基础")
            .setStructure("钢结构框架")
            .setRoof("琉璃瓦屋顶")
            .setInterior("欧式豪华装修")
            .setExterior("大理石外墙")
            .setHasGarden(true)
            .setGarage("双车位车库")
            .build();
        
        System.out.println("豪华住宅:");
        System.out.println(luxuryHouse);
    }
}
```

## 建造者模式的优缺点

### 优点
1. 逐步构建复杂对象，建造过程可控
2. 对对象的建造过程更加精细控制
3. 方法链式调用，代码可读性好
4. 可以对构造过程进行更精细的控制
5. 产品对象具有不可变性（一旦构建完成就不能修改）

### 缺点
1. 需要为每一个产品创建一个建造者类，代码量增加
2. 产品的组成部分必须相同，限制了适用范围
3. 如果产品内部变化复杂，建造者模式的维护成本会增加

## 与工厂模式的区别

- **工厂模式**：一次性创建完整对象，关注的是产品类型
- **建造者模式**：分步骤创建复杂对象，关注的是构建过程

## 总结

建造者模式就像乐高积木大师——一步一步地构建复杂对象。它特别适用于以下场景：
1. 需要创建复杂对象
2. 对象的组成部分可能变化
3. 需要对创建过程进行精确控制

记住：**建造者模式是"分步骤构建复杂对象"的专家，就像你组装Ikea家具一样，一步一步来，最终得到完整的产品！**

在Java中，StringBuilder、DocumentBuilder等都是建造者模式的典型应用。