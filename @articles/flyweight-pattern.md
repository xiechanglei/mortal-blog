# 享元模式 (Flyweight Pattern) - 程序界的“共享经济”

## 什么是享元模式？

想象一下，你正在开发一个文字处理软件，每输入一个字符就要创建一个对象来表示它。如果一个文档有100万个字符，你就要创建100万个对象。但如果这些字符中有很多重复的（比如字母'a'出现了100次），难道要为每个'a'都创建一个新对象吗？

享元模式就像程序界的“共享经济”——它通过共享对象来有效地支持大量细粒度的对象。享元模式将对象的状态分为内部状态和外部状态，内部状态可以共享，外部状态需要外部传入。

**享元模式**运用共享技术有效地支持大量细粒度的对象。

## 为什么需要享元模式？

当你遇到以下情况时，享元模式就派上用场了：

1. 一个应用程序使用了大量的对象
2. 完全由于使用大量的对象，造成很大的存储开销
3. 对象的大多数状态都可变为外部状态
4. 如果删除对象的外部状态，那么可以用相对较少的共享对象取代很多组对象

## 享元模式的实现

### 字符对象示例

```java
import java.util.HashMap;
import java.util.Map;

// 享元接口
interface Character {
    void display(int fontSize, String fontColor, int x, int y);
}

// 具体享元类 - 字符对象
class ConcreteCharacter implements Character {
    private char symbol;        // 内部状态 - 可以共享
    private String fontFamily;  // 内部状态 - 可以共享
    
    public ConcreteCharacter(char symbol, String fontFamily) {
        this.symbol = symbol;
        this.fontFamily = fontFamily;
    }
    
    @Override
    public void display(int fontSize, String fontColor, int x, int y) {
        System.out.println("字符: " + symbol + 
                          ", 字体: " + fontFamily + 
                          ", 大小: " + fontSize + 
                          ", 颜色: " + fontColor + 
                          ", 位置: (" + x + "," + y + ")");
    }
}

// 享元工厂
class CharacterFactory {
    private static Map<String, Character> characterPool = new HashMap<>();
    
    public static Character getCharacter(char symbol, String fontFamily) {
        String key = symbol + "_" + fontFamily;
        
        Character character = characterPool.get(key);
        if (character == null) {
            character = new ConcreteCharacter(symbol, fontFamily);
            characterPool.put(key, character);
            System.out.println("创建新字符对象: " + key);
        } else {
            System.out.println("复用字符对象: " + key);
        }
        
        return character;
    }
    
    public static int getPoolSize() {
        return characterPool.size();
    }
}
```

### 树形对象示例（森林场景）

```java
// 享元接口 - 树
interface Tree {
    void draw(int x, int y, int width, int height);
    String getType();
}

// 具体享元类 - 树类型
class TreeType implements Tree {
    private String name;        // 内部状态
    private String color;       // 内部状态
    private String texture;     // 内部状态
    
    public TreeType(String name, String color, String texture) {
        this.name = name;
        this.color = color;
        this.texture = texture;
    }
    
    @Override
    public void draw(int x, int y, int width, int height) {
        System.out.println("绘制" + name + "树: 位置(" + x + "," + y + 
                          "), 尺寸(" + width + "x" + height + 
                          "), 颜色: " + color + ", 纹理: " + texture);
    }
    
    @Override
    public String getType() {
        return name;
    }
}

// 享元工厂 - 树工厂
class TreeTypeFactory {
    private static Map<String, Tree> treeTypes = new HashMap<>();
    
    public static Tree getTreeType(String name, String color, String texture) {
        String key = name + "_" + color + "_" + texture;
        
        Tree treeType = treeTypes.get(key);
        if (treeType == null) {
            treeType = new TreeType(name, color, texture);
            treeTypes.put(key, treeType);
            System.out.println("创建新树类型: " + key);
        }
        
        return treeType;
    }
    
    public static int getCreatedTypesCount() {
        return treeTypes.size();
    }
}

// 非享元类 - 具体的树实例
class TreeInstance {
    private Tree treeType;  // 享元对象
    private int x, y;       // 外部状态
    private int width, height; // 外部状态
    
    public TreeInstance(Tree treeType, int x, int y, int width, int height) {
        this.treeType = treeType;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    public void draw() {
        treeType.draw(x, y, width, height);
    }
}
```

## 实际应用场景

### 文本编辑器示例

```java
import java.util.*;

// 文本字符类
class TextCharacter {
    private char character;     // 内部状态
    private String fontFamily;  // 内部状态
    private int fontSize;       // 内部状态
    private String color;       // 内部状态
    
    public TextCharacter(char character, String fontFamily, int fontSize, String color) {
        this.character = character;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
    }
    
    public void display(int x, int y) {
        System.out.println("字符: '" + character + 
                          "' 位置: (" + x + "," + y + 
                          ") 格式: " + fontFamily + 
                          " " + fontSize + "pt " + color);
    }
    
    // 用于享元工厂的键
    public String getKey() {
        return character + "_" + fontFamily + "_" + fontSize + "_" + color;
    }
}

// 享元工厂 - 文本字符工厂
class TextCharacterFactory {
    private static Map<String, TextCharacter> characterPool = new HashMap<>();
    
    public static TextCharacter getCharacter(char character, String fontFamily, 
                                           int fontSize, String color) {
        String key = character + "_" + fontFamily + "_" + fontSize + "_" + color;
        
        TextCharacter textChar = characterPool.get(key);
        if (textChar == null) {
            textChar = new TextCharacter(character, fontFamily, fontSize, color);
            characterPool.put(key, textChar);
        }
        
        return textChar;
    }
    
    public static int getPoolSize() {
        return characterPool.size();
    }
    
    public static void clearCache() {
        characterPool.clear();
    }
}

// 文本编辑器
class TextEditor {
    private List<TextCharInstance> characters = new ArrayList<>();
    
    public void addCharacter(char c, String fontFamily, int fontSize, 
                           String color, int x, int y) {
        TextCharacter sharedChar = TextCharacterFactory.getCharacter(
            c, fontFamily, fontSize, color);
        
        TextCharInstance instance = new TextCharInstance(sharedChar, x, y);
        characters.add(instance);
    }
    
    public void render() {
        for (TextCharInstance instance : characters) {
            instance.render();
        }
    }
    
    public void printPoolInfo() {
        System.out.println("字符池大小: " + TextCharacterFactory.getPoolSize());
        System.out.println("字符实例总数: " + characters.size());
    }
}

// 文本字符实例（非享元）
class TextCharInstance {
    private TextCharacter character;
    private int x, y;
    
    public TextCharInstance(TextCharacter character, int x, int y) {
        this.character = character;
        this.x = x;
        this.y = y;
    }
    
    public void render() {
        character.display(x, y);
    }
}
```

### 游戏棋子示例

```java
// 棋子接口
interface ChessPiece {
    void display(int row, int col);
    String getType();
    String getColor();
}

// 具体享元 - 棋子类型
class ConcreteChessPiece implements ChessPiece {
    private String type;    // 内部状态：棋子类型
    private String color;   // 内部状态：棋子颜色
    private String icon;    // 内部状态：棋子图标
    
    public ConcreteChessPiece(String type, String color, String icon) {
        this.type = type;
        this.color = color;
        this.icon = icon;
    }
    
    @Override
    public void display(int row, int col) {
        System.out.println("显示棋子: " + type + 
                          " 颜色: " + color + 
                          " 位置: (" + row + "," + col + 
                          ") 图标: " + icon);
    }
    
    @Override
    public String getType() {
        return type;
    }
    
    @Override
    public String getColor() {
        return color;
    }
}

// 享元工厂 - 棋子工厂
class ChessPieceFactory {
    private static Map<String, ChessPiece> pieces = new HashMap<>();
    
    public static ChessPiece getChessPiece(String type, String color) {
        String key = type + "_" + color;
        ChessPiece piece = pieces.get(key);
        
        if (piece == null) {
            String icon = getIconForType(type);
            piece = new ConcreteChessPiece(type, color, icon);
            pieces.put(key, piece);
            System.out.println("创建新的棋子类型: " + key);
        }
        
        return piece;
    }
    
    private static String getIconForType(String type) {
        switch (type) {
            case "pawn": return "♙";
            case "rook": return "♖";
            case "knight": return "♘";
            case "bishop": return "♗";
            case "queen": return "♕";
            case "king": return "♔";
            default: return "?";
        }
    }
    
    public static int getPiecesCreated() {
        return pieces.size();
    }
}

// 棋盘 - 使用棋子
class ChessBoard {
    private ChessPiece[][] board = new ChessPiece[8][8];
    
    public void setupBoard() {
        // 设置白方棋子
        for (int col = 0; col < 8; col++) {
            board[1][col] = ChessPieceFactory.getChessPiece("pawn", "white");
        }
        board[0][0] = ChessPieceFactory.getChessPiece("rook", "white");
        board[0][7] = ChessPieceFactory.getChessPiece("rook", "white");
        board[0][1] = ChessPieceFactory.getChessPiece("knight", "white");
        board[0][6] = ChessPieceFactory.getChessPiece("knight", "white");
        board[0][2] = ChessPieceFactory.getChessPiece("bishop", "white");
        board[0][5] = ChessPieceFactory.getChessPiece("bishop", "white");
        board[0][3] = ChessPieceFactory.getChessPiece("queen", "white");
        board[0][4] = ChessPieceFactory.getChessPiece("king", "white");
        
        // 设置黑方棋子
        for (int col = 0; col < 8; col++) {
            board[6][col] = ChessPieceFactory.getChessPiece("pawn", "black");
        }
        board[7][0] = ChessPieceFactory.getChessPiece("rook", "black");
        board[7][7] = ChessPieceFactory.getChessPiece("rook", "black");
        board[7][1] = ChessPieceFactory.getChessPiece("knight", "black");
        board[7][6] = ChessPieceFactory.getChessPiece("knight", "black");
        board[7][2] = ChessPieceFactory.getChessPiece("bishop", "black");
        board[7][5] = ChessPieceFactory.getChessPiece("bishop", "black");
        board[7][3] = ChessPieceFactory.getChessPiece("queen", "black");
        board[7][4] = ChessPieceFactory.getChessPiece("king", "black");
    }
    
    public void displayBoard() {
        for (int row = 0; row < 8; row++) {
            for (int col = 0; col < 8; col++) {
                if (board[row][col] != null) {
                    System.out.print(board[row][col].getType().charAt(0) + 
                                   (board[row][col].getColor().equals("white") ? "W " : "B "));
                } else {
                    System.out.print(". ");
                }
            }
            System.out.println(" | Row " + row);
        }
    }
}
```

### 线程池示例（概念展示）

```java
// 任务接口
interface Task {
    void execute();
    String getName();
}

// 具体任务实现
class ConcreteTask implements Task {
    private String name;
    private String type;
    
    public ConcreteTask(String name, String type) {
        this.name = name;
        this.type = type;
    }
    
    @Override
    public void execute() {
        System.out.println("执行任务: " + name + " 类型: " + type);
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    public String getType() {
        return type;
    }
}

// 任务工厂（享元）
class TaskFactory {
    private static Map<String, Task> taskPool = new HashMap<>();
    
    public static Task getTask(String name, String type) {
        String key = type; // 只按类型共享，不按名称共享
        
        Task task = taskPool.get(key);
        if (task == null) {
            task = new ConcreteTask(name, type);
            taskPool.put(key, task);
            System.out.println("创建新任务类型: " + type);
        }
        
        return task;
    }
    
    public static int getUniqueTaskTypes() {
        return taskPool.size();
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 字符对象示例 ===");
        
        // 创建大量字符对象
        Character charA1 = CharacterFactory.getCharacter('A', "Arial");
        Character charA2 = CharacterFactory.getCharacter('A', "Arial"); // 应该复用
        Character charB = CharacterFactory.getCharacter('B', "Arial");
        Character charC = CharacterFactory.getCharacter('A', "Times New Roman");
        
        // 显示字符（外部状态）
        charA1.display(12, "黑色", 100, 200);
        charA2.display(14, "红色", 150, 250);
        charB.display(12, "蓝色", 200, 300);
        charC.display(12, "绿色", 250, 350);
        
        System.out.println("字符池大小: " + CharacterFactory.getPoolSize());
        System.out.println();
        
        System.out.println("=== 森林场景示例 ===");
        
        // 创建一些树
        Tree oak = TreeTypeFactory.getTreeType("橡树", "棕色", "粗糙");
        Tree pine = TreeTypeFactory.getTreeType("松树", "绿色", "针状");
        Tree oak2 = TreeTypeFactory.getTreeType("橡树", "棕色", "粗糙"); // 应该复用
        
        // 创建具体的树实例
        TreeInstance tree1 = new TreeInstance(oak, 100, 200, 50, 100);
        TreeInstance tree2 = new TreeInstance(oak2, 150, 250, 60, 120); // 复用橡树类型
        TreeInstance tree3 = new TreeInstance(pine, 300, 400, 40, 80);
        
        tree1.draw();
        tree2.draw();
        tree3.draw();
        
        System.out.println("创建的树类型数: " + TreeTypeFactory.getCreatedTypesCount());
        System.out.println();
        
        System.out.println("=== 文本编辑器示例 ===");
        
        TextEditor editor = new TextEditor();
        
        // 添加大量相似字符
        editor.addCharacter('H', "Arial", 12, "黑色", 10, 10);
        editor.addCharacter('e', "Arial", 12, "黑色", 20, 10);
        editor.addCharacter('l', "Arial", 12, "黑色", 30, 10);
        editor.addCharacter('l', "Arial", 12, "黑色", 40, 10); // 与上面的'l'共享
        editor.addCharacter('o', "Arial", 12, "黑色", 50, 10);
        
        // 添加其他格式的字符
        editor.addCharacter('W', "Arial", 14, "红色", 70, 10); // 不同大小
        editor.addCharacter('o', "Arial", 14, "红色", 80, 10); // 不同大小的'o'
        
        editor.printPoolInfo();
        editor.render();
        
        System.out.println("\n" + "=".repeat(60) + "\n");
        
        System.out.println("=== 棋子示例 ===");
        
        ChessBoard board = new ChessBoard();
        board.setupBoard();
        
        System.out.println("创建的棋子类型数: " + ChessPieceFactory.getPiecesCreated());
        System.out.println("国际象棋棋盘:");
        board.displayBoard();
    }
}
```

## 享元模式的优缺点

### 优点
1. 大幅减少内存中对象的数量，节省内存空间
2. 当系统中大量相似对象时，可以显著提高性能
3. 外部状态相对独立，不会影响到内部状态

### 缺点
1. 使系统复杂化，需要分离出内部状态和外部状态
2. 享元模式要求将内部状态与外部状态分离，而外部状态在一定程度上由客户端管理
3. 读取外部状态会消耗一定时间，可能影响性能

## 内部状态 vs 外部状态

### 内部状态（Intrinsic State）
- 存储在享元对象内部
- 不会随环境改变
- 可以共享
- 例如：字符的内容、字体类型、颜色等

### 外部状态（Extrinsic State）
- 随环境改变而改变
- 不能共享
- 由客户端负责保存
- 例如：字符的位置、大小等

## 享元模式的结构

享元模式通常包含以下角色：

1. **Flyweight（抽象享元类）**：定义了享元对象的接口
2. **ConcreteFlyweight（具体享元类）**：实现抽象享元接口
3. **FlyweightFactory（享元工厂）**：负责创建和管理享元对象
4. **Client（客户端）**：使用享元对象

## 总结

享元模式就像程序界的“共享经济”——它通过共享对象来减少内存使用。就像共享单车、共享充电宝一样，享元模式让多个对象共享同一个实例，从而节省资源。

记住：**享元模式适用于需要创建大量相似对象的场景，通过分离内部状态和外部状态来实现对象共享！**

在Java标准库中，String常量池、Integer缓存（-128到127）、ThreadLocal等都体现了享元模式的思想。Java的包装类如Integer、Long等对于常用值也有缓存机制，这也是享元模式的应用。