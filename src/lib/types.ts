export type SDPValueProcessor = (arg0: unknown) => unknown;
export type SPDObjectProcessor<Input, Output> = (arg0: Input) => Output;

export type FieldValueOrProcessor = string | SDPValueProcessor; 

export type ConsumerRuleSet<
  Input extends Record<string, unknown>,
  Output extends Record<string, unknown>
> = {
  fields: { [k : string]: FieldValueOrProcessor};
  postProcess?:SPDObjectProcessor<Record<string, unknown>, Output>; // postProcess must return an object matching Output
  preProcess?:SPDObjectProcessor<Input, Record<string, unknown>>; // pre process might return some fields that are only used internally
}

export type SDPRuleSet<
  Mine extends Record<string, unknown>,
  Theirs extends Record<string, unknown>
> = {
 mine: ConsumerRuleSet<Theirs, Mine>,
 theirs: ConsumerRuleSet<Mine, Theirs>,
}
