export type ValueProcessor = (
  preProcessorOutput: Record<string | number | symbol, unknown>,
) => unknown;
export type ObjectProcessor<Input, Output> = (
  preProcessorOutput: Input,
) => Output;

export type ConsumerRuleSet<
  Input extends Record<string | number | symbol, unknown>,
  Output extends Record<string | number | symbol, unknown>,
> = {
  fields: Record<
    string | number | symbol,
    ValueProcessor | string | number | symbol
  >;
  postProcess?: ObjectProcessor<
    Record<string | number | symbol, unknown>,
    Output
  >;
  preProcess?: ObjectProcessor<
    Input,
    Record<string | number | symbol, unknown>
  >;
};

export type SDPRuleSet<
  Mine extends Record<string | number | symbol, unknown>,
  Theirs extends Record<string | number | symbol, unknown>,
> = {
  mine: ConsumerRuleSet<Theirs, Mine>;
  theirs: ConsumerRuleSet<Mine, Theirs>;
};
