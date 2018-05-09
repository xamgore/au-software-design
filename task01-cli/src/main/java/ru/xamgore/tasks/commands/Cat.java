package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Cat is a program that redirects the input stream
 * or a file's content to the output stream.
 */
public class Cat extends Task {

  @Override
  public int exec() {
    String in = stdin;
    try {
      if (args.length > 0)
        in = new String(Files.readAllBytes(Paths.get(args[0])));
    } catch (IOException e) {
      return 1;
    }

    stdout = in;
    return 0;
  }

}
