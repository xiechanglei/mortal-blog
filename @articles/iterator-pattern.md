# 迭代器模式 (Iterator Pattern) - 程序界的“翻页器”

## 什么是迭代器模式？

想象一下，你正在读一本很厚的书，你需要一页一页地翻阅。不管这本书是什么类型（小说、教科书、杂志），你都可以用同样的方式翻页：从第一页开始，依次往后翻，直到读完所有页面。迭代器模式就是这样——它提供一种方法来访问聚合对象中的各个元素，而又不暴露其内部细节。

**迭代器模式**提供一种方法来访问聚合对象，而不用暴露这个对象的内部表示。

## 为什么需要迭代器模式？

在以下场景中，迭代器模式特别有用：

1. 访问一个聚合对象的内容而无需暴露它的内部表示
2. 支持对聚合对象的多种遍历
3. 为遍历不同的聚合结构提供一个统一的接口

Java中，`Iterator`接口和`Iterable`接口就是迭代器模式的典型应用。

## 迭代器模式的实现

### 自定义迭代器接口

```java
// 迭代器接口
interface Iterator<T> {
    boolean hasNext();
    T next();
    void remove(); // 可选方法
}

// 聚合接口
interface Aggregate<T> {
    Iterator<T> createIterator();
}

// 自定义列表实现
class CustomList<T> implements Aggregate<T> {
    private Object[] items;
    private int size;
    private int capacity;
    
    public CustomList(int initialCapacity) {
        this.capacity = initialCapacity;
        this.items = new Object[initialCapacity];
        this.size = 0;
    }
    
    public void add(T item) {
        if (size >= capacity) {
            resize();
        }
        items[size] = item;
        size++;
    }
    
    private void resize() {
        capacity *= 2;
        Object[] newItems = new Object[capacity];
        System.arraycopy(items, 0, newItems, 0, size);
        items = newItems;
    }
    
    public T get(int index) {
        if (index >= 0 && index < size) {
            @SuppressWarnings("unchecked")
            T item = (T) items[index];
            return item;
        }
        return null;
    }
    
    public int size() {
        return size;
    }
    
    @Override
    public Iterator<T> createIterator() {
        return new CustomListIterator();
    }
    
    // 自定义迭代器实现
    private class CustomListIterator implements Iterator<T> {
        private int currentIndex = 0;
        
        @Override
        public boolean hasNext() {
            return currentIndex < size;
        }
        
        @Override
        @SuppressWarnings("unchecked")
        public T next() {
            if (hasNext()) {
                return (T) items[currentIndex++];
            }
            throw new java.util.NoSuchElementException();
        }
        
        @Override
        public void remove() {
            if (currentIndex <= 0) {
                throw new IllegalStateException("无法删除，还未调用next()");
            }
            // 简化实现：移除当前元素
            for (int i = currentIndex - 1; i < size - 1; i++) {
                items[i] = items[i + 1];
            }
            size--;
            currentIndex--;
        }
    }
}
```

### 书架迭代器示例

```java
// 书类
class Book {
    private String name;
    private String author;
    
    public Book(String name, String author) {
        this.name = name;
        this.author = author;
    }
    
    public String getName() { return name; }
    public String getAuthor() { return author; }
    
    @Override
    public String toString() {
        return name + " - " + author;
    }
}

// 书架接口
interface BookShelf extends Aggregate<Book> {
    Book getBookAt(int index);
    void appendBook(Book book);
    int getLength();
}

// 自定义书架实现
class CustomBookShelf implements BookShelf {
    private Book[] books;
    private int last = 0;
    
    public CustomBookShelf(int maxSize) {
        this.books = new Book[maxSize];
    }
    
    @Override
    public Book getBookAt(int index) {
        if (index < 0 || index >= last) {
            throw new IndexOutOfBoundsException();
        }
        return books[index];
    }
    
    @Override
    public void appendBook(Book book) {
        if (last < books.length) {
            books[last] = book;
            last++;
        } else {
            throw new IndexOutOfBoundsException("书架已满");
        }
    }
    
    @Override
    public int getLength() {
        return last;
    }
    
    @Override
    public Iterator<Book> createIterator() {
        return new BookShelfIterator();
    }
    
    // 书架迭代器
    private class BookShelfIterator implements Iterator<Book> {
        private int index = 0;
        
        @Override
        public boolean hasNext() {
            return index < last;
        }
        
        @Override
        public Book next() {
            if (hasNext()) {
                return books[index++];
            }
            throw new java.util.NoSuchElementException();
        }
        
        @Override
        public void remove() {
            if (index <= 0) {
                throw new IllegalStateException("无法删除，还未调用next()");
            }
            // 移除当前元素
            for (int i = index - 1; i < last - 1; i++) {
                books[i] = books[i + 1];
            }
            books[last - 1] = null;
            last--;
            index--;
        }
    }
}
```

## 实际应用场景

### 树形结构迭代器示例

```java
// 树节点类
class TreeNode<T> {
    T data;
    TreeNode<T> left;
    TreeNode<T> right;
    
    public TreeNode(T data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

// 树形聚合接口
interface TreeAggregate<T> extends Aggregate<T> {
    void add(T item);
    TreeNode<T> getRoot();
}

// 二叉搜索树实现
class BinarySearchTree<T extends Comparable<T>> implements TreeAggregate<T> {
    private TreeNode<T> root;
    
    public BinarySearchTree() {
        this.root = null;
    }
    
    public void add(T item) {
        root = insert(root, item);
    }
    
    private TreeNode<T> insert(TreeNode<T> node, T item) {
        if (node == null) {
            return new TreeNode<>(item);
        }
        
        if (item.compareTo(node.data) < 0) {
            node.left = insert(node.left, item);
        } else if (item.compareTo(node.data) > 0) {
            node.right = insert(node.right, item);
        }
        
        return node;
    }
    
    @Override
    public Iterator<T> createIterator() {
        return new InOrderIterator();
    }
    
    public TreeNode<T> getRoot() {
        return root;
    }
    
    // 中序遍历迭代器
    private class InOrderIterator implements Iterator<T> {
        private java.util.List<T> list;
        private int currentIndex;
        
        public InOrderIterator() {
            list = new java.util.ArrayList<>();
            inOrderTraversal(root, list);
            currentIndex = 0;
        }
        
        private void inOrderTraversal(TreeNode<T> node, java.util.List<T> list) {
            if (node != null) {
                inOrderTraversal(node.left, list);
                list.add(node.data);
                inOrderTraversal(node.right, list);
            }
        }
        
        @Override
        public boolean hasNext() {
            return currentIndex < list.size();
        }
        
        @Override
        public T next() {
            if (hasNext()) {
                return list.get(currentIndex++);
            }
            throw new java.util.NoSuchElementException();
        }
        
        @Override
        public void remove() {
            throw new UnsupportedOperationException("不支持删除操作");
        }
    }
}
```

### 过滤迭代器示例

```java
import java.util.List;
import java.util.ArrayList;

// 过滤器接口
interface Filter<T> {
    boolean test(T item);
}

// 过滤迭代器
class FilteringIterator<T> implements Iterator<T> {
    private Iterator<T> iterator;
    private Filter<T> filter;
    private T nextItem;
    private boolean hasNext;
    
    public FilteringIterator(Iterator<T> iterator, Filter<T> filter) {
        this.iterator = iterator;
        this.filter = filter;
        findNext();
    }
    
    private void findNext() {
        hasNext = false;
        nextItem = null;
        
        while (iterator.hasNext()) {
            T item = iterator.next();
            if (filter.test(item)) {
                nextItem = item;
                hasNext = true;
                break;
            }
        }
    }
    
    @Override
    public boolean hasNext() {
        return hasNext;
    }
    
    @Override
    public T next() {
        if (!hasNext()) {
            throw new java.util.NoSuchElementException();
        }
        
        T result = nextItem;
        findNext();
        return result;
    }
    
    @Override
    public void remove() {
        throw new UnsupportedOperationException("不支持删除操作");
    }
}

// 男性类
class Person {
    private String name;
    private int age;
    private String gender;
    
    public Person(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getGender() { return gender; }
    
    @Override
    public String toString() {
        return name + " (" + age + ", " + gender + ")";
    }
}
```

### 组合迭代器示例

```java
import java.util.*;

// 组合迭代器 - 可以迭代多个集合
class CompositeIterator<T> implements Iterator<T> {
    private Iterator<Iterator<T>> iteratorIter;
    private Iterator<T> currentIterator;
    
    public CompositeIterator(List<Iterator<T>> iterators) {
        this.iteratorIter = iterators.iterator();
        this.currentIterator = null;
    }
    
    @Override
    public boolean hasNext() {
        // 查找下一个有效的迭代器
        while (currentIterator == null || !currentIterator.hasNext()) {
            if (!iteratorIter.hasNext()) {
                return false;
            }
            currentIterator = iteratorIter.next();
        }
        return currentIterator.hasNext();
    }
    
    @Override
    public T next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        return currentIterator.next();
    }
    
    @Override
    public void remove() {
        if (currentIterator != null) {
            currentIterator.remove();
        } else {
            throw new IllegalStateException("没有当前元素可以删除");
        }
    }
}
```

## 使用示例

```java
public class Client {
    public static void main(String[] args) {
        System.out.println("=== 自定义列表迭代器示例 ===");
        
        CustomList<String> list = new CustomList<>(5);
        list.add("Apple");
        list.add("Banana");
        list.add("Cherry");
        list.add("Date");
        
        // 使用迭代器遍历
        Iterator<String> iterator = list.createIterator();
        System.out.println("遍历列表:");
        while (iterator.hasNext()) {
            String item = iterator.next();
            System.out.println("- " + item);
        }
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== 书架迭代器示例 ===");
        
        BookShelf bookShelf = new CustomBookShelf(4);
        bookShelf.appendBook(new Book("设计模式", "GoF"));
        bookShelf.appendBook(new Book("Java编程思想", "Bruce Eckel"));
        bookShelf.appendBook(new Book("重构", "Martin Fowler"));
        bookShelf.appendBook(new Book("代码大全", "Steve McConnell"));
        
        Iterator<Book> bookIterator = bookShelf.createIterator();
        System.out.println("书架上的书:");
        while (bookIterator.hasNext()) {
            Book book = bookIterator.next();
            System.out.println("- " + book);
        }
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== 二叉搜索树迭代器示例 ===");
        
        BinarySearchTree<Integer> bst = new BinarySearchTree<>();
        bst.add(50);
        bst.add(30);
        bst.add(70);
        bst.add(20);
        bst.add(40);
        bst.add(60);
        bst.add(80);
        
        Iterator<Integer> bstIterator = bst.createIterator();
        System.out.println("按顺序遍历二叉搜索树:");
        while (bstIterator.hasNext()) {
            System.out.print(bstIterator.next() + " ");
        }
        System.out.println();
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== 过滤迭代器示例 ===");
        
        CustomList<Person> people = new CustomList<>(10);
        people.add(new Person("张三", 25, "M"));
        people.add(new Person("李四", 30, "F"));
        people.add(new Person("王五", 35, "M"));
        people.add(new Person("赵六", 28, "F"));
        people.add(new Person("钱七", 45, "M"));
        
        // 创建过滤器：只获取男性
        Filter<Person> maleFilter = person -> "M".equals(person.getGender());
        FilteringIterator<Person> maleIterator = new FilteringIterator<>(
            people.createIterator(), maleFilter);
        
        System.out.println("男性人员:");
        while (maleIterator.hasNext()) {
            System.out.println("- " + maleIterator.next());
        }
        
        System.out.println();
        
        // 创建过滤器：年龄大于30
        Filter<Person> ageFilter = person -> person.getAge() > 30;
        FilteringIterator<Person> ageIterator = new FilteringIterator<>(
            people.createIterator(), ageFilter);
        
        System.out.println("年龄大于30的人员:");
        while (ageIterator.hasNext()) {
            System.out.println("- " + ageIterator.next());
        }
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== 组合迭代器示例 ===");
        
        // 创建多个集合
        CustomList<String> list1 = new CustomList<>(3);
        list1.add("A");
        list1.add("B");
        
        CustomList<String> list2 = new CustomList<>(3);
        list2.add("X");
        list2.add("Y");
        list2.add("Z");
        
        // 创建组合迭代器
        List<Iterator<String>> iterators = new ArrayList<>();
        iterators.add(list1.createIterator());
        iterators.add(list2.createIterator());
        
        CompositeIterator<String> compositeIterator = new CompositeIterator<>(iterators);
        
        System.out.println("组合迭代器遍历结果:");
        while (compositeIterator.hasNext()) {
            System.out.print(compositeIterator.next() + " ");
        }
        System.out.println();
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        System.out.println("=== Java内置迭代器对比 ===");
        
        // Java内置List迭代器
        List<String> javaList = Arrays.asList("Spring", "Summer", "Autumn", "Winter");
        Iterator<String> javaIterator = javaList.iterator();
        
        System.out.println("Java内置迭代器遍历:");
        while (javaIterator.hasNext()) {
            System.out.println("- " + javaIterator.next());
        }
        
        System.out.println("\n使用增强for循环 (内部使用迭代器):");
        for (String season : javaList) {
            System.out.println("- " + season);
        }
    }
}
```

## 迭代器模式的优缺点

### 优点
1. 支持以不同的方式遍历一个聚合对象
2. 迭代器简化了聚合类
3. 在同一个聚合上可以有多个遍历
4. 在迭代器模式中，增加新的聚合类和迭代器类都很方便，无须修改原有代码

### 缺点
1. 由于迭代器模式将存储数据和遍历数据的职责分离，增加新的聚合类需要增加对应迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性

## Java内置迭代器 vs 自定义迭代器

### Java内置迭代器
- 由集合框架提供
- 性能优化良好
- 广泛支持和使用

### 自定义迭代器
- 可以实现特定的遍历逻辑
- 可以添加过滤、变换等操作
- 更灵活的控制

## 总结

迭代器模式就像程序界的"翻页器"——它提供了一种统一的方法来访问聚合对象中的元素，而无需暴露聚合对象的内部结构。就像你可以用同样的方式翻阅不同类型的书一样，迭代器让代码可以用同样的方式遍历不同的数据结构。

记住：**迭代器模式适用于需要遍历聚合对象的场景，它解耦了遍历算法和聚合对象的实现！**

在Java标准库中，迭代器模式被广泛应用于：
- 集合框架（List、Set、Map等）
- Stream API
- 遍历各种数据结构
- 文件读取（如BufferedReader.readLine()）
- 数据库结果集处理等