package ru.xamgore.parser.lexer;

import java.util.ArrayList;
import java.util.List;

/**
 * Lexer takes an input string and splits it onto
 * tokens: words, quoted phrases, pipes and equality signs.
 */
public final class Lexer {

  private static final String OPERATORS_CHARS = "|=";

  private final List<Token> tokens;
  private final String input;
  private final int len;

  private int pos = 0;


  public Lexer(String input) {
    this.input = input;
    len = input.length();

    tokens = new ArrayList<>();
  }

  /**
   * Split the initial line onto list of tokens.
   */
  public List<Token> tokenize() {
    while (pos < len) {
      final char ch = peek(0);

      if (OPERATORS_CHARS.indexOf(ch) != -1) {
        tokenizeOperator();
      } else if (ch == '"' || ch == '\'') {
        tokenizeQuotedWord();
      } else if (!Character.isSpaceChar(ch)) {
        tokenizeWord();
      } else {
        next(); // whitespace
      }
    }

    return tokens;
  }

  private void tokenizeOperator() {
    char ch = peek(0);
    if (ch == '|') addToken(TokenType.PIPE, ch);
    if (ch == '=') addToken(TokenType.ASSIGN, ch);
    next();
  }

  private void tokenizeWord() {
    final StringBuilder buf = new StringBuilder();
    final int startPos = pos;

    char ch = peek(0);
    while (" =|\t\'\"\0".indexOf(ch) == -1) {
      buf.append(ch);
      ch = next();
    }

    addToken(TokenType.WORD, buf.toString(), startPos);
  }

  private void tokenizeQuotedWord() {
    final StringBuilder buf = new StringBuilder();
    final int startPos = pos;

    char quote = peek(0);
    char ch = next();

    while (true) {
      if (ch == '\0')
        throw error("Closing quote was not found");

      if (ch == quote)
        break;

      buf.append(ch);
      ch = next();
    }

    next(); // skip the closing quote

    TokenType type = (quote == '"') ? TokenType.DQUOTED : TokenType.SQUOTED;
    addToken(type, buf.toString(), startPos);
  }

  private char peek(int relativePosition) {
    final int position = pos + relativePosition;
    if (position >= len) return '\0';
    return input.charAt(position);
  }

  private char next() {
    pos++;
    return peek(0);
  }

  private void addToken(TokenType type, char ch) {
    tokens.add(new Token(type, "" + ch, pos, pos));
  }

  private void addToken(TokenType type, String text, int startPos) {
    tokens.add(new Token(type, text, startPos, pos - 1));
  }

  private LexerException error(String msg) {
    return new LexerException(pos, msg);
  }
}
