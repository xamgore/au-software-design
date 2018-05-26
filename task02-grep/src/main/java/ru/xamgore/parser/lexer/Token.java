package ru.xamgore.parser.lexer;


public final class Token {
  private final int startCol;
  private final int endCol;
  private TokenType type;
  private String text;

  public Token(TokenType type, String text, int startCol, int endCol) {
    this.type = type;
    this.text = text;
    this.startCol = startCol;
    this.endCol = endCol;
  }

  public TokenType getType() {
    return type;
  }

  public void setType(TokenType type) {
    this.type = type;
  }

  public String getText() {
    return text;
//    return text.isEmpty() ? "''" : text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public int getStartCol() {
    return startCol;
  }

  public int getEndCol() {
    return endCol;
  }

  public String position() {
    return "[" + startCol + "]";
  }

  @Override
  public String toString() {
    final String dots = text.length() == 0 ? "" : " : ";
    return text + dots + type.name() + " " + position();
  }
}
