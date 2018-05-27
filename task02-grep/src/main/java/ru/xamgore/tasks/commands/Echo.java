package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;

import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Echo prints its arguments to the output stream.
 */
public class Echo extends Task {

  /**
   * {@inheritDoc}
   */
  @Override
  public int exec() {
    stdout = Stream.of(args).collect(Collectors.joining(" "));
    return 0;
  }

}
