package ru.xamgore.parser.ast;

import ru.xamgore.parser.Visitor;

import java.util.List;
import java.util.stream.Collectors;

public class PipeSequence implements Statement {

  private List<Statement> cmds;

  public PipeSequence(List<Statement> cmds) {
    this.cmds = cmds;
  }

  public List<Statement> getCmds() {
    return this.cmds;
  }

  @Override
  public void accept(Visitor visitor) {
    visitor.visit(this);
  }

  @Override
  public String toString() {
    return "(" +
      cmds.stream()
        .map(Object::toString)
        .collect(Collectors.joining(" | "))
      + ")";
  }
}
