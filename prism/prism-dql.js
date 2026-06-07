/**
 * Prism.js language definition for Dynatrace Query Language (DQL)
 *
 * Usage:
 *   ```dql
 *   fetch logs, from:now()-1h
 *   | filter matchesValue(log.source, "pgi.log")
 *   | summarize count(), by:{status}
 *   ```
 *
 * References:
 *   https://docs.dynatrace.com/docs/platform/grail/dynatrace-query-language/dql-reference
 */

Prism.languages.dql = {

	'comment': [
		{
			pattern: /\/\*[\s\S]*?\*\//,
			greedy: true
		},
		{
			pattern: /\/\/.*/,
			greedy: true
		}
	],

	'string': [
		{
			pattern: /"(?:\\[\s\S]|[^\\"])*"/,
			greedy: true
		},
		{
			pattern: /'(?:\\[\s\S]|[^\\'])*'/,
			greedy: true
		},
		{
			pattern: /`(?:\\[\s\S]|[^\\`])*`/,
			greedy: true
		}
	],

	// Duration literals: 1h, 30m, 10s, 7d, 100ms, 1µs, 1ns
	'duration': {
		pattern: /\b\d+(?:\.\d+)?(?:ms|[µu]s|ns|[hmsdwyM])\b/,
		alias: 'number'
	},

	// Pipe operator
	'pipe': {
		pattern: /\|/,
		alias: 'operator'
	},

	// Built-in functions
	'function': {
		pattern: /\b(?:avg|collectArray|collectDistinct|correlation|count|countDistinct|countDistinctApprox|countDistinctExact|countIf|max|median|min|percentile|percentiles|percentileFromSamples|percentRank|stddev|sum|takeAny|takeFirst|takeLast|takeMax|takeMin|variance|concat|contains|decodeUrl|encodeUrl|endsWith|escape|getCharacter|indexOf|jsonField|jsonPath|lastIndexOf|levenshteinDistance|like|lower|matchesPattern|matchesPhrase|matchesValue|parse|parseAll|punctuation|replacePattern|replaceString|splitByPattern|splitString|startsWith|stringLength|substring|trim|unescape|unescapeHtml|upper|asArray|asBinary|asBoolean|asDouble|asDuration|asIp|asLong|asNumber|asRecord|asString|asTimeframe|asTimestamp|asUid|decode|encode|getHighBits|getLowBits|hexStringToNumber|isUid128|isUid64|isUuid|numberToHexString|toArray|toBoolean|toDouble|toDuration|toIp|toLong|toString|toTimeframe|toTimestamp|toUid|type|uid128|uid64|uuid|asSmartscapeId|toSmartscapeId|coalesce|if|isFalseOrNull|isNotNull|isNull|isTrueOrNull|duration|formatTimestamp|getDayOfMonth|getDayOfWeek|getDayOfYear|getEnd|getHour|getMinute|getMonth|getStart|getSecond|getYear|getWeekOfYear|now|timeframe|timestamp|timestampFromUnixMillis|timestampFromUnixNanos|timestampFromUnixSeconds|unixMillisFromTimestamp|unixNanosFromTimestamp|unixSecondsFromTimestamp|array|arrayAvg|arrayConcat|arrayCumulativeSum|arrayDelta|arrayDiff|arrayDistinct|arrayElement|arrayFirst|arrayFlatten|arrayIndexOf|arrayLast|arrayLastIndexOf|arrayMax|arrayMedian|arrayMin|arrayMovingAvg|arrayMovingMax|arrayMovingMin|arrayMovingSum|arrayPercentile|arrayRemoveNulls|arrayReverse|arraySize|arraySlice|arraySort|arraySum|arrayToString|vectorL1Distance|vectorL2Distance|vectorCosineDistance|vectorInnerProductDistance|ip|ipIn|ipIsLinkLocal|ipIsLoopback|ipIsPrivate|ipIsPublic|ipMask|isIp|isIpV4|isIpV6|hashCrc32|hashMd5|hashSha1|hashSha256|hashSha512|hashXxHash32|hashXxHash64|bitwiseAnd|bitwiseCountOnes|bitwiseNot|bitwiseShiftLeft|bitwiseShiftRight|bitwiseOr|bitwiseXor|abs|acos|asin|atan|atan2|bin|ceil|cos|cosh|cbrt|degreeToRadian|e|exp|floor|hypotenuse|log|log1p|log10|pi|power|radianToDegree|random|range|round|signum|sin|sinh|sqrt|tan|tanh|getNodeName|getNodeField|classicEntitySelector|entityAttr|entityName|exists|in|record)(?=\s*\()/,
		greedy: false
	},

	// Commands and keywords
	'keyword': [
		{
			pattern: /\b(?:fetch|filter|filterOut|search|fields|fieldsAdd|fieldsKeep|fieldsRemove|fieldsRename|fieldsFlatten|fieldsSnapshot|fieldsSummary|parse|sort|limit|summarize|makeTimeseries|expand|dedup|append|join|joinNested|lookup|data|describe|load|timeseries|metrics|smartscapeNodes|smartscapeEdges|traverse|and|or|not|xor|in|as|by|from|on|asc|desc|true|false|null)\b/
		},
		{
			pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=:)/,
			alias: 'attr-name'
		}
	],

	// Data types
	'type': /\b(?:string|long|double|boolean|timestamp|duration|timeframe|ip|uid|binary|array|record|smartscapeId)\b/,

	// Numeric literals
	'number': /\b\d+(?:\.\d+)?\b/,

	// Operators
	'operator': /==|!=|<=|>=|[+\-*/%<>=@~]/,

	// Punctuation
	'punctuation': /[[\]{}(),.:]/
};

// Alias
Prism.languages.dynatrace = Prism.languages.dql;
