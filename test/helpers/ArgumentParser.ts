import {
  input as inquirerInput,
  select as inquirerSelect,
} from "@inquirer/prompts";
import commander from "commander";

export namespace ArgumentParser {
  export type Inquiry<T> = (
    command: commander.Command,
    prompt: Prompt,
    action: (closure: (options: Partial<T>) => Promise<T>) => Promise<T>,
  ) => Promise<T>;

  export interface Prompt {
    select: (
      name: string,
    ) => (
      message: string,
    ) => <Choice extends string>(choices: Choice[]) => Promise<Choice>;
    boolean: (name: string) => (message: string) => Promise<boolean>;
    number: (name: string) => (message: string) => Promise<number>;
  }

  export const parse = async <T>(
    inquiry: (
      command: commander.Command,
      prompt: Prompt,
      action: (closure: (options: Partial<T>) => Promise<T>) => Promise<T>,
    ) => Promise<T>,
  ): Promise<T> => {
    // TAKE OPTIONS
    const action = (closure: (options: Partial<T>) => Promise<T>) =>
      new Promise<T>((resolve, reject) => {
        commander.program.action(async (options) => {
          try {
            resolve(await closure(options));
          } catch (exp) {
            reject(exp);
          }
        });
        commander.program.parseAsync().catch(reject);
      });

    const select =
      (_name: string) =>
      (message: string) =>
      async <Choice extends string>(choices: Choice[]): Promise<Choice> =>
        await inquirerSelect({
          message,
          choices,
        });
    const boolean = (_name: string) => async (message: string) =>
      await inquirerInput({
        message,
        required: true,
        transformer: (value: string) => {
          const lowercased = value.toLowerCase();

          if (lowercased === "y") return "true";
          if (lowercased === "yes") return "true";
          if (lowercased === "true") return "true";
          if (lowercased === "n") return "false";
          if (lowercased === "no") return "false";
          if (lowercased === "false") return "false";

          return value;
        },
        validate: (value: string) => {
          if (value === "true" || value === "false") return true;
          return "invalid input; please input `yes` or `no`";
        },
      }).then((value) => value === "true");
    const number = (name: string) => async (message: string) =>
      await inquirerInput({
        message,
        required: true,
        validate: (value: string) => {
          if (isNaN(Number(value)))
            return "invalid input; please input a valid number";
          return true;
        },
      }).then((value) => Number(value));

    const output: T | Error = await (async () => {
      try {
        return await inquiry(
          commander.program,
          { select, boolean, number },
          action,
        );
      } catch (error) {
        return error as Error;
      }
    })();

    // RETURNS
    if (output instanceof Error) throw output;
    return output;
  };
}
