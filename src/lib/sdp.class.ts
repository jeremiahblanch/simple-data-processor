import type { SPDObjectProcessor, ConsumerRuleSet, SDPRuleSet, StringKeyedObject, FieldValueOrProcessor } from "./types";

const genericPassThroughProcessor: SPDObjectProcessor<StringKeyedObject> = (arg0: StringKeyedObject) => arg0;


export class SimpleDataProcessor<TMine extends StringKeyedObject, TTheirs extends StringKeyedObject> {
  mine: ConsumerRuleSet<TMine>
  theirs: ConsumerRuleSet<TTheirs>
  
  constructor( 
    ruleSet: SDPRuleSet<TMine, TTheirs>
  ) {
    ruleSet.mine.preProcess = ruleSet.mine.preProcess ?? genericPassThroughProcessor;
    ruleSet.mine.postProcess = ruleSet.mine.postProcess ?? ((arg0: StringKeyedObject) => arg0 as TMine);
    ruleSet.theirs.preProcess = ruleSet.theirs.preProcess ?? genericPassThroughProcessor;
    ruleSet.theirs.postProcess = ruleSet.theirs.postProcess ?? ((arg0: StringKeyedObject) => arg0 as TTheirs);

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

    return this.theirs.postProcess!({...myData, ...mappedData}) as TTheirs;
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

    return this.mine.postProcess!({...theirData, ...mappedData}) as TMine;
  }

}