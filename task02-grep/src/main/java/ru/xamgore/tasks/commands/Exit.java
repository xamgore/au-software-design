package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;


/**
 * Exit shutdowns the CLI process.
 */
public class Exit extends Task {

  @Override
  public int exec() {
    System.exit(0);
    return 0;
  }

}
