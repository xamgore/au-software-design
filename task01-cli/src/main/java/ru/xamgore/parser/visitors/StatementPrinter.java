package ru.xamgore.parser.visitors;

import ru.xamgore.parser.Visitor;
import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;
import ru.xamgore.parser.lexer.Token;

import java.util.function.Consumer;

/**
 * Prints statements back, used for debug.
 */
public class StatementPrinter implements Visitor {
  private StringBuilder res = new StringBuilder();

  /**
   * @return result of AST to string transformation.
   */
  public String getResult() {
    return res.toString();
  }


  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Assignment s) {
    add(s.getVar());
    add("=");

    if (s.getValues().size() > 0) add(s.getValues().get(0));
    s.getValues().stream().skip(1).forEach(addWithPrefix(" "));
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(Command c) {
    add(c.getCmd());
    c.getArgs().forEach(addWithPrefix(" "));
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void visit(PipeSequence seq) {
    seq.getCmds().get(0).accept(this);

    seq.getCmds().stream()
      .skip(1)
      .forEach(st -> {
        add(" | ");
        st.accept(this);
      });
  }


  private void add(String s) {
    res.append(s);
  }

  private void add(Token tok) {
    add(tok.getText());
  }

  private Consumer<Token> addWithPrefix(String prefix) {
    return tok -> {
      add(prefix);
      add(tok);
    };
  }
}
