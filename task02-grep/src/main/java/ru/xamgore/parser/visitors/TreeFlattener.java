package ru.xamgore.parser.visitors;

import ru.xamgore.parser.Visitor;
import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;
import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.lexer.TokenType;

import java.util.ArrayList;
import java.util.List;

/**
 * Restores positions of some tokens.
 * Used for debug purposes.
 */
public class TreeFlattener implements Visitor {
  private final List<Token> res = new ArrayList<>();
  private int pos = -1;

  @Override
  public void visit(Assignment s) {
    int eqSignPos = s.getVar().getEndCol() + 1;

    add(s.getVar());
    add(new Token(TokenType.ASSIGN, "=", eqSignPos, eqSignPos));
    s.getValues().forEach(this::add);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Command s) {
    add(s.getCmd());
    s.getArgs().forEach(this::add);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(PipeSequence s) {
    s.getCmds().get(0).accept(this);

    s.getCmds().stream()
      .skip(1)
      .forEach(st -> {
        // approximate pipe's position
        add(new Token(TokenType.PIPE, "|", pos, pos));
        st.accept(this);
      });
  }

  /**
   * @return proceeded result, i.e. normalized tokens
   */
  public List<Token> getResult() {
    return res;
  }

  private void add(Token t) {
    res.add(t);
    pos = t.getEndCol() + 1;
  }
}
