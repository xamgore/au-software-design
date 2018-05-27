package ru.xamgore.parser;

import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;

/**
 * Visitor pattern, generalized traverse for AST.
 * AST nodes already have <tt>accept(Visitor)</tt> method.
 */
public interface Visitor {
  /**
   * Process assignment
   * @param s assignment node
   */
  void visit(Assignment s);

  /**
   * Process command
   * @param s command node
   */
  void visit(Command s);

  /**
   * Process pipe
   * @param s pipe node
   */
  void visit(PipeSequence s);
}
