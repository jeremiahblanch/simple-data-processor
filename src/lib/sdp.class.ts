import type { SPDObjectProcessor, ConsumerRuleSet, SDPRuleSet, FieldValueOrProcessor } from "./types";

export class SimpleDataProcessor<
  Mine extends Record<string, unknown>,
 Theirs extends Record<string, unknown>
> {
  mine: ConsumerRuleSet<Theirs, Mine>
  theirs: ConsumerRuleSet<Mine, Theirs>
  
  constructor( 
    ruleSet: SDPRuleSet<Mine, Theirs>
  ) {
    ruleSet.mine.preProcess = ruleSet.mine.preProcess ?? ((arg0: Theirs) => arg0 as Record<string, unknown>);
    ruleSet.mine.postProcess = ruleSet.mine.postProcess ?? ((arg0: Record<string, unknown>) => arg0 as Mine);
    ruleSet.theirs.preProcess = ruleSet.theirs.preProcess ?? ((arg0: Mine) => arg0 as Record<string, unknown>);
    ruleSet.theirs.postProcess = ruleSet.theirs.postProcess ?? ((arg0: Record<string, unknown>) => arg0 as Theirs);

    this.mine = ruleSet.mine;
    this.theirs = ruleSet.theirs;
  }

  convertToTheirs = (myData: Mine): Theirs => {
    const preProcessedData = this.theirs.preProcess!(myData);

    const mappedData = (<any>Object).entries(this.theirs.fields)
      .reduce((
        acc: Record<string, unknown>,
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
        {}
      );

    return this.theirs.postProcess!({...myData, ...mappedData});
  }

  convertToMine = (theirData: Theirs): Mine => {
    const preProcessedData = this.mine.preProcess!(theirData);

    const mappedData = (<any>Object).entries(this.mine.fields)
      .reduce((
        acc: Record<string, unknown>,
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
        {}
      );

    return this.mine.postProcess!({...theirData, ...mappedData}) as Mine;
  }

}