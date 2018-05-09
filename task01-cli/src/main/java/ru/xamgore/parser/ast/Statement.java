package ru.xamgore.parser.ast;

import ru.xamgore.parser.Visitor;

public interface Statement {
  void accept(Visitor visitor);
}
