export const DQL_COMMANDS = new Set([
	"append", "data", "dedup", "describe", "expand", "fetch", "fields",
	"fieldsAdd", "fieldsFlatten", "fieldsKeep", "fieldsRemove", "fieldsRename",
	"fieldsSnapshot", "fieldsSummary", "filter", "filterOut", "join", "joinNested",
	"limit", "load", "lookup", "makeTimeseries", "metrics", "parse", "search",
	"smartscapeEdges", "smartscapeNodes", "sort", "summarize", "timeseries",
	"traverse",
]);

export const DQL_KEYWORDS = new Set([
	"and", "or", "not", "xor", "in", "as", "by", "from", "on",
	"asc", "desc", "true", "false", "null",
]);

export const DQL_TYPES = new Set([
	"string", "long", "double", "boolean", "timestamp", "duration",
	"timeframe", "ip", "uid", "binary", "array", "record", "smartscapeId",
]);

export const DQL_FUNCTIONS = new Set([
	// Aggregation
	"avg", "collectArray", "collectDistinct", "correlation", "count",
	"countDistinct", "countDistinctApprox", "countDistinctExact", "countIf",
	"max", "median", "min", "percentile", "percentiles",
	"percentileFromSamples", "percentRank", "stddev", "sum", "takeAny",
	"takeFirst", "takeLast", "takeMax", "takeMin", "variance",
	// String
	"concat", "contains", "decodeUrl", "encodeUrl", "endsWith", "escape",
	"getCharacter", "indexOf", "jsonField", "jsonPath", "lastIndexOf",
	"levenshteinDistance", "like", "lower", "matchesPattern", "matchesPhrase",
	"matchesValue", "parseAll", "punctuation", "replacePattern",
	"replaceString", "splitByPattern", "splitString", "startsWith",
	"stringLength", "substring", "trim", "unescape", "unescapeHtml", "upper",
	// Conversion / casting
	"asArray", "asBinary", "asBoolean", "asDouble", "asDuration", "asIp",
	"asLong", "asNumber", "asRecord", "asString", "asTimeframe", "asTimestamp",
	"asUid", "decode", "encode", "getHighBits", "getLowBits",
	"hexStringToNumber", "isUid128", "isUid64", "isUuid", "numberToHexString",
	"toArray", "toBoolean", "toDouble", "toDuration", "toIp", "toLong",
	"toString", "toTimeframe", "toTimestamp", "toUid", "type", "uid128",
	"uid64", "uuid", "asSmartscapeId", "toSmartscapeId",
	// Conditional
	"coalesce", "if",
	// Boolean
	"isFalseOrNull", "isNotNull", "isNull", "isTrueOrNull",
	// Time
	"formatTimestamp", "getDayOfMonth", "getDayOfWeek", "getDayOfYear",
	"getEnd", "getHour", "getMinute", "getMonth", "getStart", "getSecond",
	"getYear", "getWeekOfYear", "now", "timeframe", "timestamp",
	"timestampFromUnixMillis", "timestampFromUnixNanos",
	"timestampFromUnixSeconds", "unixMillisFromTimestamp",
	"unixNanosFromTimestamp", "unixSecondsFromTimestamp",
	// Array
	"arrayAvg", "arrayConcat", "arrayCumulativeSum", "arrayDelta", "arrayDiff",
	"arrayDistinct", "arrayElement", "arrayFirst", "arrayFlatten",
	"arrayIndexOf", "arrayLast", "arrayLastIndexOf", "arrayMax", "arrayMedian",
	"arrayMin", "arrayMovingAvg", "arrayMovingMax", "arrayMovingMin",
	"arrayMovingSum", "arrayPercentile", "arrayRemoveNulls", "arrayReverse",
	"arraySize", "arraySlice", "arraySort", "arraySum", "arrayToString",
	// Vector
	"vectorL1Distance", "vectorL2Distance", "vectorCosineDistance",
	"vectorInnerProductDistance",
	// Network
	"ipIn", "ipIsLinkLocal", "ipIsLoopback", "ipIsPrivate", "ipIsPublic",
	"ipMask", "isIpV4", "isIpV6",
	// Hash
	"hashCrc32", "hashMd5", "hashSha1", "hashSha256", "hashSha512",
	"hashXxHash32", "hashXxHash64",
	// Bitwise
	"bitwiseAnd", "bitwiseCountOnes", "bitwiseNot", "bitwiseShiftLeft",
	"bitwiseShiftRight", "bitwiseOr", "bitwiseXor",
	// Math
	"abs", "acos", "asin", "atan", "atan2", "bin", "ceil", "cos", "cosh",
	"cbrt", "degreeToRadian", "e", "exp", "floor", "hypotenuse", "log",
	"log1p", "log10", "pi", "power", "radianToDegree", "random", "range",
	"round", "signum", "sin", "sinh", "sqrt", "tan", "tanh",
	// Join
	"getNodeName", "getNodeField",
	// General
	"classicEntitySelector", "entityAttr", "entityName", "exists", "record",
]);

type TokenType =
	| "comment" | "string" | "backtick"
	| "pipe" | "operator" | "number" | "duration"
	| "keyword" | "function" | "type" | "field" | null;

interface Token {
	type: TokenType;
	end: number;
}

export function nextToken(line: string, pos: number): Token {
	const ch = line[pos];

	// Block comment
	if (line.startsWith("/*", pos)) {
		const end = line.indexOf("*/", pos + 2);
		return { type: "comment", end: end >= 0 ? end + 2 : line.length };
	}

	// Line comment
	if (line.startsWith("//", pos)) {
		return { type: "comment", end: line.length };
	}

	// Double-quoted string
	if (ch === '"') {
		let i = pos + 1;
		while (i < line.length) {
			if (line[i] === "\\") { i += 2; continue; }
			if (line[i] === '"') { i++; break; }
			i++;
		}
		return { type: "string", end: i };
	}

	// Single-quoted string
	if (ch === "'") {
		let i = pos + 1;
		while (i < line.length) {
			if (line[i] === "\\") { i += 2; continue; }
			if (line[i] === "'") { i++; break; }
			i++;
		}
		return { type: "string", end: i };
	}

	// Backtick-quoted identifier
	if (ch === "`") {
		let i = pos + 1;
		while (i < line.length) {
			if (line[i] === "\\") { i += 2; continue; }
			if (line[i] === "`") { i++; break; }
			i++;
		}
		return { type: "backtick", end: i };
	}

	// Pipe
	if (ch === "|") {
		return { type: "pipe", end: pos + 1 };
	}

	// Multi-char operators
	if (line.startsWith("<=", pos)) return { type: "operator", end: pos + 2 };
	if (line.startsWith(">=", pos)) return { type: "operator", end: pos + 2 };
	if (line.startsWith("==", pos)) return { type: "operator", end: pos + 2 };
	if (line.startsWith("!=", pos)) return { type: "operator", end: pos + 2 };

	// Single-char operators
	if (ch === "<" || ch === ">" || ch === "=") return { type: "operator", end: pos + 1 };
	if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "%") return { type: "operator", end: pos + 1 };
	if (ch === "@" || ch === "~") return { type: "operator", end: pos + 1 };

	// Numbers — optionally followed by a duration suffix
	const numM = line.slice(pos).match(/^\d+(\.\d+)?/);
	if (numM) {
		const end = pos + numM[0].length;
		const durMatch = line.slice(end).match(/^(ms|[µu]s|ns|h|m|s|d|w|M|y)(?=\b|$)/);
		if (durMatch) {
			return { type: "duration", end: end + durMatch[0].length };
		}
		return { type: "number", end: end };
	}

	// Identifiers
	const wordM = line.slice(pos).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
	if (wordM) {
		const word = wordM[0];
		const after = pos + word.length;

		// Named parameter: word followed by ":" (but not "::")
		if (line[after] === ":" && line[after + 1] !== ":") {
			return { type: "keyword", end: after + 1 };
		}

		if (DQL_KEYWORDS.has(word)) return { type: "keyword", end: after };
		if (DQL_COMMANDS.has(word)) return { type: "keyword", end: after };
		if (DQL_TYPES.has(word)) return { type: "type", end: after };
		if (DQL_FUNCTIONS.has(word)) return { type: "function", end: after };
		return { type: "field", end: after };
	}

	// Single unrecognized char
	return { type: null, end: pos + 1 };
}

const TOKEN_CLASS: Record<string, string> = {
	"comment":  "dql-comment",
	"string":   "dql-string",
	"backtick": "dql-backtick",
	"pipe":     "dql-pipe",
	"operator": "dql-operator",
	"number":   "dql-number",
	"duration": "dql-duration",
	"keyword":  "dql-keyword",
	"function": "dql-function",
	"type":     "dql-type",
	"field":    "dql-field",
};

export function highlightDQL(
	source: string,
	label = "DQL",
	options?: { showCopyButton?: boolean; fontSize?: string }
): HTMLElement {
	const { showCopyButton = true, fontSize } = options ?? {};

	const wrapper = activeDocument.createElement("div");
	wrapper.className = "dql-wrapper";

	const controls = activeDocument.createElement("div");
	controls.className = "dql-controls";

	const flair = activeDocument.createElement("div");
	flair.className = "dql-flair";
	flair.textContent = label;
	controls.appendChild(flair);

	if (showCopyButton) {
		const copyBtn = activeDocument.createElement("button");
		copyBtn.className = "dql-copy-btn";
		copyBtn.textContent = "Copy";
		copyBtn.addEventListener("click", () => {
			void navigator.clipboard.writeText(source).then(() => {
				copyBtn.textContent = "Copied!";
				copyBtn.classList.add("dql-copy-btn--success");
				window.setTimeout(() => {
					copyBtn.textContent = "Copy";
					copyBtn.classList.remove("dql-copy-btn--success");
				}, 2000);
			});
		});
		controls.appendChild(copyBtn);
	}

	wrapper.appendChild(controls);

	const pre = activeDocument.createElement("pre");
	pre.className = "dql-block";
	if (fontSize) {
		pre.style.fontSize = fontSize;
	}
	wrapper.appendChild(pre);

	const code = activeDocument.createElement("code");
	pre.appendChild(code);

	const lines = source.split("\n");
	for (let i = 0; i < lines.length; i++) {
		appendLine(code, lines[i]);
		if (i < lines.length - 1) {
			code.appendChild(activeDocument.createTextNode("\n"));
		}
	}

	return wrapper;
}

function appendLine(parent: HTMLElement, line: string) {
	let pos = 0;
	while (pos < line.length) {
		if (/\s/.test(line[pos])) {
			const start = pos;
			while (pos < line.length && /\s/.test(line[pos])) pos++;
			parent.appendChild(activeDocument.createTextNode(line.slice(start, pos)));
			continue;
		}

		const tok = nextToken(line, pos);
		const text = line.slice(pos, tok.end);

		if (tok.end <= pos) {
			parent.appendChild(activeDocument.createTextNode(line[pos]));
			pos++;
			continue;
		}

		if (tok.type && TOKEN_CLASS[tok.type]) {
			const span = activeDocument.createElement("span");
			span.className = TOKEN_CLASS[tok.type];
			span.textContent = text;
			parent.appendChild(span);
		} else {
			parent.appendChild(activeDocument.createTextNode(text));
		}

		pos = tok.end;
	}
}
