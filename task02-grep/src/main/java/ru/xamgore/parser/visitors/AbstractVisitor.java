package ru.xamgore.parser.visitors;

import ru.xamgore.parser.Visitor;
import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;

/**
 * Partially implemented AST visitor with a method
 * for traversing pipe sequences.
 */
public class AbstractVisitor implements Visitor {

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Assignment s) {
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Command s) {
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(PipeSequence s) {
    s.getCmds().forEach(st -> st.accept(this));
  }
}
