export type StringKeyedObject = Record<string, unknown>
export type SDPValueProcessor = (arg0: unknown) => unknown;
export type SPDObjectProcessor = (arg0: unknown) => unknown;

export type FieldValueOrProcessor = string | SDPValueProcessor; 

export type ConsumerRuleSet = {
  fields: { [k: string]: FieldValueOrProcessor};
  postProcess?:SPDObjectProcessor;
  preProcess?:SPDObjectProcessor;
}

export type SDPRuleSet = {
 mine: ConsumerRuleSet,
 theirs: ConsumerRuleSet,
}
