package ru.xamgore;

/**
 * The program entry point, where the read-eval-process loop is started.
 */
public class Main {
  public static void main(String[] args) {
    new Repl(System.getenv()).run();
  }
}
