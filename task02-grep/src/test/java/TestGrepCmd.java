import org.junit.jupiter.api.Test;
import ru.xamgore.Repl;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;


class TestGrepCmd {
  @Test
  void testRegex() {
    assertEquals("# BlueJ files", grep("[^0-9]l[uk].J.? .gitignore"), "BlueJ");
  }

  @Test
  void testInPipe() {
    assertEquals("# BlueJ files", grep("BlueJ .gitignore"), "BlueJ");
    assertEquals("# BlueJ files", grepPipe(".gitignore", "BlueJ"), "BlueJ");
  }

  @Test
  void testIgnoreCaseFlag() {
    assertEquals("", grep("bluej .gitignore"), "grep bluej is empty");
    assertEquals("# BlueJ files", grep("bluej .gitignore -i"), "bluej -i");
  }

  @Test
  void testWholeWordsFlag() {
    assertEquals(3,
      grep("log .gitignore -i").split("\\r?\\n").length, "log -i");
  }

  @Test
  void testMultipleFlags() {
    assertEquals("# Log file\n*.log",
      grep("log .gitignore -w -w -i -i -w"), "log -i -w");
  }

  @Test
  void testAfterLinesFlag() {
    // test -A flag
    String output = "# Created by .ignore support plugin (hsz.mobi)\n### Java template\n--\n# Mobile Tools for Java (J2ME)\n.mtj.tmp/\n--";
    assertEquals(output, grep("mobi -i -A 1 .gitignore"), "mobi -A");
  }

  @Test
  void testAfterLinesIncorrectArgument() {
    assertTrue(grep("grep -A pom.xml plugin").contains("Error!"), "-A notnum");
  }

  private String grep(String... params) {
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    new Repl(System.getenv()).process("grep " +
      Stream.of(params).collect(Collectors.joining(" ")));
    return b.toString().trim();
  }

  private String grepPipe(String file, String... params) {
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    new Repl(System.getenv()).process("cat " + file + " | grep " +
      Stream.of(params).collect(Collectors.joining(" ")));
    return b.toString().trim();
  }
}
