package ru.xamgore.parser.visitors.replacer;

import java.util.regex.Matcher;

@FunctionalInterface
public interface StringReplacerCallback {
  String replace(Matcher match);
}
