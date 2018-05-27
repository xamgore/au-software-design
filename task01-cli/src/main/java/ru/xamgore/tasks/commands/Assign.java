package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;


/**
 * Assign is a wrapper for "var=value" command.
 * It takes no input and generates no output.
 * Can be used inside a sequence of pipes.
 */
public class Assign extends Task {

  private final String varName;
  private final String value;

  public Assign(String varName, String value) {
    this.varName = varName;
    this.value = value;
  }


  /**
   * {@inheritDoc}
   */
  @Override
  public int exec() {
    env.put(varName, value);
    return 0;
  }

}
