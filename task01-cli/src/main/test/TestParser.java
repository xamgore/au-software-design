import org.junit.jupiter.api.Test;
import ru.xamgore.parser.Parser;
import ru.xamgore.parser.lexer.Lexer;
import ru.xamgore.parser.lexer.LexerException;

import static org.junit.jupiter.api.Assertions.*;


class TestParser {
  @Test
  void testEmptyString() {
    assertFalse(new Parser(new Lexer("  ").tokenize()).canParse());
  }

  @Test
  void testBinding() {
    assertEquals("((a : WORD [0], ASSIGN, [123 : WORD [2], 123 : WORD [6]]))",
      new Parser(new Lexer("a=123 123").tokenize()).parse().toString());
  }

  @Test
  void testCommand() {
    assertEquals("(echo [kek 1 : DQUOTED [5], 23 : WORD [12]])",
      new Parser(new Lexer("echo \"kek 1\"23").tokenize()).parse().toString());
  }

  @Test
  void testPipes() {
    assertEquals("(cat [$FILE : WORD [4]] | wc [])",
      new Parser(new Lexer("cat $FILE | wc").tokenize()).parse().toString());
  }

}
