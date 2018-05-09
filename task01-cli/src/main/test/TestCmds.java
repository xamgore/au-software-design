import org.junit.jupiter.api.Test;
import ru.xamgore.Repl;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Paths;

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

}
