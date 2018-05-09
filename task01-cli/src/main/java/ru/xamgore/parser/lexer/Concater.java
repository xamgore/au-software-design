package ru.xamgore.parser.lexer;

import java.util.ArrayList;
import java.util.List;

/**
 * Concater combines strings, which are
 * close enough: abc"x"'t' -> abcxt.
 */
public class Concater {

  /**
   * combines tokens, which are close enough: abc"x"'t' -> abcxt.
   */
  public static List<Token> concat(List<Token> toks) {
    if (toks.size() <= 1) return toks;

    int startPos = toks.get(0).getStartCol();
    int lastPos = toks.get(0).getEndCol();

    List<Token> res = new ArrayList<>();
    StringBuilder buf = new StringBuilder(toks.get(0).getText());

    for (int i = 1; i < toks.size(); i++) {
      Token cur = toks.get(i);

      if (lastPos + 1 == cur.getStartCol()) {
        buf.append(cur.getText());
        lastPos = cur.getEndCol();
        continue;
      }

      res.add(new Token(TokenType.SQUOTED, buf.toString(), startPos, lastPos));

      buf = new StringBuilder(cur.getText());
      startPos = cur.getStartCol();
      lastPos = cur.getEndCol();
    }

    res.add(new Token(TokenType.SQUOTED, buf.toString(), startPos, lastPos));
    return res;
  }

}
