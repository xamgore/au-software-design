import org.junit.jupiter.api.Test;
import ru.xamgore.Repl;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Paths;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;


class TestCmds {
  @Test
  void testPwd() {
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));

    new Repl(System.getenv()).process("pwd");
    assertEquals(Paths.get(".").toAbsolutePath().normalize() + "\n",
      b.toString());
  }

  @Test
  void testWc() {
    PrintStream out = System.out;
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    new Repl(System.getenv()).process("wc .gitignore");
    assertEquals("1368\t135\t75\n", b.toString());
  }

  @Test
  void testCatPipe() {
    PrintStream out = System.out;
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    new Repl(System.getenv()).process("cat .gitignore | wc");
    assertEquals("1368\t135\t75\n", b.toString());
  }

  @Test
  void testEcho() {
    PrintStream out = System.out;
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    new Repl(System.getenv()).process("echo abc | wc");
    assertEquals("3\t1\t1\n", b.toString());
  }

  @Test
  void testVariables() {
    PrintStream out = System.out;
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    Repl r = new Repl(System.getenv());
    r.process("a=echo");
    r.process("$a 123");
    assertEquals("\n123\n", b.toString());
  }

  @Test
  void testInteroplation() {
    PrintStream out = System.out;
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    Repl r = new Repl(System.getenv());
    r.process("a=echo");
    r.process("echo '$a'\"$a\"");
    assertEquals("\n$aecho\n", b.toString());
  }

  @Test
  void testCallExternalCommand() {
    PrintStream out = System.out;
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    Repl r = new Repl(System.getenv());
    r.process("whoami");
    assertEquals(System.getProperty("user.name") + "\n\n", b.toString());
  }

  @Test
  void doesNotFallsOnUnexistingCommand() {
    ByteArrayOutputStream b = new ByteArrayOutputStream();
    System.setOut(new PrintStream(b, true));
    Repl r = new Repl(System.getenv());
    r.process("kakakkakakkekekekekekek");
  }

  @Test
  void testGrepCommand() {
    PrintStream out = System.out;

    // test regex
    assertEquals("# BlueJ files", grep(".gitignore [^0-9]l[uk].J.?"), "BlueJ");

    // test pipes
    assertEquals("# BlueJ files", grep(".gitignore BlueJ"), "BlueJ");
    assertEquals("# BlueJ files", grepPipe(".gitignore", "BlueJ"), "BlueJ");

    // test ignore case flag
    assertEquals("", grep(".gitignore bluej"), "grep bluej is empty");
    assertEquals("# BlueJ files", grep(".gitignore bluej -i"), "bluej -i");

    // test whole words flag
    assertEquals(3,
      grep(".gitignore log -i").split("\\r?\\n").length, "log -i");
    assertEquals("# Log file\n*.log",
      grep(".gitignore log -w -w -i -i -w"), "log -i -w");

    // test -A flag
    String output = "# Created by .ignore support plugin (hsz.mobi)\n### Java template\n--\n# Mobile Tools for Java (J2ME)\n.mtj.tmp/\n--";
    assertEquals(output, grep(".gitignore mobi -i -A 1"), "mobi -A");
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
