package ru.xamgore.parser.visitors;

import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.lexer.TokenType;

import java.util.Map;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Interpolate variables in the strings, like "a$k" -> "aaaa",
 * where $k = "aaa".
 */
public class VariableInterpolator extends AbstractVisitor {

  private static final Pattern VARIABLE_PATTERN =
    Pattern.compile("(\\$(\\p{Alnum}+)|\\$\\{(\\p{Alnum}+)})");

  private Map<String, String> env;


  public VariableInterpolator(Map<String, String> env) {
    this.env = env;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Assignment s) {
    super.visit(s);

    interpolate(s.getVar());
    s.getValues().forEach(this::interpolate);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Command s) {
    super.visit(s);

    interpolate(s.getCmd());
    s.getArgs().forEach(this::interpolate);
  }

  private void interpolate(Token tok) {
    TokenType type = tok.getType();
    if (type == TokenType.WORD || type == TokenType.DQUOTED) {
      // Mark single quoted to preserve spaces
      tok.setType(TokenType.SQUOTED);
      tok.setText(replaceVars(tok.getText()));
    }
  }

  private String replaceVars(String text) {
    return replace(text, VARIABLE_PATTERN, m -> {
      // One of groups contains a value without $ sign
      String name = (m.group(2) != null) ? m.group(2) : m.group(3);
      return env.getOrDefault(name, "");
    });
  }

  private static String replace(String input, Pattern regex, Function<Matcher, String> callback) {
    StringBuffer res = new StringBuffer();
    Matcher matcher = regex.matcher(input);

    while (matcher.find())
      matcher.appendReplacement(res, callback.apply(matcher));

    matcher.appendTail(res);
    return res.toString();
  }
}
