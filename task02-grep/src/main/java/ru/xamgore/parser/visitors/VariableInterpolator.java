package ru.xamgore.parser.visitors;

import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.lexer.TokenType;
import ru.xamgore.parser.visitors.replacer.StringReplacer;

import java.util.Map;
import java.util.regex.Pattern;

public class VariableInterpolator extends AbstractVisitor {

  private static final Pattern VARIABLE_PATTERN =
    Pattern.compile("(\\$(\\p{Alnum}+)|\\$\\{(\\p{Alnum}+)})");

  private Map<String, String> env;


  public VariableInterpolator(Map<String, String> env) {
    this.env = env;
  }

  @Override
  public void visit(Assignment s) {
    super.visit(s);

    interpolate(s.getVar());
    s.getValues().forEach(this::interpolate);
  }

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
    return StringReplacer.replace(text, VARIABLE_PATTERN, m -> {
      // One of groups contains a value without $ sign
      String name = (m.group(2) != null) ? m.group(2) : m.group(3);
      return env.getOrDefault(name, "");
    });
  }
}
