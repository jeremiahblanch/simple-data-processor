export type StringKeyedObject = {[k: string] : any}
export type SDPValueProcessor = (arg0: any) => any;
export type SPDObjectProcessor = (arg0: any) => any;

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
