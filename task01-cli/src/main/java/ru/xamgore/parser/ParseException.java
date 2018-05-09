package ru.xamgore.parser;

public final class ParseException extends RuntimeException {
  public ParseException() {
    super();
  }

  public ParseException(String string, int pos) {
    super(string);
  }
}