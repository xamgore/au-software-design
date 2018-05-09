package ru.xamgore.parser.ast;

import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.Visitor;

import java.util.List;

public class Assignment implements Statement {

  private Token var;
  private List<Token> values;

  public Assignment(Token var, List<Token> values) {
    this.var = var;
    this.values = values;
  }

  public Token getVar() {
    return var;
  }

  public List<Token> getValues() {
    return values;
  }

  public void setValues(List<Token> vals) {
    values = vals;
  }

  @Override
  public String toString() {
    return "(" + var + ", ASSIGN, " + values + ")";
  }

    @Override
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }

}
