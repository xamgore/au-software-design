import org.junit.jupiter.api.Test;
import ru.xamgore.parser.lexer.Lexer;
import ru.xamgore.parser.lexer.LexerException;

import static org.junit.jupiter.api.Assertions.*;


class TestLexer {
  @Test
  void testEmptyString() {
    assertTrue(new Lexer("").tokenize().isEmpty());
  }

  @Test
  void testSymbols() {
    assertEquals("[a : WORD [0], = : ASSIGN [2], DQUOTED [4], | : PIPE [7], 1234567890asdfghjkl;;zxcvbnm,../qwertyuiop[] : WORD [9]]",
      new Lexer("a = \"\" | 1234567890asdfghjkl;;zxcvbnm,../qwertyuiop[]").tokenize().toString());
  }

  @Test
  void testUnclosedQuote() {
    assertThrows(LexerException.class, () -> new Lexer("\"kek").tokenize());
  }

  @Test
  void testQuoted() {
    assertEquals("[kek : DQUOTED [0]]", new Lexer("\"kek\"").tokenize().toString());
  }
}
