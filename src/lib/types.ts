export type StringKeyedObject = Record<string, unknown>
export type SDPValueProcessor = (arg0: unknown) => unknown;
export type SPDObjectProcessor<TOutput extends StringKeyedObject> = (arg0: StringKeyedObject) => TOutput;

export type FieldValueOrProcessor = string | SDPValueProcessor; 

export type ConsumerRuleSet<T extends StringKeyedObject> = {
  fields: { [k : string]: FieldValueOrProcessor};
  postProcess?:SPDObjectProcessor<T>; // postProcess must return an object matching T
  preProcess?:SPDObjectProcessor<StringKeyedObject>; // pre process might return some fields that are only used internally
}

export type SDPRuleSet<TMine extends StringKeyedObject, TTheirs extends StringKeyedObject> = {
 mine: ConsumerRuleSet<TMine>,
 theirs: ConsumerRuleSet<TTheirs>,
}
