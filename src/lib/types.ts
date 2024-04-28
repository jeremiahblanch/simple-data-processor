export type StringKeyedObject = {[k: string] : any}
export type SDPValueProcessor = (arg0: any) => any;
export type SPDObjectProcessor = (arg0: any) => any;

export type ConsumerRuleSet = {
  fields: { [k: string]: string | SDPValueProcessor};
  postProcess?:SPDObjectProcessor;
  preProcess?:SPDObjectProcessor;
}

export type SDPRuleSet = {
 mine: ConsumerRuleSet,
 theirs: ConsumerRuleSet,
}
