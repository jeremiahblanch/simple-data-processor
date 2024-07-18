export type StringKeyedObject = Record<string, unknown>
export type SDPValueProcessor = (arg0: unknown) => unknown;
export type SPDObjectProcessor = (arg0: StringKeyedObject) => StringKeyedObject;

export type FieldValueOrProcessor = string | SDPValueProcessor; 

export type ConsumerRuleSet<T extends StringKeyedObject> = {
  fields: { [k in keyof T]?: FieldValueOrProcessor};
  postProcess?:SPDObjectProcessor;
  preProcess?:SPDObjectProcessor;
}

export type SDPRuleSet<TMine extends StringKeyedObject, TTheirs extends StringKeyedObject> = {
 mine: ConsumerRuleSet<TMine>,
 theirs: ConsumerRuleSet<TTheirs>,
}
