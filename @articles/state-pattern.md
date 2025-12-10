# 状态模式 (State Pattern) - 程序界的“千面人”

## 什么是状态模式？

想象一下你的手机，它可能处于开机、关机、待机、通话、充电等多种状态。在不同状态下，同一个按键（比如电源键）会有不同的行为：开机时长按是关机，关机时短按是开机，待机时短按是点亮屏幕。状态模式就是这样——它允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。

**状态模式**允许一个对象在其内部状态改变时改变它的行为，这个对象看起来似乎修改了它的类。

## 为什么需要状态模式？

在以下场景中，状态模式特别有用：

1. 当一个对象的行为取决于它的状态，并且它必须在运行时根据状态改变它的行为
2. 代码中包含大量与对象状态有关的条件语句
3. 需要将特定于状态的行为局部化，并且容易增加新的状态

## 状态模式的实现

### 简单开关示例

```java
// 状态接口
interface State {
    void pressSwitch(Light light);
}

// 具体状态 - 开启状态
class OnState implements State {
    @Override
    public void pressSwitch(Light light) {
        System.out.println("关闭灯");
        light.setState(new OffState());
    }
}

// 具体状态 - 关闭状态
class OffState implements State {
    @Override
    public void pressSwitch(Light light) {
        System.out.println("打开灯");
        light.setState(new OnState());
    }
}

// 上下文类 - 灯
class Light {
    private State state;
    
    public Light() {
        this.state = new OffState(); // 初始状态
        System.out.println("灯初始状态: 关闭");
    }
    
    public void setState(State state) {
        this.state = state;
    }
    
    public void pressSwitch() {
        state.pressSwitch(this);
    }
    
    public State getState() {
        return state;
    }
}
```

### 投币机示例

```java
// 投币机状态接口
interface VendingMachineState {
    void insertMoney(VendingMachine machine, int amount);
    void ejectMoney(VendingMachine machine);
    void selectProduct(VendingMachine machine, String product);
    void dispenseProduct(VendingMachine machine);
}

// 没有钱状态
class NoMoneyState implements VendingMachineState {
    @Override
    public void insertMoney(VendingMachine machine, int amount) {
        System.out.println("收到 " + amount + " 元");
        machine.setAmount(machine.getAmount() + amount);
        machine.setState(machine.getHasMoneyState());
    }
    
    @Override
    public void ejectMoney(VendingMachine machine) {
        System.out.println("您还没有投入钱币");
    }
    
    @Override
    public void selectProduct(VendingMachine machine, String product) {
        System.out.println("请先投币");
    }
    
    @Override
    public void dispenseProduct(VendingMachine machine) {
        System.out.println("请先投币");
    }
}

// 有钱状态
class HasMoneyState implements VendingMachineState {
    @Override
    public void insertMoney(VendingMachine machine, int amount) {
        System.out.println("已经收到您的钱，总额: " + (machine.getAmount() + amount) + " 元");
        machine.setAmount(machine.getAmount() + amount);
    }
    
    @Override
    public void ejectMoney(VendingMachine machine) {
        System.out.println("退还 " + machine.getAmount() + " 元");
        machine.setAmount(0);
        machine.setState(machine.getNoMoneyState());
    }
    
    @Override
    public void selectProduct(VendingMachine machine, String product) {
        if (machine.hasProduct(product)) {
            int price = machine.getProductPrice(product);
            if (machine.getAmount() >= price) {
                System.out.println("您选择了 " + product);
                machine.setAmount(machine.getAmount() - price);
                machine.setState(machine.getSoldState());
            } else {
                System.out.println("金额不足，还需投入: " + (price - machine.getAmount()) + " 元");
            }
        } else {
            System.out.println("商品 " + product + " 已售完");
        }
    }
    
    @Override
    public void dispenseProduct(VendingMachine machine) {
        System.out.println("请先选择商品");
    }
}

// 售出状态
class SoldState implements VendingMachineState {
    @Override
    public void insertMoney(VendingMachine machine, int amount) {
        System.out.println("请等待，正在出货中...");
    }
    
    @Override
    public void ejectMoney(VendingMachine machine) {
        System.out.println("抱歉，您已经选择了商品，无法退币");
    }
    
    @Override
    public void selectProduct(VendingMachine machine, String product) {
        System.out.println("请等待，正在出货中...");
    }
    
    @Override
    public void dispenseProduct(VendingMachine machine) {
        String product = machine.getLastSelectedProduct();
        System.out.println("正在出货: " + product);
        machine.releaseProduct(product);
        
        if (machine.getAmount() > 0) {
            System.out.println("退还零钱: " + machine.getAmount() + " 元");
            machine.setAmount(0);
        }
        
        if (machine.hasProduct(product)) {
            machine.setState(machine.getNoMoneyState());
        } else {
            System.out.println("商品 " + product + " 已售完");
            machine.setState(machine.getSoldOutState());
        }
    }
}

// 售完状态
class SoldOutState implements VendingMachineState {
    @Override
    public void insertMoney(VendingMachine machine, int amount) {
        System.out.println("商品已售完，无法接受钱币");
    }
    
    @Override
    public void ejectMoney(VendingMachine machine) {
        System.out.println("商品已售完，没有钱币可退");
    }
    
    @Override
    public void selectProduct(VendingMachine machine, String product) {
        System.out.println("商品已售完");
    }
    
    @Override
    public void dispenseProduct(VendingMachine machine) {
        System.out.println("商品已售完");
    }
}

// 投币机类
class VendingMachine {
    private VendingMachineState noMoneyState;
    private VendingMachineState hasMoneyState;
    private VendingMachineState soldState;
    private VendingMachineState soldOutState;
    
    private VendingMachineState state;
    private int amount;
    private String lastSelectedProduct;
    
    // 简单的商品库存
    private java.util.Map<String, Integer> inventory;
    
    public VendingMachine() {
        noMoneyState = new NoMoneyState();
        hasMoneyState = new HasMoneyState();
        soldState = new SoldState();
        soldOutState = new SoldOutState();
        
        state = noMoneyState;
        amount = 0;
        
        // 初始化库存
        inventory = new java.util.HashMap<>();
        inventory.put("可乐", 5);
        inventory.put("雪碧", 3);
        inventory.put("矿泉水", 7);
    }
    
    public void setState(VendingMachineState state) {
        this.state = state;
    }
    
    public void insertMoney(int amount) {
        state.insertMoney(this, amount);
    }
    
    public void ejectMoney() {
        state.ejectMoney(this);
    }
    
    public void selectProduct(String product) {
        lastSelectedProduct = product;
        state.selectProduct(this, product);
    }
    
    public void dispenseProduct() {
        state.dispenseProduct(this);
    }
    
    // 获取各个状态对象
    public VendingMachineState getNoMoneyState() { return noMoneyState; }
    public VendingMachineState getHasMoneyState() { return hasMoneyState; }
    public VendingMachineState getSoldState() { return soldState; }
    public VendingMachineState getSoldOutState() { return soldOutState; }
    
    // 获取和设置金额
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    
    // 获取最后选择的商品
    public String getLastSelectedProduct() { return lastSelectedProduct; }
    
    // 商品相关操作
    public boolean hasProduct(String product) {
        return inventory.containsKey(product) && inventory.get(product) > 0;
    }
    
    public int getProductPrice(String product) {
        switch (product) {
            case "可乐": return 3;
            case "雪碧": return 3;
            case "矿泉水": return 2;
            default: return 5; // 默认价格
        }
    }
    
    public void releaseProduct(String product) {
        if (inventory.containsKey(product)) {
            int count = inventory.get(product);
            inventory.put(product, count - 1);
            System.out.println("成功出货: " + product + "，剩余库存: " + inventory.get(product));
        }
    }
    
    public void showInventory() {
        System.out.println("当前库存:");
        for (java.util.Map.Entry<String, Integer> entry : inventory.entrySet()) {
            System.out.println("  " + entry.getKey() + ": " + entry.getValue() + " 件");
        }
    }
}
```

## 实际应用场景

### 文档编辑器状态示例

```java
// 文档状态接口
interface DocumentState {
    void edit(DocumentEditor editor, String content);
    void save(DocumentEditor editor);
    void share(DocumentEditor editor);
    void publish(DocumentEditor editor);
    String getStateName();
}

// 草稿状态
class DraftState implements DocumentState {
    @Override
    public void edit(DocumentEditor editor, String content) {
        editor.setContent(content);
        System.out.println("在草稿状态下编辑文档");
    }
    
    @Override
    public void save(DocumentEditor editor) {
        System.out.println("文档已保存");
        editor.setState(new SavedState());
    }
    
    @Override
    public void share(DocumentEditor editor) {
        System.out.println("草稿状态下无法分享文档");
    }
    
    @Override
    public void publish(DocumentEditor editor) {
        System.out.println("草稿状态下无法发布文档");
    }
    
    @Override
    public String getStateName() {
        return "草稿";
    }
}

// 已保存状态
class SavedState implements DocumentState {
    @Override
    public void edit(DocumentEditor editor, String content) {
        editor.setContent(content);
        System.out.println("在已保存状态下编辑文档");
    }
    
    @Override
    public void save(DocumentEditor editor) {
        System.out.println("文档已保存（已是最新）");
    }
    
    @Override
    public void share(DocumentEditor editor) {
        System.out.println("分享文档链接给其他人");
        editor.setState(new SharedState());
    }
    
    @Override
    public void publish(DocumentEditor editor) {
        System.out.println("发布文档到公开平台");
        editor.setState(new PublishedState());
    }
    
    @Override
    public String getStateName() {
        return "已保存";
    }
}

// 已分享状态
class SharedState implements DocumentState {
    @Override
    public void edit(DocumentEditor editor, String content) {
        editor.setContent(content);
        System.out.println("在已分享状态下编辑文档");
        // 编辑后文档会自动更新，共享链接中的文档也更新
    }
    
    @Override
    public void save(DocumentEditor editor) {
        System.out.println("文档已保存");
    }
    
    @Override
    public void share(DocumentEditor editor) {
        System.out.println("文档已经分享过了");
    }
    
    @Override
    public void publish(DocumentEditor editor) {
        System.out.println("发布文档到公开平台");
        editor.setState(new PublishedState());
    }
    
    @Override
    public String getStateName() {
        return "已分享";
    }
}

// 已发布状态
class PublishedState implements DocumentState {
    @Override
    public void edit(DocumentEditor editor, String content) {
        System.out.println("已发布的文档不能直接编辑，需要先撤回发布");
        // 实际应用中，可能需要创建新版本
    }
    
    @Override
    public void save(DocumentEditor editor) {
        System.out.println("已发布的文档不能保存草稿");
    }
    
    @Override
    public void share(DocumentEditor editor) {
        System.out.println("文档已发布，公众可访问");
    }
    
    @Override
    public void publish(DocumentEditor editor) {
        System.out.println("文档已经是发布状态");
    }
    
    @Override
    public String getStateName() {
        return "已发布";
    }
}

// 文档编辑器类
class DocumentEditor {
    private String content;
    private DocumentState state;
    private String title;
    
    public DocumentEditor(String title) {
        this.title = title;
        this.state = new DraftState(); // 初始状态
        this.content = "";
        System.out.println("创建文档: " + title + "，初始状态: " + state.getStateName());
    }
    
    public void setState(DocumentState state) {
        this.state = state;
        System.out.println("文档 " + title + " 状态变更为: " + state.getStateName());
    }
    
    public void edit(String content) {
        state.edit(this, content);
    }
    
    public void save() {
        state.save(this);
    }
    
    public void share() {
        state.share(this);
    }
    
    public void publish() {
        state.publish(this);
    }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getTitle() { return title; }
    public DocumentState getState() { return state; }
}
```

### TCP连接状态示例

```java
// TCP连接状态接口
interface TCPState {
    void open(TCPConnection connection);
    void close(TCPConnection connection);
    void acknowledge(TCPConnection connection);
    String getStateName();
}

// 关闭状态
class ClosedState implements TCPState {
    @Override
    public void open(TCPConnection connection) {
        System.out.println("发送SYN包");
        connection.setState(new SynSentState());
    }
    
    @Override
    public void close(TCPConnection connection) {
        System.out.println("连接已关闭");
    }
    
    @Override
    public void acknowledge(TCPConnection connection) {
        System.out.println("无效操作：连接未打开");
    }
    
    @Override
    public String getStateName() {
        return "CLOSED";
    }
}

// 已发送同步状态
class SynSentState implements TCPState {
    @Override
    public void open(TCPConnection connection) {
        System.out.println("等待SYN-ACK响应...");
    }
    
    @Override
    public void close(TCPConnection connection) {
        System.out.println("发送RST包");
        connection.setState(new ClosedState());
    }
    
    @Override
    public void acknowledge(TCPConnection connection) {
        System.out.println("收到SYN-ACK，发送ACK");
        connection.setState(new EstablishedState());
    }
    
    @Override
    public String getStateName() {
        return "SYN_SENT";
    }
}

// 已建立状态
class EstablishedState implements TCPState {
    @Override
    public void open(TCPConnection connection) {
        System.out.println("连接已建立，可以传输数据");
    }
    
    @Override
    public void close(TCPConnection connection) {
        System.out.println("发送FIN包");
        connection.setState(new FinWaitState());
    }
    
    @Override
    public void acknowledge(TCPConnection connection) {
        System.out.println("确认数据包");
    }
    
    @Override
    public String getStateName() {
        return "ESTABLISHED";
    }
}

// 等待结束状态
class FinWaitState implements TCPState {
    @Override
    public void open(TCPConnection connection) {
        System.out.println("连接正在关闭过程中");
    }
    
    @Override
    public void close(TCPConnection connection) {
        System.out.println("等待对方确认关闭");
        connection.setState(new ClosedState());
    }
    
    @Override
    public void acknowledge(TCPConnection connection) {
        System.out.println("收到对方FIN确认");
        connection.setState(new ClosedState());
    }
    
    @Override
    public String getStateName() {
        return "FIN_WAIT";
    }
}

// TCP连接类
class TCPConnection {
    private TCPState state;
    
    public TCPConnection() {
        this.state = new ClosedState();
        System.out.println("TCP连接初始化，状态: " + state.getStateName());
    }
    
    public void setState(TCPState state) {
        this.state = state;
    }
    
    public void open() {
        state.open(this);
    }
    
    public void close() {
        state.close(this);
    }
    
    public void acknowledge() {
        state.acknowledge(this);
    }
    
    public String getCurrentState() {
        return state.getStateName();
    }
}
```

### 游戏角色状态示例

```java
// 角色状态接口
interface CharacterState {
    void move(GameCharacter character);
    void attack(GameCharacter character);
    void takeDamage(GameCharacter character, int damage);
    void useSpecial(GameCharacter character);
    String getStateName();
}

// 正常状态
class NormalState implements CharacterState {
    @Override
    public void move(GameCharacter character) {
        System.out.println(character.getName() + " 正常移动");
        character.setX(character.getX() + 1);
    }
    
    @Override
    public void attack(GameCharacter character) {
        System.out.println(character.getName() + " 进行普通攻击");
        // 攻击逻辑
    }
    
    @Override
    public void takeDamage(GameCharacter character, int damage) {
        int currentHp = character.getHp();
        int newHp = Math.max(0, currentHp - damage);
        character.setHp(newHp);
        System.out.println(character.getName() + " 受到 " + damage + " 点伤害，剩余血量: " + newHp);
        
        if (newHp <= 0) {
            character.setState(new DeadState());
        } else if (newHp < 30) { // 血量低于30%进入虚弱状态
            character.setState(new WeakState());
        }
    }
    
    @Override
    public void useSpecial(GameCharacter character) {
        if (character.getEnergy() >= 50) {
            System.out.println(character.getName() + " 使用特殊技能");
            character.setEnergy(character.getEnergy() - 50);
        } else {
            System.out.println(character.getName() + " 能量不足，无法使用特殊技能");
        }
    }
    
    @Override
    public String getStateName() {
        return "正常";
    }
}

// 虚弱状态
class WeakState implements CharacterState {
    @Override
    public void move(GameCharacter character) {
        System.out.println(character.getName() + " 缓慢移动（虚弱状态）");
        character.setX(character.getX() + 0.5); // 移动速度减半
    }
    
    @Override
    public void attack(GameCharacter character) {
        System.out.println(character.getName() + " 弱力攻击（虚弱状态）");
        // 攻击力降低
    }
    
    @Override
    public void takeDamage(GameCharacter character, int damage) {
        int currentHp = character.getHp();
        int newHp = Math.max(0, currentHp - damage);
        character.setHp(newHp);
        System.out.println(character.getName() + " （虚弱状态）受到 " + damage + " 点伤害，剩余血量: " + newHp);
        
        if (newHp <= 0) {
            character.setState(new DeadState());
        }
    }
    
    @Override
    public void useSpecial(GameCharacter character) {
        System.out.println(character.getName() + " 体力不支，无法使用特殊技能");
    }
    
    @Override
    public String getStateName() {
        return "虚弱";
    }
}

// 死亡状态
class DeadState implements CharacterState {
    @Override
    public void move(GameCharacter character) {
        System.out.println(character.getName() + " 已死亡，无法移动");
    }
    
    @Override
    public void attack(GameCharacter character) {
        System.out.println(character.getName() + " 已死亡，无法攻击");
    }
    
    @Override
    public void takeDamage(GameCharacter character, int damage) {
        System.out.println(character.getName() + " 已死亡");
    }
    
    @Override
    public void useSpecial(GameCharacter character) {
        System.out.println(character.getName() + " 已死亡，无法使用技能");
    }
    
    @Override
    public String getStateName() {
        return "死亡";
    }
}

// 游戏角色类
class GameCharacter {
    private String name;
    private CharacterState state;
    private int hp;
    private int energy;
    private double x, y; // 位置
    
    public GameCharacter(String name) {
        this.name = name;
        this.state = new NormalState();
        this.hp = 100;
        this.energy = 100;
        this.x = 0;
        this.y = 0;
        System.out.println("角色 " + name + " 创建，初始状态: " + state.getStateName());
    }
    
    public void setState(CharacterState state) {
        CharacterState oldState = this.state;
        this.state = state;
        System.out.println(name + " 状态从 " + oldState.getStateName() + 
                          " 变更为 " + state.getStateName());
    }
    
    public void move() { state.move(this); }
    public void attack() { state.attack(this); }
    public void takeDamage(int damage) { state.takeDamage(this, damage); }
    public void useSpecial() { state.useSpecial(this); }
    
    // Getter和Setter方法
    public String getName() { return name; }
    public CharacterState getState() { return state; }
    public int getHp() { return hp; }
    public void setHp(int hp) { this.hp = hp; }
    public int getEnergy() { return energy; }
    public void setEnergy(int energy) { this.energy = energy; }
    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
    public double getY() { return y; }
    public void setY(double y) { this.y = y; }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 简单开关示例 ===");
        
        Light light = new Light();
        light.pressSwitch(); // 打开灯
        light.pressSwitch(); // 关闭灯
        light.pressSwitch(); // 打开灯
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 投币机示例 ===");
        
        VendingMachine machine = new VendingMachine();
        machine.showInventory();
        
        System.out.println("\n--- 操作流程 ---");
        
        // 尝试选择商品但没有投币
        machine.selectProduct("可乐");
        
        // 投币
        machine.insertMoney(1); // 金额不足
        machine.selectProduct("可乐"); // 仍需投币
        
        machine.insertMoney(2); // 现在有3元，可乐价格3元
        machine.selectProduct("可乐");
        machine.dispenseProduct();
        
        System.out.println();
        
        // 再次购买
        machine.insertMoney(5);
        machine.selectProduct("雪碧");
        machine.dispenseProduct();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 文档编辑器示例 ===");
        
        DocumentEditor editor = new DocumentEditor("我的文档");
        
        editor.edit("这是文档的初始内容");
        editor.save();
        editor.share();
        editor.edit("添加一些新内容");
        editor.publish();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== TCP连接示例 ===");
        
        TCPConnection connection = new TCPConnection();
        
        System.out.println("连接状态: " + connection.getCurrentState());
        connection.open();
        System.out.println("连接状态: " + connection.getCurrentState());
        connection.acknowledge();
        System.out.println("连接状态: " + connection.getCurrentState());
        connection.close();
        System.out.println("连接状态: " + connection.getCurrentState());
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 游戏角色状态示例 ===");
        
        GameCharacter player = new GameCharacter("勇士");
        
        player.move();
        player.attack();
        player.useSpecial();
        
        System.out.println("\n受到大量伤害:");
        player.takeDamage(80); // 进入虚弱状态
        player.move();
        player.attack();
        
        System.out.println("\n再次受到伤害:");
        player.takeDamage(25); // 死亡
        player.move();
        player.attack();
        
        System.out.println("\n恢复生命值（假设使用复活道具）:");
        player.setHp(50);
        player.setState(new NormalState()); // 恢复正常状态
        player.move();
        player.attack();
    }
}
```

## 状态模式的优缺点

### 优点
1. 封装了转换规则，将状态转换逻辑从庞大的条件语句中分离出来
2. 每个状态的行为都在对应的具体状态类中实现，便于维护和扩展
3. 允许状态转换变得明确
4. 状态对象可以被共享

### 缸点
1. 增加了系统类和对象的个数
2. 结构复杂，状态较多时维护困难
3. 需要预先知道所有状态

## 状态模式 vs 策略模式

### 状态模式
- 关注对象状态的变化
- 状态转换是自动的
- 对象的行为随状态改变而改变

### 策略模式
- 关注算法的选择和替换
- 算法选择是手动的
- 同一时间只使用一种策略

## 总结

状态模式就像程序界的"千面人"——它让对象可以根据自己的状态来改变行为，就像一个人在不同情绪下会有不同表现一样。状态模式将特定于状态的行为局部化，并且使得状态转换变得显式。

记住：**状态模式适用于对象行为依赖于其状态，并且需要在运行时根据状态改变行为的场景！**

在实际开发中，状态模式被广泛应用于：
- 工作流系统
- 游戏角色状态管理
- 网络协议状态机
- 订单状态管理
- UI界面状态管理等