package ru.xamgore.parser.visitors;

import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.lexer.Token;

import java.util.List;

import static ru.xamgore.parser.lexer.Concater.concat;

/**
 * Concater combines strings, which are
 * close enough: abc"x"'t' -> abcxt.
 */
public class StringsConcater extends AbstractVisitor {

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Assignment s) {
    s.setValues(concat(s.getValues()));
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Command s) {
    // combine "cmd" with its arguments
    s.getArgs().add(0, s.getCmd());
    List<Token> toks = concat(s.getArgs());

    // unpack cmd and args
    s.setCmd(toks.get(0));
    toks.remove(0);
    s.setArgs(toks);
  }

}
