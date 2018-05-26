package ru.xamgore.parser.ast;

import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.Visitor;

import java.util.List;

/**
 * Assignment is a node with bindings, like "left=right"
 */
public class Assignment implements Statement {

  private Token var;
  private List<Token> values;

  public Assignment(Token var, List<Token> values) {
    this.var = var;
    this.values = values;
  }

  /**
   * @return variable (left part)
   */
  public Token getVar() {
    return var;
  }

  /**
   * @return list of values (right part)
   */
  public List<Token> getValues() {
    return values;
  }

  /**
   * @param vals list of values (right part)
   */
  public void setValues(List<Token> vals) {
    values = vals;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String toString() {
    return "(" + var + ", ASSIGN, " + values + ")";
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }

}
