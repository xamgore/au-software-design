package ru.xamgore.parser.ast;

import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.Visitor;

import java.util.List;

/**
 * Command node, like "echo 4 3 1"
 */
public class Command implements Statement {

  private Token cmd;

  private List<Token> args;

  public Command(Token cmd, List<Token> args) {
    this.cmd = cmd;
    this.args = args;
  }

  /**
   * @return the command part of phrase i.e. "echo" in "echo 4 3 1"
   */
  public Token getCmd() {
    return cmd;
  }

  /**
   * Set the command part of phrase i.e. "echo" in "echo 4 3 1"
   */
  public void setCmd(Token cmd) {
    this.cmd = cmd;
  }

  /**
   * @return the arguments part of phrase i.e. "4 3 1" in "echo 4 3 1"
   */
  public List<Token> getArgs() {
    return args;
  }

  /**
   * Set the command part of phrase i.e. "4 3 1" in "echo 4 3 1"
   */
  public void setArgs(List<Token> args) {
    this.args = args;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String toString() {
    return cmd.getText() + " " + args.toString();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }
}
