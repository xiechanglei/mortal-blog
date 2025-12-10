# 命令模式 (Command Pattern) - 程序界的“遥控器”

## 什么是命令模式？

想象一下，你手里有一个万能遥控器，按下电源键，电视开启；按下音量键，声音变大；按下频道键，切换频道。遥控器并不直接执行这些操作，而是将你的请求封装成一个命令发送给电视。命令模式就是这样——它将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化。

**命令模式**将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化，对请求排队或记录请求日志，以及支持可撤销的操作。

## 为什么需要命令模式？

在以下场景中，命令模式特别有用：

1. 需要抽象出待执行的动作，以便参数化某对象
2. 在不同的时刻指定、排列和执行请求
3. 需要支持撤销操作
4. 需要将请求记录在日志中，以便支持系统恢复
5. 需要支持请求的排队执行

## 命令模式的实现

### 基础命令结构

```java
// 接收者 - 真正执行操作的对象
class Light {
    private String location;
    private boolean on = false;
    
    public Light(String location) {
        this.location = location;
    }
    
    public void on() {
        on = true;
        System.out.println(location + " 灯已开启");
    }
    
    public void off() {
        on = false;
        System.out.println(location + " 灯已关闭");
    }
    
    public boolean isOn() {
        return on;
    }
    
    public String getLocation() {
        return location;
    }
}

// 命令接口
interface Command {
    void execute();
    void undo(); // 用于撤销操作
}

// 具体命令 - 开灯命令
class LightOnCommand implements Command {
    private Light light;
    private boolean previousState; // 用于撤销
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        previousState = light.isOn();
        light.on();
    }
    
    @Override
    public void undo() {
        if (previousState) {
            light.on(); // 如果之前是开的，保持开启
        } else {
            light.off(); // 如果之前是关的，现在关闭
        }
    }
}

// 具体命令 - 关灯命令
class LightOffCommand implements Command {
    private Light light;
    private boolean previousState; // 用于撤销
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        previousState = light.isOn();
        light.off();
    }
    
    @Override
    public void undo() {
        if (previousState) {
            light.on(); // 如果之前是开的，现在开启
        } else {
            light.off(); // 如果之前是关的，保持关闭
        }
    }
}
```

### 命令模式核心 - 调用者

```java
import java.util.Stack;

// 遥控器 - 命令的调用者
class RemoteControl {
    private Command[] onCommands;    // 开启命令数组
    private Command[] offCommands;   // 关闭命令数组
    private Stack<Command> undoStack; // 撤销栈
    
    public RemoteControl() {
        onCommands = new Command[7];
        offCommands = new Command[7];
        undoStack = new Stack<>();
        
        // 初始化为空命令，避免null检查
        Command noCommand = new NoCommand();
        for (int i = 0; i < 7; i++) {
            onCommands[i] = noCommand;
            offCommands[i] = noCommand;
        }
    }
    
    // 设置命令
    public void setCommand(int slot, Command onCommand, Command offCommand) {
        onCommands[slot] = onCommand;
        offCommands[slot] = offCommand;
    }
    
    // 按下开启按钮
    public void onButtonWasPushed(int slot) {
        onCommands[slot].execute();
        undoStack.push(onCommands[slot]);
    }
    
    // 按下关闭按钮
    public void offButtonWasPushed(int slot) {
        offCommands[slot].execute();
        undoStack.push(offCommands[slot]);
    }
    
    // 撤销操作
    public void undoButtonWasPushed() {
        if (!undoStack.isEmpty()) {
            Command command = undoStack.pop();
            System.out.println("执行撤销操作...");
            command.undo();
        } else {
            System.out.println("没有可撤销的操作");
        }
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n------ 遥控器 ------\n");
        for (int i = 0; i < onCommands.length; i++) {
            sb.append("[按钮 ").append(i).append("] ")
              .append(onCommands[i].getClass().getSimpleName())
              .append("    ")
              .append(offCommands[i].getClass().getSimpleName())
              .append("\n");
        }
        return sb.toString();
    }
}

// 空命令 - 用于避免null检查
class NoCommand implements Command {
    @Override
    public void execute() {
        // 什么都不做
    }
    
    @Override
    public void undo() {
        // 什么都不做
    }
}
```

### 复杂命令示例

```java
// 更复杂的接收者 - 音响系统
class Stereo {
    private String location;
    private int volume;
    private boolean on;
    
    public Stereo(String location) {
        this.location = location;
        this.volume = 10;
        this.on = false;
    }
    
    public void on() {
        on = true;
        System.out.println(location + " 音响已开启");
    }
    
    public void off() {
        on = false;
        System.out.println(location + " 音响已关闭");
    }
    
    public void setCD() {
        System.out.println(location + " 音响设置为CD模式");
    }
    
    public void setDVD() {
        System.out.println(location + " 音响设置为DVD模式");
    }
    
    public void setRadio() {
        System.out.println(location + " 音响设置为收音机模式");
    }
    
    public void setVolume(int volume) {
        this.volume = volume;
        System.out.println(location + " 音响音量设置为 " + volume);
    }
    
    public int getVolume() {
        return volume;
    }
    
    public boolean isOn() {
        return on;
    }
}

// 复合命令 - 开启音响的多个子命令
class StereoOnWithCDCommand implements Command {
    private Stereo stereo;
    private int previousVolume;
    private boolean previousOnState;
    
    public StereoOnWithCDCommand(Stereo stereo) {
        this.stereo = stereo;
    }
    
    @Override
    public void execute() {
        previousOnState = stereo.isOn();
        previousVolume = stereo.getVolume();
        
        stereo.on();
        stereo.setCD();
        stereo.setVolume(11);
    }
    
    @Override
    public void undo() {
        if (previousOnState) {
            stereo.on();
            stereo.setVolume(previousVolume);
        } else {
            stereo.off();
        }
    }
}

// 复合命令 - 关闭音响
class StereoOffCommand implements Command {
    private Stereo stereo;
    private int previousVolume;
    private boolean previousOnState;
    
    public StereoOffCommand(Stereo stereo) {
        this.stereo = stereo;
    }
    
    @Override
    public void execute() {
        previousOnState = stereo.isOn();
        previousVolume = stereo.getVolume();
        
        stereo.off();
    }
    
    @Override
    public void undo() {
        if (previousOnState) {
            stereo.on();
            stereo.setVolume(previousVolume);
        } else {
            stereo.off();
        }
    }
}
```

## 实际应用场景

### 文本编辑器命令示例

```java
// 文本编辑器接收者
class TextEditor {
    private StringBuilder content;
    private String clipboard;
    
    public TextEditor() {
        this.content = new StringBuilder();
        this.clipboard = "";
    }
    
    public void insertText(String text, int position) {
        if (position >= 0 && position <= content.length()) {
            content.insert(position, text);
            System.out.println("插入文本: \"" + text + "\" 在位置 " + position);
        }
    }
    
    public void deleteText(int start, int end) {
        if (start >= 0 && end <= content.length() && start < end) {
            String deleted = content.substring(start, end);
            content.delete(start, end);
            System.out.println("删除文本: \"" + deleted + "\" 位置 " + start + "-" + end);
        }
    }
    
    public void copyText(int start, int end) {
        if (start >= 0 && end <= content.length() && start < end) {
            clipboard = content.substring(start, end);
            System.out.println("复制文本: \"" + clipboard + "\"");
        }
    }
    
    public void pasteText(int position) {
        if (position >= 0 && position <= content.length()) {
            content.insert(position, clipboard);
            System.out.println("在位置 " + position + " 粘贴文本: \"" + clipboard + "\"");
        }
    }
    
    public void clear() {
        content.setLength(0);
        System.out.println("清空文本");
    }
    
    public String getContent() {
        return content.toString();
    }
    
    public String getClipboard() {
        return clipboard;
    }
}

// 插入文本命令
class InsertTextCommand implements Command {
    private TextEditor editor;
    private String text;
    private int position;
    private String previousContent;
    
    public InsertTextCommand(TextEditor editor, String text, int position) {
        this.editor = editor;
        this.text = text;
        this.position = position;
    }
    
    @Override
    public void execute() {
        previousContent = editor.getContent();
        editor.insertText(text, position);
    }
    
    @Override
    public void undo() {
        editor.clear();
        editor.insertText(previousContent, 0);
    }
}

// 删除文本命令
class DeleteTextCommand implements Command {
    private TextEditor editor;
    private int start;
    private int end;
    private String deletedText;
    private String previousContent;
    
    public DeleteTextCommand(TextEditor editor, int start, int end) {
        this.editor = editor;
        this.start = start;
        this.end = end;
    }
    
    @Override
    public void execute() {
        previousContent = editor.getContent();
        deletedText = editor.getContent().substring(start, end);
        editor.deleteText(start, end);
    }
    
    @Override
    public void undo() {
        // 在撤销时，我们需要将删除的文本重新插入
        // 但位置需要根据内容变化调整
        editor.clear();
        editor.insertText(previousContent, 0);
    }
}

// 复合命令 - 宏命令
class MacroCommand implements Command {
    private Command[] commands;
    
    public MacroCommand(Command[] commands) {
        this.commands = commands;
    }
    
    @Override
    public void execute() {
        for (Command command : commands) {
            if (command != null) {
                command.execute();
            }
        }
    }
    
    @Override
    public void undo() {
        // 倒序撤销
        for (int i = commands.length - 1; i >= 0; i--) {
            if (commands[i] != null) {
                commands[i].undo();
            }
        }
    }
}
```

### 烘焙店订单系统示例

```java
import java.util.*;

// 烘焙店接收者
class Bakery {
    private String name;
    private List<String> orders;
    
    public Bakery(String name) {
        this.name = name;
        this.orders = new ArrayList<>();
    }
    
    public void prepareCake(String type) {
        System.out.println(name + " 开始制作蛋糕: " + type);
        orders.add("蛋糕: " + type);
    }
    
    public void bakeBread(String type) {
        System.out.println(name + " 开始烘焙面包: " + type);
        orders.add("面包: " + type);
    }
    
    public void decorateCookie(String type) {
        System.out.println(name + " 开始装饰饼干: " + type);
        orders.add("饼干: " + type);
    }
    
    public void packageOrder() {
        System.out.println(name + " 打包所有订单");
        orders.clear();
    }
    
    public void processPayment(double amount) {
        System.out.println(name + " 处理付款: ¥" + amount);
    }
    
    public List<String> getOrders() {
        return new ArrayList<>(orders);
    }
}

// 制作蛋糕命令
class PrepareCakeCommand implements Command {
    private Bakery bakery;
    private String cakeType;
    private boolean executed = false;
    
    public PrepareCakeCommand(Bakery bakery, String cakeType) {
        this.bakery = bakery;
        this.cakeType = cakeType;
    }
    
    @Override
    public void execute() {
        bakery.prepareCake(cakeType);
        executed = true;
    }
    
    @Override
    public void undo() {
        if (executed) {
            System.out.println("撤销制作蛋糕: " + cakeType);
            List<String> orders = bakery.getOrders();
            orders.removeIf(order -> order.equals("蛋糕: " + cakeType));
            executed = false;
        }
    }
}

// 烘焙面包命令
class BakeBreadCommand implements Command {
    private Bakery bakery;
    private String breadType;
    private boolean executed = false;
    
    public BakeBreadCommand(Bakery bakery, String breadType) {
        this.bakery = bakery;
        this.breadType = breadType;
    }
    
    @Override
    public void execute() {
        bakery.bakeBread(breadType);
        executed = true;
    }
    
    @Override
    public void undo() {
        if (executed) {
            System.out.println("撤销烘焙面包: " + breadType);
            List<String> orders = bakery.getOrders();
            orders.removeIf(order -> order.equals("面包: " + breadType));
            executed = false;
        }
    }
}

// 完整订单命令
class CompleteOrderCommand implements Command {
    private Bakery bakery;
    private double amount;
    private List<String> previousOrders;
    
    public CompleteOrderCommand(Bakery bakery, double amount) {
        this.bakery = bakery;
        this.amount = amount;
    }
    
    @Override
    public void execute() {
        previousOrders = bakery.getOrders();
        bakery.packageOrder();
        bakery.processPayment(amount);
    }
    
    @Override
    public void undo() {
        System.out.println("撤销订单完成操作");
        // 恢复之前的订单状态
        System.out.println("订单状态已恢复到打包前");
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 基础家居自动化示例 ===");
        
        // 创建接收者
        Light livingRoomLight = new Light("客厅");
        Light kitchenLight = new Light("厨房");
        Stereo stereo = new Stereo("客厅");
        
        // 创建命令
        LightOnCommand livingRoomLightOn = new LightOnCommand(livingRoomLight);
        LightOffCommand livingRoomLightOff = new LightOffCommand(livingRoomLight);
        LightOnCommand kitchenLightOn = new LightOnCommand(kitchenLight);
        LightOffCommand kitchenLightOff = new LightOffCommand(kitchenLight);
        StereoOnWithCDCommand stereoOn = new StereoOnWithCDCommand(stereo);
        StereoOffCommand stereoOff = new StereoOffCommand(stereo);
        
        // 创建遥控器
        RemoteControl remoteControl = new RemoteControl();
        
        // 设置命令
        remoteControl.setCommand(0, livingRoomLightOn, livingRoomLightOff);
        remoteControl.setCommand(1, kitchenLightOn, kitchenLightOff);
        remoteControl.setCommand(2, stereoOn, stereoOff);
        
        System.out.println(remoteControl);
        
        // 执行命令
        remoteControl.onButtonWasPushed(0);
        remoteControl.offButtonWasPushed(0);
        remoteControl.onButtonWasPushed(1);
        remoteControl.onButtonWasPushed(2);
        remoteControl.offButtonWasPushed(2);
        
        System.out.println("\n执行撤销操作...");
        remoteControl.undoButtonWasPushed(); // 撤销关闭音响
        remoteControl.undoButtonWasPushed(); // 撤销开启音响
        remoteControl.undoButtonWasPushed(); // 撤销开启厨房灯
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 文本编辑器示例 ===");
        
        TextEditor editor = new TextEditor();
        
        // 创建命令
        Command insertHello = new InsertTextCommand(editor, "Hello ", 0);
        Command insertWorld = new InsertTextCommand(editor, "World!", 6);
        
        // 执行命令
        insertHello.execute();
        System.out.println("当前内容: " + editor.getContent());
        
        insertWorld.execute();
        System.out.println("当前内容: " + editor.getContent());
        
        // 撤销操作
        System.out.println("执行撤销...");
        // 在实际应用中，我们会把命令保存到栈中，这里简化演示
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 烘焙店示例 ===");
        
        Bakery bakery = new Bakery("甜蜜烘焙屋");
        
        // 创建命令
        Command makeCake = new PrepareCakeCommand(bakery, "生日蛋糕");
        Command makeBread = new BakeBreadCommand(bakery, "全麦面包");
        Command completeOrder = new CompleteOrderCommand(bakery, 128.50);
        
        // 执行订单流程
        makeCake.execute();
        makeBread.execute();
        completeOrder.execute();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 宏命令示例 ===");
        
        // 创建一系列命令
        Command[] commands = {
            new PrepareCakeCommand(bakery, "巧克力蛋糕"),
            new BakeBreadCommand(bakery, "法式面包"),
            new PrepareCakeCommand(bakery, "芝士蛋糕")
        };
        
        MacroCommand macro = new MacroCommand(commands);
        
        System.out.println("执行宏命令（批量制作）:");
        macro.execute();
        
        System.out.println("撤销宏命令:");
        macro.undo();
    }
}
```

## 命令模式的优缺点

### 优点
1. 降低了系统耦合度：调用者和接收者之间解耦
2. 新的命令可以很容易地加入到系统中
3. 可以比较容易地设计一个命令队列
4. 可以比较容易地实现对请求的撤销和恢复
5. 在需要的情况下，可以比较容易地将命令写入日志

### 缺点
1. 使用命令模式可能会导致某些系统有过多的具体命令类
2. 命令模式的结果就是将一些系统行为的实现分散到不同的对象中

## 命令模式 vs 策略模式

### 命令模式
- 封装一个操作
- 关注的是动作的执行
- 通常有execute方法
- 支持撤销/重做功能

### 策略模式
- 封装一个算法或行为
- 关注的是如何完成某个任务
- 通常有algorithm方法
- 用于替换算法

## 总结

命令模式就像程序界的“遥控器”——它将请求封装成对象，使得你可以对请求进行参数化、排队、记录日志，甚至支持撤销操作。就像遥控器可以控制各种家电一样，命令模式让系统可以灵活地处理各种请求。

记住：**命令模式适用于需要将请求发送者和接收者解耦，或者需要支持撤销操作的场景！**

在现代Java开发中，命令模式被广泛应用于：
- GUI事件处理系统
- 撤销/重做功能（如文本编辑器）
- 任务队列系统
- 事务处理系统
- Web框架的请求处理等