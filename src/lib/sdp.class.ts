import { SPDObjectProcessor, ConsumerRuleSet, SDPRuleSet, StringKeyedObject, FieldValueOrProcessor } from "./types";

const passThroughProcessor: SPDObjectProcessor = (arg0: unknown) => arg0;

export class SimpleDataProcessor<TMine extends StringKeyedObject, TTheirs extends StringKeyedObject> {
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

  convertToTheirs = (myData: TMine): TTheirs => {
    const preProcessedData = this.theirs.preProcess!(myData) as StringKeyedObject;

    const mappedData = (<any>Object).entries(this.theirs.fields)
      .reduce((
        acc: StringKeyedObject,
        [theirFieldName, valueProcessorOrMapping]: [string, FieldValueOrProcessor]
      ) => {
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
        },
        {} as StringKeyedObject
      );

    return this.theirs.postProcess!(mappedData) as TTheirs;
  }

  convertToMine = (theirData: TTheirs): TMine => {
    const preProcessedData = this.mine.preProcess!(theirData) as StringKeyedObject;

    const mappedData = (<any>Object).entries(this.mine.fields)
      .reduce((
        acc: StringKeyedObject,
        [myFieldName, valueProcessorOrMapping]: [string, FieldValueOrProcessor]
      ) => {
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
        }, 
        {} as StringKeyedObject
      );

    return this.mine.postProcess!(mappedData) as TMine;
  }

}