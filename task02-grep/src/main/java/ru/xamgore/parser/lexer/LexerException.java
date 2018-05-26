package ru.xamgore.parser.lexer;

/**
 * Lexer exception is raised when lexer faces with
 * incorrect characters or fails processing by any reason.
 */
public class LexerException extends RuntimeException {
  public LexerException(int pos, String msg) {
    super("[" + pos + "] " + msg);
  }
}
