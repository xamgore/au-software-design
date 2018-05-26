package ru.xamgore.parser.visitors.replacer;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringReplacer {
  public static String replace(String input, Pattern regex, StringReplacerCallback callback) {
    StringBuffer res = new StringBuffer();
    Matcher matcher = regex.matcher(input);

    while (matcher.find())
      matcher.appendReplacement(res, callback.replace(matcher));

    matcher.appendTail(res);
    return res.toString();
  }
}
