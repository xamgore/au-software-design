package ru.xamgore.parser.ast;

import ru.xamgore.parser.Visitor;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Pipe sequence node like "echo 1 | echo 2 | cat"
 */
public class PipeSequence implements Statement {

  private List<Statement> cmds;

  public PipeSequence(List<Statement> cmds) {
    this.cmds = cmds;
  }

  /**
   * @return list of commands
   */
  public List<Statement> getCmds() {
    return this.cmds;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String toString() {
    return "(" +
      cmds.stream()
        .map(Object::toString)
        .collect(Collectors.joining(" | "))
      + ")";
  }
}
