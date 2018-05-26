package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;


/**
 * Pwd prints the current directory to
 * the output stream. The information is
 * taken from the environment.
 */
public class Pwd extends Task {

  /**
   * {@inheritDoc}
   */
  @Override
  public int exec() {
    stdout = env.get("PWD");
    return 0;
  }

}
