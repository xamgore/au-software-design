package ru.xamgore.parser.ast;

import ru.xamgore.parser.Visitor;

/**
 * The base node of all nodes in AST.
 */
public interface Statement {
  /**
   * Part of visitor pattern.
   * Accepts visitor to process the current node.
   */
  void accept(Visitor visitor);
}
