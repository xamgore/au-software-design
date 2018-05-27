package ru.xamgore.tasks.commands;

import ru.xamgore.tasks.Task;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.NumberFormat;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import org.apache.commons.cli.*;

import static java.lang.Integer.parseUnsignedInt;


/**
 * Grep is a program to search text.
 */
public class Grep extends Task {
  private static final String IGNORE_CASE_OPTION = "i";
  private static final String WHOLE_WORDS_OPTION = "w";
  private static final String AFTER_LINES_OPTION = "A";

  private CommandLine cmd;
  private Pattern regex;
  private List<String> lines;

  /**
   * {@inheritDoc}
   */
  @Override
  public int exec() {
    stdout = "";

    try {
      parseArgs();

      // check file exists & get all lines, or take stdin
      lines = cmd.getArgs().length > 1
        ? Files.readAllLines(Paths.get(cmd.getArgs()[1]))
        : Arrays.asList(stdin.split("\\r?\\n"));

      // make a regex pattern from user's input
      String ignoreCase = cmd.hasOption(IGNORE_CASE_OPTION) ? "(?i)" : "";
      String wholeWords = cmd.hasOption(WHOLE_WORDS_OPTION) ? "\\b" : "";

      // the last argument is a regex
      String userPattern = cmd.getArgs()[0];

      // populate regex with additional options
      regex = Pattern.compile(ignoreCase + "(" + wholeWords + userPattern + wholeWords + ")");

      // parse -A argument
      Integer linesAfter = parseUnsignedInt(cmd.getOptionValue(AFTER_LINES_OPTION, "0"));

      stdout = process(linesAfter);
    } catch (Throwable e) {
      if (e instanceof NumberFormatException) {
        System.out.println("-A argument requires positive integer");
      }

      printHelp("Error! " + e.toString());
      return 1;
    }

    return 0;
  }

  private String process(int lines_after) {
    StringBuilder sb = new StringBuilder();
    lines_after += 1; // the matched line + lines after

    for (int i = 0; i < lines.size(); i++) {
      Matcher m = regex.matcher(lines.get(i));
      if (!m.find()) {
        continue;
      }

      int row = i;
      for (int left = lines_after; left > 0 && row < lines.size(); left--, row++) {
        sb.append(lines.get(row)).append("\n");
      }

      if (lines_after > 1) {
        sb.append("--\n");
      }
    }

    return sb.toString();
  }

  private void parseArgs() throws ParseException {
    CommandLineParser parser = new DefaultParser();
    cmd = parser.parse(options, args);

    if (cmd.getArgs().length < 1) {
      throw new ParseException("regex argument is expected");
    }
  }

  private final static Options options = new Options();

  static {
    Stream.of(
      new Option("i", "ignore case"),
      new Option("w", "whole words"),
      new Option("A", true, "print n lines after match")
    ).forEach(options::addOption);
  }

  private final static HelpFormatter formatter = new HelpFormatter();

  private void printHelp(String msg) {
    System.out.println(msg);
    formatter.printHelp("grep", "grep [file] regex [-i] [-w] [-A n]", options, "");
  }
}
