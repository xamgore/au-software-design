package ru.xamgore.parser.lexer;

/**
 * Token is a reference to the source text with
 * additional information: type, start, end, text.
 * It is later used in Parser to transform text to AST.
 */
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

  /**
   * @return type of the token
   */
  public TokenType getType() {
    return type;
  }

  /**
   * @param type set type of the token
   */
  public void setType(TokenType type) {
    this.type = type;
  }

  /**
   * @return text referenced by token
   */
  public String getText() {
    return text;
//    return text.isEmpty() ? "''" : text;
  }

  /**
   * @param text set text of the token
   */
  public void setText(String text) {
    this.text = text;
  }

  /**
   * @return the position where token is
   */
  public int getStartCol() {
    return startCol;
  }

  /**
   * @return the position where token is
   */
  public int getEndCol() {
    return endCol;
  }

  /**
   * @return string representation of position
   */
  public String position() {
    return "[" + startCol + "]";
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String toString() {
    final String dots = text.length() == 0 ? "" : " : ";
    return text + dots + type.name() + " " + position();
  }
}
