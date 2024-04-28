import { SPDObjectProcessor, ConsumerRuleSet, SDPRuleSet, StringKeyedObject } from "./types";

const passThroughProcessor: SPDObjectProcessor = (arg0: any) => arg0;

export class SimpleDataProcessor {
  mine: ConsumerRuleSet
  theirs: ConsumerRuleSet
  
  constructor( 
    ruleSet: SDPRuleSet
  ) {
    ruleSet.mine.preProcess = ruleSet.mine.preProcess ?? passThroughProcessor;
    ruleSet.mine.postProcess = ruleSet.mine.postProcess ?? passThroughProcessor;
    ruleSet.theirs.preProcess = ruleSet.theirs.preProcess ?? passThroughProcessor;
    ruleSet.theirs.postProcess = ruleSet.theirs.postProcess ?? passThroughProcessor;

    this.mine = ruleSet.mine;
    this.theirs = ruleSet.theirs;
  }

  convertToTheirs = (myData: StringKeyedObject): StringKeyedObject => {
    const preProcessedData = this.theirs.preProcess!(myData);

    const mappedData = Object.entries(this.theirs.fields).reduce((acc, [theirFieldName, valueProcessorOrMapping]) => {
      let value;
      if (typeof valueProcessorOrMapping === 'string') {
        // it's a straight mapping to a field on myData
        value = preProcessedData[valueProcessorOrMapping]
      }
      else { // it's a function
        value = valueProcessorOrMapping(preProcessedData);
      }

      acc[theirFieldName] = value;

      return acc;
    }, {} as StringKeyedObject);

    return this.theirs.postProcess!(mappedData);
  }

  convertToMine = (theirData: StringKeyedObject): StringKeyedObject => {
    const preProcessedData = this.mine.preProcess!(theirData);

    const mappedData = Object.entries(this.mine.fields).reduce((acc, [myFieldName, valueProcessorOrMapping]) => {
      let value;
      if (typeof valueProcessorOrMapping === 'string') {
        // it's a straight mapping to a field on theirData
        value = preProcessedData[valueProcessorOrMapping]
      }
      else { // it's a function
        value = valueProcessorOrMapping(preProcessedData);
      }

      acc[myFieldName] = value;

      return acc;
    }, {} as StringKeyedObject);

    return this.mine.postProcess!(mappedData);
  }

}