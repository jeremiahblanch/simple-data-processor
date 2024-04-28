"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleDataProcessor = void 0;
var passThroughProcessor = function (arg0) { return arg0; };
var SimpleDataProcessor = /** @class */ (function () {
    function SimpleDataProcessor(ruleSet) {
        var _this = this;
        var _a, _b, _c, _d;
        this.convertToTheirs = function (myData) {
            var preProcessedData = _this.theirs.preProcess(myData);
            var mappedData = Object.entries(_this.theirs.fields)
                .reduce(function (acc, _a) {
                var theirFieldName = _a[0], valueProcessorOrMapping = _a[1];
                var value;
                if (typeof valueProcessorOrMapping === 'string') {
                    // it's a straight mapping to a field on myData
                    value = preProcessedData[valueProcessorOrMapping];
                }
                else { // it's a function
                    value = valueProcessorOrMapping(preProcessedData);
                }
                acc[theirFieldName] = value;
                return acc;
            }, {});
            return _this.theirs.postProcess(mappedData);
        };
        this.convertToMine = function (theirData) {
            var preProcessedData = _this.mine.preProcess(theirData);
            var mappedData = Object.entries(_this.mine.fields)
                .reduce(function (acc, _a) {
                var myFieldName = _a[0], valueProcessorOrMapping = _a[1];
                var value;
                if (typeof valueProcessorOrMapping === 'string') {
                    // it's a straight mapping to a field on theirData
                    value = preProcessedData[valueProcessorOrMapping];
                }
                else { // it's a function
                    value = valueProcessorOrMapping(preProcessedData);
                }
                acc[myFieldName] = value;
                return acc;
            }, {});
            return _this.mine.postProcess(mappedData);
        };
        ruleSet.mine.preProcess = (_a = ruleSet.mine.preProcess) !== null && _a !== void 0 ? _a : passThroughProcessor;
        ruleSet.mine.postProcess = (_b = ruleSet.mine.postProcess) !== null && _b !== void 0 ? _b : passThroughProcessor;
        ruleSet.theirs.preProcess = (_c = ruleSet.theirs.preProcess) !== null && _c !== void 0 ? _c : passThroughProcessor;
        ruleSet.theirs.postProcess = (_d = ruleSet.theirs.postProcess) !== null && _d !== void 0 ? _d : passThroughProcessor;
        this.mine = ruleSet.mine;
        this.theirs = ruleSet.theirs;
    }
    return SimpleDataProcessor;
}());
exports.SimpleDataProcessor = SimpleDataProcessor;
