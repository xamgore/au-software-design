package ru.xamgore;

import ru.xamgore.tasks.Task;
import ru.xamgore.parser.Parser;
import ru.xamgore.parser.ast.Statement;
import ru.xamgore.parser.lexer.Lexer;
import ru.xamgore.parser.visitors.ExecutorVisitor;
import ru.xamgore.parser.visitors.StringsConcater;
import ru.xamgore.parser.visitors.VariableInterpolator;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.nio.file.Paths;

/**
 * Read-eval-processor: displays terminal prelude and
 * waits for user commands. On enter, executes the command
 * and prints results back.
 */
public class Repl {

  private final Map<String, String> env;

  public Repl(Map<String, String> env) {
    this.env = new HashMap<>(env);

    // set platform-independent path to pwd
    this.env.put("PWD", Paths.get(".").toAbsolutePath().normalize().toString());
  }

  /**
   * Command processor: parses the input,
   * defines the command that must be executed,
   * executes it and print results to system.out
   * @param line input string to process
   */
  public void process(String line) {
    Lexer lex = new Lexer(line);
    Parser parser = new Parser(lex.tokenize());

    if (!parser.canParse()) {
      return;
    }

    Statement stm = parser.parse();
    stm.accept(new VariableInterpolator(env));
    stm.accept(new StringsConcater());

    ExecutorVisitor exec = new ExecutorVisitor();
    stm.accept(exec);

    String stdin = "";
    for (Task t : exec.getTasks()) {
      t.attach(stdin, env);
      t.exec();
      stdin = t.getOutput();
    }

    System.out.println(stdin);
  }

  /**
   * Start the read-eval-process loop:
   * display terminal prelude and wait for user commands.
   * On enter, run the command and print results back.
   */
  public void run() {
    Scanner input = new Scanner(System.in);

    while (true) {
      System.out.print("> ");
      if (!input.hasNextLine())
        break;
      process(input.nextLine());
    }
  }

}
