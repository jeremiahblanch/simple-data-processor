import type { ConsumerRuleSet, SDPRuleSet, ValueProcessor } from './types';

export class SimpleDataProcessor<
  Mine extends Record<string, unknown>,
  Theirs extends Record<string, unknown>,
> {
  private mine: ConsumerRuleSet<Theirs, Mine>;
  private theirs: ConsumerRuleSet<Mine, Theirs>;

  constructor(ruleSet: SDPRuleSet<Mine, Theirs>) {
    this.mine = {
      ...ruleSet.mine,
      preProcess:
        ruleSet.mine.preProcess ??
        ((arg: Theirs) => arg as Record<string, unknown>),
      postProcess:
        ruleSet.mine.postProcess ??
        ((arg: Record<string, unknown>) => arg as Mine),
    };
    this.theirs = {
      ...ruleSet.theirs,
      preProcess:
        ruleSet.theirs.preProcess ??
        ((arg: Mine) => arg as Record<string, unknown>),
      postProcess:
        ruleSet.theirs.postProcess ??
        ((arg: Record<string, unknown>) => arg as Theirs),
    };
  }

  convertToTheirs = (myData: Mine): Theirs => {
    const preProcessedData = this.theirs.preProcess!(myData);

    const mappedData = Object.entries(this.theirs.fields).reduce<
      Record<string, unknown>
    >((acc, [theirFieldName, valueProcessorOrMapping]) => {
      let value: unknown;
      if (typeof valueProcessorOrMapping === 'function') {
        // it's a function so we pass the preProcessedData as an argument
        value = (valueProcessorOrMapping as ValueProcessor)(preProcessedData);
      } else {
        // it's a string, so it is a key of preProcessedData
        value =
          preProcessedData[
            valueProcessorOrMapping as keyof typeof preProcessedData
          ];
      }
      acc[theirFieldName] = value;
      return acc;
    }, {});

    return this.theirs.postProcess!(mappedData);
  };

  convertToMine = (theirData: Theirs): Mine => {
    const preProcessedData = this.mine.preProcess!(theirData);

    const mappedData = Object.entries(this.mine.fields).reduce<
      Record<string, unknown>
    >((acc, [myFieldName, valueProcessorOrMapping]) => {
      let value: unknown;
      if (typeof valueProcessorOrMapping === 'function') {
        // it's a function so we pass the preProcessedData as an argument
        value = (valueProcessorOrMapping as ValueProcessor)(preProcessedData);
      } else {
        // it's a string, so it is a key of preProcessedData
        value =
          preProcessedData[
            valueProcessorOrMapping as keyof typeof preProcessedData
          ];
      }
      acc[myFieldName] = value;
      return acc;
    }, {});

    return this.mine.postProcess!(mappedData);
  };
}
