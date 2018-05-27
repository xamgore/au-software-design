package ru.xamgore.parser.visitors;

import ru.xamgore.tasks.commands.*;
import ru.xamgore.tasks.ExternalTask;
import ru.xamgore.tasks.InternalCommands;
import ru.xamgore.tasks.Task;
import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.lexer.Token;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * Collects tasks from the string: bindings and commands.
 * The list of tasks is returned.
 */
public class ExecutorVisitor extends AbstractVisitor {
  private List<Task> tasks = new ArrayList<>();

  private static Map<String, Supplier<Task>> commands =
    InternalCommands.get();


  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Assignment s) {
    String value = s.getValues().stream()
      .map(Token::getText)
      .collect(Collectors.joining(" "));

    tasks.add(new Assign(s.getVar().getText(), value));
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Command s) {
    String name = s.getCmd().getText();

    Task t = (commands.containsKey(name))
      ? commands.get(name).get()
      : new ExternalTask(name);

    t.setArgs(s.getArgs().stream().map(Token::getText).toArray(String[]::new));
    tasks.add(t);
  }

  /**
   * @return list of tasks: bindings and commands.
   */
  public List<Task> getTasks() {
    return tasks;
  }
}
