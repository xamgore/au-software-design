package ru.xamgore.tasks;

import org.buildobjects.process.ExternalProcessFailureException;
import org.buildobjects.process.ProcBuilder;
import org.buildobjects.process.ProcResult;
import org.buildobjects.process.StartupException;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

/**
 * External task is a wrapper of non-local process.
 */
public class ExternalTask extends Task {

  private final String file;

  public ExternalTask(String file) {
    this.file = file;
  }

  @Override
  public int exec() {
    try {
      InputStream is = new ByteArrayInputStream(stdin.getBytes());

      ProcResult res = new ProcBuilder(file)
        .withArgs(args)
        .withInputStream(is)
        .withNoTimeout()
        .ignoreExitStatus()
        .run();

      stdout = res.getOutputString();
      return res.getExitValue();
    } catch (ExternalProcessFailureException ex) {
      System.err.println(ex.getMessage());
      return ex.getExitValue();
    } catch (StartupException ex) {
      System.err.println("Process \"" + file + "\" can't be started!");
      return 1;
    }

  }

}
