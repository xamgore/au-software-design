package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;


/**
 * Wc counts: lines, words, bytes of the
 * input stream or the file (its name must be
 * passed as an argument).
 */
public class Wc extends Task {

  /**
   * {@inheritDoc}
   */
  @Override
  public int exec() {
    String in = stdin;
    try {
      if (args.length > 0)
        in = new String(Files.readAllBytes(Paths.get(args[0])));
    } catch (IOException e) {
      return 1;
    }

    long linesCount = in.split("\\n").length;
    int wordsCount = in.split("\\s+").length;
    int bytesCount = in.length();

    stdout = bytesCount + "\t" + wordsCount + "\t" + linesCount;
    return 0;
  }

}
