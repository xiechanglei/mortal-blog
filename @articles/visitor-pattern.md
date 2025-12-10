# 访问者模式 (Visitor Pattern) - 程序界的“审计员”

## 什么是访问者模式？

想象一下，你是一家大型公司的审计员，你需要访问公司内部的不同部门：财务部、人事部、技术部等。每个部门都有自己的数据和操作方式，但作为审计员，你需要对所有部门执行相同的审计操作（比如检查合规性、审核数据等）。访问者模式就是这样——它在不改变元素类的前提下，为这些元素类增加新的操作。

**访问者模式**表示一个作用于某对象结构中的各元素的操作，它使你可以在不改变各元素类的前提下，定义作用于这些元素的新操作。

## 为什么需要访问者模式？

在以下场景中，访问者模式特别有用：

1. 当一个对象结构包含很多类对象，它们有不同的接口，而想对这些对象进行某些依赖于其具体类的操作
2. 当需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而想避免让这些操作"污染"这些对象的类
3. 当对象结构很少改变，但经常需要在此结构上定义新的操作

## 访问者模式的实现

### 基础结构示例

```java
// 访问者接口
interface Visitor {
    void visit(ElementA element);
    void visit(ElementB element);
    void visit(ElementC element);
}

// 元素接口
interface Element {
    void accept(Visitor visitor);
}

// 具体元素A
class ElementA implements Element {
    private String dataA;
    
    public ElementA(String dataA) {
        this.dataA = dataA;
    }
    
    public String getDataA() {
        return dataA;
    }
    
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    
    public void operationA() {
        System.out.println("执行ElementA特定操作: " + dataA);
    }
}

// 具体元素B
class ElementB implements Element {
    private int dataB;
    
    public ElementB(int dataB) {
        this.dataB = dataB;
    }
    
    public int getDataB() {
        return dataB;
    }
    
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    
    public void operationB() {
        System.out.println("执行ElementB特定操作: " + dataB);
    }
}

// 具体元素C
class ElementC implements Element {
    private double dataC;
    
    public ElementC(double dataC) {
        this.dataC = dataC;
    }
    
    public double getDataC() {
        return dataC;
    }
    
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
    
    public void operationC() {
        System.out.println("执行ElementC特定操作: " + dataC);
    }
}

// 对象结构 - 包含多个元素
class ObjectStructure {
    private java.util.List<Element> elements = new java.util.ArrayList<>();
    
    public void attach(Element element) {
        elements.add(element);
    }
    
    public void detach(Element element) {
        elements.remove(element);
    }
    
    public void accept(Visitor visitor) {
        for (Element element : elements) {
            element.accept(visitor);
        }
    }
}

// 具体访问者 - 打印访问者
class PrintVisitor implements Visitor {
    @Override
    public void visit(ElementA element) {
        System.out.println("打印ElementA: " + element.getDataA());
    }
    
    @Override
    public void visit(ElementB element) {
        System.out.println("打印ElementB: " + element.getDataB());
    }
    
    @Override
    public void visit(ElementC element) {
        System.out.println("打印ElementC: " + element.getDataC());
    }
}

// 具体访问者 - 计算访问者
class CalculateVisitor implements Visitor {
    private double total = 0.0;
    
    public double getTotal() {
        return total;
    }
    
    @Override
    public void visit(ElementA element) {
        // ElementA对总数的贡献
        total += element.getDataA().length();
    }
    
    @Override
    public void visit(ElementB element) {
        total += element.getDataB();
    }
    
    @Override
    public void visit(ElementC element) {
        total += element.getDataC();
    }
}
```

### 员工薪资系统示例

```java
// 访问者接口 - 薪资操作
interface SalaryVisitor {
    void visit(FullTimeEmployee employee);
    void visit(PartTimeEmployee employee);
    void visit(Contractor employee);
}

// 员工抽象类
abstract class Employee {
    protected String name;
    protected String id;
    
    public Employee(String name, String id) {
        this.name = name;
        this.id = id;
    }
    
    public String getName() { return name; }
    public String getId() { return id; }
    
    public abstract void accept(SalaryVisitor visitor);
}

// 全职员工
class FullTimeEmployee extends Employee {
    private double monthlySalary;
    private int annualBonus;
    
    public FullTimeEmployee(String name, String id, double monthlySalary, int annualBonus) {
        super(name, id);
        this.monthlySalary = monthlySalary;
        this.annualBonus = annualBonus;
    }
    
    public double getMonthlySalary() { return monthlySalary; }
    public int getAnnualBonus() { return annualBonus; }
    
    @Override
    public void accept(SalaryVisitor visitor) {
        visitor.visit(this);
    }
}

// 兼职员工
class PartTimeEmployee extends Employee {
    private double hourlyRate;
    private int hoursWorked;
    
    public PartTimeEmployee(String name, String id, double hourlyRate, int hoursWorked) {
        super(name, id);
        this.hourlyRate = hourlyRate;
        this.hoursWorked = hoursWorked;
    }
    
    public double getHourlyRate() { return hourlyRate; }
    public int getHoursWorked() { return hoursWorked; }
    
    @Override
    public void accept(SalaryVisitor visitor) {
        visitor.visit(this);
    }
}

// 承包商
class Contractor extends Employee {
    private double projectFee;
    private int projectCount;
    
    public Contractor(String name, String id, double projectFee, int projectCount) {
        super(name, id);
        this.projectFee = projectFee;
        this.projectCount = projectCount;
    }
    
    public double getProjectFee() { return projectFee; }
    public int getProjectCount() { return projectCount; }
    
    @Override
    public void accept(SalaryVisitor visitor) {
        visitor.visit(this);
    }
}

// 薪资计算访问者
class SalaryCalculator implements SalaryVisitor {
    private double totalSalary = 0.0;
    
    public double getTotalSalary() {
        return totalSalary;
    }
    
    @Override
    public void visit(FullTimeEmployee employee) {
        double annualSalary = employee.getMonthlySalary() * 12 + employee.getAnnualBonus();
        System.out.println(employee.getName() + " (全职): 年薪 ¥" + annualSalary);
        totalSalary += annualSalary;
    }
    
    @Override
    public void visit(PartTimeEmployee employee) {
        double annualSalary = employee.getHourlyRate() * employee.getHoursWorked() * 12;
        System.out.println(employee.getName() + " (兼职): 年薪 ¥" + annualSalary);
        totalSalary += annualSalary;
    }
    
    @Override
    public void visit(Contractor employee) {
        double annualFee = employee.getProjectFee() * employee.getProjectCount();
        System.out.println(employee.getName() + " (承包商): 年费 ¥" + annualFee);
        totalSalary += annualFee;
    }
}

// 税务计算访问者
class TaxCalculator implements SalaryVisitor {
    private double totalTax = 0.0;
    
    public double getTotalTax() {
        return totalTax;
    }
    
    @Override
    public void visit(FullTimeEmployee employee) {
        double annualSalary = employee.getMonthlySalary() * 12 + employee.getAnnualBonus();
        double tax = calculateTax(annualSalary);
        System.out.println(employee.getName() + " (全职): 应缴税 ¥" + tax);
        totalTax += tax;
    }
    
    @Override
    public void visit(PartTimeEmployee employee) {
        double annualSalary = employee.getHourlyRate() * employee.getHoursWorked() * 12;
        double tax = calculateTax(annualSalary);
        System.out.println(employee.getName() + " (兼职): 应缴税 ¥" + tax);
        totalTax += tax;
    }
    
    @Override
    public void visit(Contractor employee) {
        double annualFee = employee.getProjectFee() * employee.getProjectCount();
        // 承包商税率可能不同
        double tax = calculateTax(annualFee) * 1.1; // 假设承包商税率高10%
        System.out.println(employee.getName() + " (承包商): 应缴税 ¥" + tax);
        totalTax += tax;
    }
    
    private double calculateTax(double income) {
        // 简化的税务计算
        double taxableIncome = Math.max(0, income - 60000); // 起征点
        if (taxableIncome <= 36000) return taxableIncome * 0.03;
        else if (taxableIncome <= 144000) return 1080 + (taxableIncome - 36000) * 0.10;
        else if (taxableIncome <= 300000) return 1080 + 10800 + (taxableIncome - 144000) * 0.20;
        else return 1080 + 10800 + 31200 + (taxableIncome - 300000) * 0.25; // 简化计算
    }
}

// 公司类 - 对象结构
class Company {
    private java.util.List<Employee> employees = new java.util.ArrayList<>();
    
    public void addEmployee(Employee employee) {
        employees.add(employee);
    }
    
    public void removeEmployee(Employee employee) {
        employees.remove(employee);
    }
    
    public void accept(SalaryVisitor visitor) {
        for (Employee employee : employees) {
            employee.accept(visitor);
        }
    }
    
    public int getEmployeeCount() {
        return employees.size();
    }
}
```

## 实际应用场景

### 图形系统示例

```java
// 图形访问者接口
interface GraphicVisitor {
    void visit(Circle circle);
    void visit(Rectangle rectangle);
    void visit(Triangle triangle);
    void visit(CompositeGraphic composite);
}

// 图形抽象类
abstract class Graphic {
    protected String name;
    
    public Graphic(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    
    public abstract void accept(GraphicVisitor visitor);
    public abstract double getArea();
    public abstract double getPerimeter();
}

// 圆形
class Circle extends Graphic {
    private double radius;
    
    public Circle(String name, double radius) {
        super(name);
        this.radius = radius;
    }
    
    public double getRadius() { return radius; }
    
    @Override
    public void accept(GraphicVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
}

// 矩形
class Rectangle extends Graphic {
    private double width;
    private double height;
    
    public Rectangle(String name, double width, double height) {
        super(name);
        this.width = width;
        this.height = height;
    }
    
    public double getWidth() { return width; }
    public double getHeight() { return height; }
    
    @Override
    public void accept(GraphicVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public double getArea() {
        return width * height;
    }
    
    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
}

// 三角形
class Triangle extends Graphic {
    private double side1, side2, side3;
    
    public Triangle(String name, double side1, double side2, double side3) {
        super(name);
        this.side1 = side1;
        this.side2 = side2;
        this.side3 = side3;
    }
    
    @Override
    public void accept(GraphicVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public double getArea() {
        // 使用海伦公式计算面积
        double s = (side1 + side2 + side3) / 2;
        return Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
    }
    
    @Override
    public double getPerimeter() {
        return side1 + side2 + side3;
    }
}

// 复合图形（包含其他图形的容器）
class CompositeGraphic extends Graphic {
    private java.util.List<Graphic> children = new java.util.ArrayList<>();
    
    public CompositeGraphic(String name) {
        super(name);
    }
    
    public void add(Graphic graphic) {
        children.add(graphic);
    }
    
    public void remove(Graphic graphic) {
        children.remove(graphic);
    }
    
    @Override
    public void accept(GraphicVisitor visitor) {
        visitor.visit(this);
        for (Graphic child : children) {
            child.accept(visitor);
        }
    }
    
    @Override
    public double getArea() {
        double totalArea = 0;
        for (Graphic child : children) {
            totalArea += child.getArea();
        }
        return totalArea;
    }
    
    @Override
    public double getPerimeter() {
        double totalPerimeter = 0;
        for (Graphic child : children) {
            totalPerimeter += child.getPerimeter();
        }
        return totalPerimeter;
    }
}

// 渲染访问者
class RenderVisitor implements GraphicVisitor {
    @Override
    public void visit(Circle circle) {
        System.out.println("渲染圆形: " + circle.getName() + 
                          " (半径: " + circle.getRadius() + ")");
    }
    
    @Override
    public void visit(Rectangle rectangle) {
        System.out.println("渲染矩形: " + rectangle.getName() + 
                          " (宽: " + rectangle.getWidth() + 
                          ", 高: " + rectangle.getHeight() + ")");
    }
    
    @Override
    public void visit(Triangle triangle) {
        System.out.println("渲染三角形: " + triangle.getName());
    }
    
    @Override
    public void visit(CompositeGraphic composite) {
        System.out.println("渲染复合图形: " + composite.getName());
    }
}

// 计算面积访问者
class AreaCalculator implements GraphicVisitor {
    private double totalArea = 0.0;
    
    public double getTotalArea() {
        return totalArea;
    }
    
    @Override
    public void visit(Circle circle) {
        totalArea += circle.getArea();
    }
    
    @Override
    public void visit(Rectangle rectangle) {
        totalArea += rectangle.getArea();
    }
    
    @Override
    public void visit(Triangle triangle) {
        totalArea += triangle.getArea();
    }
    
    @Override
    public void visit(CompositeGraphic composite) {
        totalArea += composite.getArea();
    }
}
```

### 编译器语法树示例

```java
// 表达式访问者接口
interface ExpressionVisitor {
    void visit(NumberExpression expression);
    void visit(AddExpression expression);
    void visit(MultiplyExpression expression);
    void visit(VariableExpression expression);
}

// 表达式抽象类
abstract class Expression {
    public abstract void accept(ExpressionVisitor visitor);
    public abstract String toString();
}

// 数字表达式
class NumberExpression extends Expression {
    private int value;
    
    public NumberExpression(int value) {
        this.value = value;
    }
    
    public int getValue() { return value; }
    
    @Override
    public void accept(ExpressionVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String toString() {
        return String.valueOf(value);
    }
}

// 变量表达式
class VariableExpression extends Expression {
    private String name;
    
    public VariableExpression(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    
    @Override
    public void accept(ExpressionVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String toString() {
        return name;
    }
}

// 加法表达式
class AddExpression extends Expression {
    private Expression left;
    private Expression right;
    
    public AddExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }
    
    public Expression getLeft() { return left; }
    public Expression getRight() { return right; }
    
    @Override
    public void accept(ExpressionVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String toString() {
        return "(" + left + " + " + right + ")";
    }
}

// 乘法表达式
class MultiplyExpression extends Expression {
    private Expression left;
    private Expression right;
    
    public MultiplyExpression(Expression left, Expression right) {
        this.left = left;
        this.right = right;
    }
    
    public Expression getLeft() { return left; }
    public Expression getRight() { return right; }
    
    @Override
    public void accept(ExpressionVisitor visitor) {
        visitor.visit(this);
    }
    
    @Override
    public String toString() {
        return "(" + left + " * " + right + ")";
    }
}

// 计算访问者
class Calculator implements ExpressionVisitor {
    private int result;
    private java.util.Map<String, Integer> variables = new java.util.HashMap<>();
    
    public void setVariable(String name, int value) {
        variables.put(name, value);
    }
    
    public int getResult() {
        return result;
    }
    
    public int calculate(Expression expression) {
        expression.accept(this);
        return result;
    }
    
    @Override
    public void visit(NumberExpression expression) {
        result = expression.getValue();
    }
    
    @Override
    public void visit(VariableExpression expression) {
        result = variables.getOrDefault(expression.getName(), 0);
    }
    
    @Override
    public void visit(AddExpression expression) {
        expression.getLeft().accept(this);
        int leftResult = result;
        expression.getRight().accept(this);
        int rightResult = result;
        result = leftResult + rightResult;
    }
    
    @Override
    public void visit(MultiplyExpression expression) {
        expression.getLeft().accept(this);
        int leftResult = result;
        expression.getRight().accept(this);
        int rightResult = result;
        result = leftResult * rightResult;
    }
}

// 打印访问者
class ExpressionPrinter implements ExpressionVisitor {
    private StringBuilder output = new StringBuilder();
    
    public String print(Expression expression) {
        expression.accept(this);
        return output.toString();
    }
    
    @Override
    public void visit(NumberExpression expression) {
        output.append(expression.getValue());
    }
    
    @Override
    public void visit(VariableExpression expression) {
        output.append(expression.getName());
    }
    
    @Override
    public void visit(AddExpression expression) {
        output.append("(");
        expression.getLeft().accept(this);
        output.append(" + ");
        expression.getRight().accept(this);
        output.append(")");
    }
    
    @Override
    public void visit(MultiplyExpression expression) {
        output.append("(");
        expression.getLeft().accept(this);
        output.append(" * ");
        expression.getRight().accept(this);
        output.append(")");
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 基础访问者示例 ===");
        
        ObjectStructure structure = new ObjectStructure();
        structure.attach(new ElementA("数据A"));
        structure.attach(new ElementB(123));
        structure.attach(new ElementC(45.67));
        structure.attach(new ElementA("数据B"));
        
        // 使用打印访问者
        System.out.println("使用打印访问者:");
        PrintVisitor printVisitor = new PrintVisitor();
        structure.accept(printVisitor);
        
        System.out.println();
        
        // 使用计算访问者
        System.out.println("使用计算访问者:");
        CalculateVisitor calculateVisitor = new CalculateVisitor();
        structure.accept(calculateVisitor);
        System.out.println("计算结果总计: " + calculateVisitor.getTotal());
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 员工薪资系统示例 ===");
        
        Company company = new Company();
        company.addEmployee(new FullTimeEmployee("张三", "FT001", 15000, 20000));
        company.addEmployee(new PartTimeEmployee("李四", "PT001", 100, 80));
        company.addEmployee(new Contractor("王五", "CT001", 50000, 3));
        company.addEmployee(new FullTimeEmployee("赵六", "FT002", 18000, 25000));
        
        // 计算薪资
        System.out.println("薪资计算:");
        SalaryCalculator salaryCalculator = new SalaryCalculator();
        company.accept(salaryCalculator);
        System.out.println("公司年度薪资总额: ¥" + salaryCalculator.getTotalSalary());
        
        System.out.println();
        
        // 计算税务
        System.out.println("税务计算:");
        TaxCalculator taxCalculator = new TaxCalculator();
        company.accept(taxCalculator);
        System.out.println("公司年度税务总额: ¥" + taxCalculator.getTotalTax());
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 图形系统示例 ===");
        
        // 创建图形结构
        CompositeGraphic drawing = new CompositeGraphic("我的画布");
        
        Circle circle1 = new Circle("圆形1", 5);
        Rectangle rect1 = new Rectangle("矩形1", 10, 8);
        Triangle triangle1 = new Triangle("三角形1", 3, 4, 5);
        
        drawing.add(circle1);
        drawing.add(rect1);
        drawing.add(triangle1);
        
        // 渲染图形
        System.out.println("渲染图形:");
        RenderVisitor renderVisitor = new RenderVisitor();
        drawing.accept(renderVisitor);
        
        System.out.println();
        
        // 计算总面积
        System.out.println("计算面积:");
        AreaCalculator areaCalculator = new AreaCalculator();
        drawing.accept(areaCalculator);
        System.out.println("总面积: " + String.format("%.2f", areaCalculator.getTotalArea()));
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 编译器语法树示例 ===");
        
        // 创建表达式: (5 + 3) * (x + 2)
        Expression expression = new MultiplyExpression(
            new AddExpression(new NumberExpression(5), new NumberExpression(3)),
            new AddExpression(new VariableExpression("x"), new NumberExpression(2))
        );
        
        System.out.println("表达式: " + expression.toString());
        
        // 打印表达式
        ExpressionPrinter printer = new ExpressionPrinter();
        System.out.println("格式化输出: " + printer.print(expression));
        
        // 计算表达式（假设x=4）
        Calculator calculator = new Calculator();
        calculator.setVariable("x", 4);
        int result = calculator.calculate(expression);
        System.out.println("当x=4时，表达式结果: " + result);
        
        System.out.println("\n验证计算过程:");
        System.out.println("(5 + 3) * (4 + 2) = 8 * 6 = 48");
    }
}
```

## 访问者模式的优缺点

### 优点
1. 易于增加新的操作：增加新的访问者类可以很容易地增加新的操作
2. 集中相关的操作：将所有元素类的相似操作集中在访问者类中
3. 分离无关功能：将无关的功能分离到不同的访问者类中

### 缺点
1. 增加新的元素类很困难：每增加一个新的元素类都必须修改访问者接口和所有实现
2. 破坏封装：访问者对象可能需要访问元素类的私有成员
3. 实现复杂：访问者的实现相对复杂，特别是当元素类较多时

## 访问者模式的结构

访问者模式通常包含以下角色：

1. **Visitor（访问者接口）**：为该对象结构中具体元素角色声明一个访问操作接口
2. **ConcreteVisitor（具体访问者）**：实现每个由Visitor声明的操作
3. **Element（元素接口）**：定义一个accept操作，它以一个访问者为参数
4. **ConcreteElement（具体元素）**：实现了accept操作
5. **ObjectStructure（对象结构）**：能枚举它的元素，可以提供一个高层的接口以允许访问者访问它的元素

## 双分派 (Double Dispatch)

访问者模式使用了双分派技术，即：
1. 第一次分派：`element.accept(visitor)` - 根据元素类型分派
2. 第二次分派：`visitor.visit(element)` - 根据访问者类型分派

## 总结

访问者模式就像程序界的"审计员"——它能够在不修改元素类的情况下，为这些元素添加新的操作。就像审计员可以对不同部门执行不同的审计任务一样，访问者模式让操作与对象结构分离。

记住：**访问者模式适用于对象结构稳定但需要增加新操作的场景，特别适合于编译器、图形处理、数据处理等领域！**

在实际开发中，访问者模式被广泛应用于：
- 编译器设计中的语法树处理
- 图形处理系统中的形状操作
- 数据处理中的报表生成
- XML/HTML解析器等