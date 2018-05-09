package ru.xamgore.parser.visitors;

import ru.xamgore.parser.Visitor;
import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;

public class AbstractVisitor implements Visitor {

  @Override
  public void visit(Assignment s) {
  }

  @Override
  public void visit(Command s) {
  }

  @Override
  public void visit(PipeSequence s) {
    s.getCmds().forEach(st -> st.accept(this));
  }
}
