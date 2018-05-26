package ru.xamgore.parser;

import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;

public interface Visitor {
  void visit(Assignment s);

  void visit(Command s);

  void visit(PipeSequence s);
}
