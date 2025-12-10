# 备忘录模式 (Memento Pattern) - 程序界的“时光机”

## 什么是备忘录模式？

想象一下，你在玩一个电子游戏，可以通过存档功能保存当前的游戏状态，然后在游戏失败后读取存档恢复到之前的状态。备忘录模式就是这样——它在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样以后就可以将该对象恢复到原先保存的状态。

**备忘录模式**在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样以后就可以将该对象恢复到原先保存的状态。

## 为什么需要备忘录模式？

在以下场景中，备忘录模式特别有用：

1. 需要保存一个对象在某时刻的状态，以便在将来恢复
2. 需要实现撤销/重做功能
3. 需要保存的对象状态信息很多，但只有部分信息需要保存
4. 需要保护封装边界，不让其他对象访问保存的状态

## 备忘录模式的实现

### 基础备忘录结构

```java
// 备忘录类 - 存储原发器的状态
class Memento {
    private String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

// 原发器类 - 需要保存状态的对象
class Originator {
    private String state;
    
    public void setState(String state) {
        System.out.println("设置状态为: " + state);
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    // 创建备忘录，保存当前状态
    public Memento saveStateToMemento() {
        System.out.println("保存状态到备忘录: " + state);
        return new Memento(state);
    }
    
    // 从备忘录恢复状态
    public void getStateFromMemento(Memento memento) {
        this.state = memento.getState();
        System.out.println("从备忘录恢复状态: " + state);
    }
}

// 管理者类 - 负责管理备忘录
class Caretaker {
    private java.util.List<Memento> mementoList = new java.util.ArrayList<>();
    
    public void add(Memento state) {
        mementoList.add(state);
    }
    
    public Memento get(int index) {
        if (index >= 0 && index < mementoList.size()) {
            return mementoList.get(index);
        }
        return null;
    }
    
    public int getHistorySize() {
        return mementoList.size();
    }
    
    public void showHistory() {
        System.out.println("状态历史:");
        for (int i = 0; i < mementoList.size(); i++) {
            System.out.println("  " + i + ": " + mementoList.get(i).getState());
        }
    }
}
```

### 复杂状态备忘录示例

```java
import java.util.*;

// 复杂状态的备忘录
class DocumentMemento {
    private String content;
    private int cursorPosition;
    private List<String> formatOptions;
    private Date timestamp;
    
    public DocumentMemento(String content, int cursorPosition, List<String> formatOptions) {
        this.content = content;
        this.cursorPosition = cursorPosition;
        this.formatOptions = new ArrayList<>(formatOptions);
        this.timestamp = new Date();
    }
    
    // Getter方法
    public String getContent() { return content; }
    public int getCursorPosition() { return cursorPosition; }
    public List<String> getFormatOptions() { return new ArrayList<>(formatOptions); }
    public Date getTimestamp() { return new Date(timestamp.getTime()); }
}

// 文档类
class TextDocument {
    private String content;
    private int cursorPosition;
    private List<String> formatOptions;
    
    public TextDocument() {
        this.content = "";
        this.cursorPosition = 0;
        this.formatOptions = new ArrayList<>();
    }
    
    public void setContent(String content) {
        this.content = content;
        System.out.println("文档内容更新为: " + content);
    }
    
    public void setCursorPosition(int position) {
        this.cursorPosition = Math.min(Math.max(0, position), content.length());
        System.out.println("光标位置设置为: " + cursorPosition);
    }
    
    public void addFormatOption(String option) {
        if (!formatOptions.contains(option)) {
            formatOptions.add(option);
            System.out.println("添加格式选项: " + option);
        }
    }
    
    public void removeFormatOption(String option) {
        if (formatOptions.contains(option)) {
            formatOptions.remove(option);
            System.out.println("移除格式选项: " + option);
        }
    }
    
    public DocumentMemento save() {
        System.out.println("保存文档状态到备忘录");
        return new DocumentMemento(content, cursorPosition, formatOptions);
    }
    
    public void restore(DocumentMemento memento) {
        this.content = memento.getContent();
        this.cursorPosition = memento.getCursorPosition();
        this.formatOptions = memento.getFormatOptions();
        System.out.println("从备忘录恢复文档状态");
        System.out.println("  内容: " + content);
        System.out.println("  光标位置: " + cursorPosition);
        System.out.println("  格式选项: " + formatOptions);
    }
    
    @Override
    public String toString() {
        return "TextDocument{" +
                "content='" + content + '\'' +
                ", cursorPosition=" + cursorPosition +
                ", formatOptions=" + formatOptions +
                '}';
    }
}
```

## 实际应用场景

### 编辑器撤销功能示例

```java
// 编辑器备忘录
class EditorMemento {
    private String text;
    private int selectionStart;
    private int selectionEnd;
    private boolean isBold;
    private boolean isItalic;
    private String font;
    private int fontSize;
    
    public EditorMemento(String text, int selectionStart, int selectionEnd, 
                        boolean isBold, boolean isItalic, String font, int fontSize) {
        this.text = text;
        this.selectionStart = selectionStart;
        this.selectionEnd = selectionEnd;
        this.isBold = isBold;
        this.isItalic = isItalic;
        this.font = font;
        this.fontSize = fontSize;
    }
    
    // Getter方法
    public String getText() { return text; }
    public int getSelectionStart() { return selectionStart; }
    public int getSelectionEnd() { return selectionEnd; }
    public boolean isBold() { return isBold; }
    public boolean isItalic() { return isItalic; }
    public String getFont() { return font; }
    public int getFontSize() { return fontSize; }
}

// 文本编辑器类
class TextEditor {
    private String text;
    private int selectionStart;
    private int selectionEnd;
    private boolean isBold;
    private boolean isItalic;
    private String font;
    private int fontSize;
    
    private java.util.Stack<EditorMemento> undoStack;
    private java.util.Stack<EditorMemento> redoStack;
    
    public TextEditor() {
        this.text = "";
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.isBold = false;
        this.isItalic = false;
        this.font = "Arial";
        this.fontSize = 12;
        
        this.undoStack = new java.util.Stack<>();
        this.redoStack = new java.util.Stack<>();
    }
    
    public void write(String content) {
        saveToUndoStack();
        this.text = content;
        System.out.println("写入内容: " + content);
    }
    
    public void setBold(boolean bold) {
        saveToUndoStack();
        this.isBold = bold;
        System.out.println("设置粗体: " + bold);
    }
    
    public void setItalic(boolean italic) {
        saveToUndoStack();
        this.isItalic = italic;
        System.out.println("设置斜体: " + italic);
    }
    
    public void setFont(String font) {
        saveToUndoStack();
        this.font = font;
        System.out.println("设置字体: " + font);
    }
    
    public void setFontSize(int size) {
        saveToUndoStack();
        this.fontSize = size;
        System.out.println("设置字体大小: " + size);
    }
    
    private void saveToUndoStack() {
        // 清空重做栈
        redoStack.clear();
        // 保存当前状态到撤销栈
        undoStack.push(createMemento());
    }
    
    private EditorMemento createMemento() {
        return new EditorMemento(text, selectionStart, selectionEnd, 
                                isBold, isItalic, font, fontSize);
    }
    
    public boolean canUndo() {
        return !undoStack.isEmpty();
    }
    
    public boolean canRedo() {
        return !redoStack.isEmpty();
    }
    
    public void undo() {
        if (canUndo()) {
            EditorMemento previousState = createMemento(); // 保存当前状态用于重做
            EditorMemento stateToRestore = undoStack.pop();
            restoreFromMemento(stateToRestore);
            redoStack.push(previousState);
            System.out.println("执行撤销操作");
        } else {
            System.out.println("无法撤销");
        }
    }
    
    public void redo() {
        if (canRedo()) {
            EditorMemento nextState = createMemento(); // 保存当前状态用于撤销
            EditorMemento stateToRestore = redoStack.pop();
            restoreFromMemento(stateToRestore);
            undoStack.push(nextState);
            System.out.println("执行重做操作");
        } else {
            System.out.println("无法重做");
        }
    }
    
    private void restoreFromMemento(EditorMemento memento) {
        this.text = memento.getText();
        this.selectionStart = memento.getSelectionStart();
        this.selectionEnd = memento.getSelectionEnd();
        this.isBold = memento.isBold();
        this.isItalic = memento.isItalic();
        this.font = memento.getFont();
        this.fontSize = memento.getFontSize();
    }
    
    public void showCurrentState() {
        System.out.println("当前编辑器状态:");
        System.out.println("  内容: " + text);
        System.out.println("  格式: " + (isBold ? "粗体" : "") + " " + (isItalic ? "斜体" : ""));
        System.out.println("  字体: " + font + " " + fontSize + "pt");
    }
}
```

### 游戏存档系统示例

```java
import java.util.*;

// 游戏存档备忘录
class GameMemento {
    private String playerName;
    private int level;
    private int health;
    private int score;
    private int x, y; // 位置坐标
    private List<String> items;
    private Date saveTime;
    
    public GameMemento(String playerName, int level, int health, int score, 
                      int x, int y, List<String> items) {
        this.playerName = playerName;
        this.level = level;
        this.health = health;
        this.score = score;
        this.x = x;
        this.y = y;
        this.items = new ArrayList<>(items);
        this.saveTime = new Date();
    }
    
    // Getter方法
    public String getPlayerName() { return playerName; }
    public int getLevel() { return level; }
    public int getHealth() { return health; }
    public int getScore() { return score; }
    public int getX() { return x; }
    public int getY() { return y; }
    public List<String> getItems() { return new ArrayList<>(items); }
    public Date getSaveTime() { return new Date(saveTime.getTime()); }
}

// 游戏角色类
class GameCharacter {
    private String playerName;
    private int level;
    private int health;
    private int score;
    private int x, y; // 位置
    private List<String> items;
    
    public GameCharacter(String playerName) {
        this.playerName = playerName;
        this.level = 1;
        this.health = 100;
        this.score = 0;
        this.x = 0;
        this.y = 0;
        this.items = new ArrayList<>();
    }
    
    public void levelUp() {
        level++;
        health = Math.min(100, health + 20); // 升级恢复一些血量
        System.out.println(playerName + " 升级到 " + level + " 级！");
    }
    
    public void takeDamage(int damage) {
        health = Math.max(0, health - damage);
        System.out.println(playerName + " 受到 " + damage + " 点伤害，当前血量: " + health);
        if (health <= 0) {
            System.out.println(playerName + " 被击败了！");
        }
    }
    
    public void gainScore(int points) {
        score += points;
        System.out.println(playerName + " 得到 " + points + " 分，总分: " + score);
    }
    
    public void move(int newX, int newY) {
        System.out.println(playerName + " 从 (" + x + "," + y + ") 移动到 (" + newX + "," + newY + ")");
        this.x = newX;
        this.y = newY;
    }
    
    public void addItem(String item) {
        items.add(item);
        System.out.println(playerName + " 获得物品: " + item);
    }
    
    public GameMemento saveGame() {
        System.out.println("保存游戏: " + playerName);
        return new GameMemento(playerName, level, health, score, x, y, items);
    }
    
    public void loadGame(GameMemento memento) {
        this.playerName = memento.getPlayerName();
        this.level = memento.getLevel();
        this.health = memento.getHealth();
        this.score = memento.getScore();
        this.x = memento.getX();
        this.y = memento.getY();
        this.items = memento.getItems();
        System.out.println("恢复游戏: " + playerName);
        System.out.println("  等级: " + level + ", 血量: " + health + ", 分数: " + score);
        System.out.println("  位置: (" + x + "," + y + "), 物品: " + items);
    }
    
    public void showStatus() {
        System.out.println(playerName + " - 等级: " + level + 
                          ", 血量: " + health + ", 分数: " + score + 
                          ", 位置: (" + x + "," + y + ")");
    }
}

// 游戏存档管理器
class GameSaveManager {
    private Map<String, GameMemento> saves;
    
    public GameSaveManager() {
        this.saves = new HashMap<>();
    }
    
    public void saveGame(String slotName, GameMemento memento) {
        saves.put(slotName, memento);
        System.out.println("游戏已保存到槽位: " + slotName);
    }
    
    public GameMemento loadGame(String slotName) {
        GameMemento memento = saves.get(slotName);
        if (memento != null) {
            System.out.println("从槽位 " + slotName + " 加载游戏存档");
        } else {
            System.out.println("槽位 " + slotName + " 不存在存档");
        }
        return memento;
    }
    
    public void listSaves() {
        System.out.println("可用的存档:");
        for (String slotName : saves.keySet()) {
            GameMemento memento = saves.get(slotName);
            System.out.println("  槽位: " + slotName + 
                             ", 玩家: " + memento.getPlayerName() + 
                             ", 等级: " + memento.getLevel() +
                             ", 时间: " + memento.getSaveTime());
        }
    }
}
```

### 数据库事务快照示例

```java
// 简化的数据库记录
class DatabaseRecord {
    private String id;
    private String data;
    private boolean isDeleted;
    
    public DatabaseRecord(String id, String data) {
        this.id = id;
        this.data = data;
        this.isDeleted = false;
    }
    
    public String getId() { return id; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { this.isDeleted = deleted; }
    
    @Override
    public String toString() {
        return "Record{id='" + id + "', data='" + data + "', deleted=" + isDeleted + "}";
    }
}

// 数据库状态备忘录
class DatabaseMemento {
    private Map<String, DatabaseRecord> records;
    
    public DatabaseMemento(Map<String, DatabaseRecord> records) {
        this.records = new HashMap<>();
        // 深拷贝记录
        for (Map.Entry<String, DatabaseRecord> entry : records.entrySet()) {
            DatabaseRecord original = entry.getValue();
            DatabaseRecord copy = new DatabaseRecord(original.getId(), original.getData());
            copy.setDeleted(original.isDeleted());
            this.records.put(entry.getKey(), copy);
        }
    }
    
    public Map<String, DatabaseRecord> getRecords() {
        return new HashMap<>(records);
    }
}

// 简化数据库类
class SimpleDatabase {
    private Map<String, DatabaseRecord> records;
    private java.util.Stack<DatabaseMemento> transactionStack;
    
    public SimpleDatabase() {
        this.records = new HashMap<>();
        this.transactionStack = new java.util.Stack<>();
    }
    
    public void insert(String id, String data) {
        records.put(id, new DatabaseRecord(id, data));
        System.out.println("插入记录: " + id + " -> " + data);
    }
    
    public void update(String id, String newData) {
        DatabaseRecord record = records.get(id);
        if (record != null && !record.isDeleted()) {
            record.setData(newData);
            System.out.println("更新记录: " + id + " -> " + newData);
        }
    }
    
    public void delete(String id) {
        DatabaseRecord record = records.get(id);
        if (record != null) {
            record.setDeleted(true);
            System.out.println("删除记录: " + id);
        }
    }
    
    public DatabaseRecord find(String id) {
        return records.get(id);
    }
    
    public void beginTransaction() {
        transactionStack.push(new DatabaseMemento(records));
        System.out.println("开始事务");
    }
    
    public void commit() {
        if (!transactionStack.isEmpty()) {
            transactionStack.pop();
            System.out.println("提交事务");
        }
    }
    
    public void rollback() {
        if (!transactionStack.isEmpty()) {
            DatabaseMemento memento = transactionStack.pop();
            this.records = memento.getRecords();
            System.out.println("回滚事务，恢复到之前状态");
        } else {
            System.out.println("没有事务可以回滚");
        }
    }
    
    public void showAllRecords() {
        System.out.println("当前数据库记录:");
        for (DatabaseRecord record : records.values()) {
            if (!record.isDeleted()) {
                System.out.println("  " + record);
            }
        }
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 基础备忘录示例 ===");
        
        Originator originator = new Originator();
        Caretaker caretaker = new Caretaker();
        
        originator.setState("状态 #1");
        originator.setState("状态 #2");
        caretaker.add(originator.saveStateToMemento());
        
        originator.setState("状态 #3");
        caretaker.add(originator.saveStateToMemento());
        
        originator.setState("状态 #4");
        
        System.out.println("\n当前状态: " + originator.getState());
        caretaker.showHistory();
        
        System.out.println("\n恢复到状态 #2:");
        originator.getStateFromMemento(caretaker.get(0));
        
        System.out.println("\n恢复到状态 #3:");
        originator.getStateFromMemento(caretaker.get(1));
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 文档备忘录示例 ===");
        
        TextDocument document = new TextDocument();
        
        document.setContent("这是第一行内容");
        document.setCursorPosition(10);
        DocumentMemento memento1 = document.save();
        
        document.setContent("这是第一行内容，这是第二行内容");
        document.addFormatOption("粗体");
        DocumentMemento memento2 = document.save();
        
        document.addFormatOption("斜体");
        document.setCursorPosition(5);
        
        System.out.println("\n当前文档状态:");
        System.out.println(document);
        
        System.out.println("\n恢复到第一个状态:");
        document.restore(memento1);
        
        System.out.println("\n恢复到第二个状态:");
        document.restore(memento2);
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 编辑器撤销重做示例 ===");
        
        TextEditor editor = new TextEditor();
        
        editor.write("Hello World");
        editor.setFont("Times New Roman");
        editor.setBold(true);
        
        editor.showCurrentState();
        System.out.println();
        
        editor.setItalic(true);
        editor.setFontSize(14);
        
        editor.showCurrentState();
        System.out.println();
        
        // 撤销操作
        editor.undo();
        editor.showCurrentState();
        System.out.println();
        
        editor.undo();
        editor.showCurrentState();
        System.out.println();
        
        // 重做操作
        editor.redo();
        editor.showCurrentState();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 游戏存档示例 ===");
        
        GameCharacter player = new GameCharacter("勇者");
        GameSaveManager saveManager = new GameSaveManager();
        
        player.showStatus();
        player.levelUp();
        player.gainScore(100);
        player.addItem("剑");
        player.move(10, 20);
        player.takeDamage(20);
        
        // 保存游戏
        GameMemento save1 = player.saveGame();
        saveManager.saveGame("快速存档", save1);
        
        System.out.println("\n继续游戏...");
        player.levelUp();
        player.gainScore(200);
        player.addItem("盾");
        player.move(15, 25);
        player.takeDamage(30);
        
        player.showStatus();
        
        // 加载存档
        GameMemento savedMemento = saveManager.loadGame("快速存档");
        if (savedMemento != null) {
            player.loadGame(savedMemento);
        }
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 数据库事务示例 ===");
        
        SimpleDatabase db = new SimpleDatabase();
        
        db.insert("1", "用户A的数据");
        db.insert("2", "用户B的数据");
        db.showAllRecords();
        
        System.out.println("\n开始事务，进行一些修改...");
        db.beginTransaction();
        
        db.update("1", "用户A的更新数据");
        db.insert("3", "用户C的数据");
        db.delete("2");
        db.showAllRecords();
        
        System.out.println("\n回滚事务...");
        db.rollback();
        db.showAllRecords();
        
        System.out.println("\n重新开始事务...");
        db.beginTransaction();
        
        db.update("1", "用户A的最终数据");
        db.showAllRecords();
        
        System.out.println("\n提交事务...");
        db.commit();
        db.showAllRecords();
    }
}
```

## 备忘录模式的优缺点

### 优点
1. 给用户提供了一种可以恢复状态的机制
2. 实现了信息的封装，使用户不需要关心状态保存的细节
3. 简化了原发器类，把历史状态的管理任务交给备忘录和管理者

### 缺点
1. 消耗资源，如果原发器类的成员变量太多，会占用大量内存
2. 当需要保存的状态很多时，管理起来会很复杂
3. 可能导致性能问题，特别是在频繁保存和恢复状态时

## 备忘录模式的结构

备忘录模式通常包含以下角色：

1. **Originator（原发器）**：创建一个备忘录，用以记录当前时刻的内部状态，使用备忘录来恢复内部状态
2. **Memento（备忘录）**：负责存储原发器对象的内部状态，并可以防止原发器以外的其他对象访问备忘录
3. **Caretaker（管理者）**：负责保存好备忘录，不能对备忘录的内容进行操作或检查

## 总结

备忘录模式就像程序界的"时光机"——它能够保存对象在某个时刻的状态，并在需要的时候恢复到该状态。就像游戏的存档功能一样，备忘录模式让程序能够"时光倒流"回到过去的状态。

记住：**备忘录模式适用于需要保存和恢复对象状态的场景，但要注意状态数据的大小和内存消耗问题！**

在实际开发中，备忘录模式被广泛应用于：
- 文本编辑器的撤销/重做功能
- 游戏的存档/读档系统
- 数据库事务的回滚机制
- 图形界面的命令模式结合
- 版本控制系统的快照功能等