package ru.xamgore.parser;

/**
 * Exception that is caused by tokens from lexer,
 * that don't match the grammar rules.
 */
public final class ParseException extends RuntimeException {
  public ParseException() {
    super();
  }

  public ParseException(String string, int pos) {
    super(string);
  }
}