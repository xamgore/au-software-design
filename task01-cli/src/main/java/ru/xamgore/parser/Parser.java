package ru.xamgore.parser;

import ru.xamgore.parser.lexer.Token;
import ru.xamgore.parser.lexer.TokenType;
import ru.xamgore.parser.ast.Assignment;
import ru.xamgore.parser.ast.Command;
import ru.xamgore.parser.ast.PipeSequence;
import ru.xamgore.parser.ast.Statement;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;


public class Parser {

  private static final Token EOL = new Token(TokenType.EOF, "", -1, -1);

  private final List<Token> tokens;
  private final int size;

  private int pos;


  public Parser(List<Token> tokens) {
    this.tokens = tokens;
    size = tokens.size();
  }

  public boolean canParse() {
    return size != 0;
  }

  public Statement parse() {
    return pipeSequence();
  }

  private Statement pipeSequence() {
    List<Statement> res = new ArrayList<>();

    if (match(TokenType.EOF))
      return new PipeSequence(res);

    do res.add(isAssignment() ? assignment() : command());
    while (match(TokenType.PIPE));

    return new PipeSequence(res);
  }

  private boolean isAssignment() {
    if (size < 2) return false;

    boolean firstIsWord =
      lookMatch(0, TokenType.WORD, TokenType.SQUOTED, TokenType.DQUOTED);
    boolean secondIsAssignment =
      lookMatch(1, TokenType.ASSIGN);
    boolean noSpaceBetween =
      get(0).getEndCol() + 1 == get(1).getStartCol();

    return firstIsWord && secondIsAssignment && noSpaceBetween;
  }

  private Statement assignment() {
    Token var = consume();
    match(TokenType.ASSIGN);

    List<Token> tokensAfterEqSign = new ArrayList<>();
    while (!lookMatch(0, TokenType.EOF, TokenType.PIPE))
      tokensAfterEqSign.add(consume());

    return new Assignment(var, tokensAfterEqSign);
  }

  private Command command() {
    Token first = get(0);

    if (!matchAny(TokenType.WORD, TokenType.SQUOTED, TokenType.DQUOTED))
      throw new ParseException("Command name expected", first.getStartCol());

    List<Token> args = new ArrayList<>();
    while (!lookMatch(0, TokenType.EOF, TokenType.PIPE))
      args.add(consume());

    return new Command(first, args);
  }

  private Token consume() {
    Token tok = get(0);
    pos++;
    return tok;
  }

  private boolean match(TokenType type) {
    boolean matched = get(0).getType() == type;
    if (matched) pos++;
    return matched;
  }

  private boolean matchAny(TokenType... types) {
    return Arrays.stream(types).anyMatch(this::match);
  }

  private boolean lookMatch(int pos, TokenType... types) {
    TokenType t = get(pos).getType();
    return Arrays.stream(types).anyMatch(Predicate.isEqual(t));
  }

  private Token get(int relativePosition) {
    final int position = pos + relativePosition;
    if (position >= size) return EOL;
    return tokens.get(position);
  }

}
