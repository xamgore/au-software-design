package ru.xamgore.tasks;

import ru.xamgore.tasks.commands.*;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;


/**
 * The store with all internal commands, that
 * are used instead of external one.
 */
public class InternalCommands {

  private static Map<String, Supplier<Task>> commands;

  static {
    commands = new HashMap<>();
    commands.put("echo", Echo::new);
    commands.put("wc", Wc::new);
    commands.put("pwd", Pwd::new);
    commands.put("exit", Exit::new);
    commands.put("cat", Cat::new);
    commands.put("grep", Grep::new);
  }

  /**
   * @return map of built-in commands, from name to function.
   */
  public static Map<String, Supplier<Task>> get() {
    return commands;
  }

}
