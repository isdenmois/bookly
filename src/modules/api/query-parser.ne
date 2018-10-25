@builtin "whitespace.ne"
@builtin "postprocessors.ne"

main -> "query" _ "{" _ body _ "}" {% nth(4) %}

body -> request (__ request):* {% extractArray %}

request -> endpoint _ "{" _ fields _ "}" {% d => ({...d[0], fields: d[4].join(',')}) %}

endpoint -> identifier {% d => ({endpoint: d[0]}) %}
endpoint -> identifier _ "(" _ "params:" _ "[" _ params _ "]" _ ")" {% d => ({endpoint: d[0], params: d[8]})%}

params -> param (__ param):* {% extractArray %}

param -> "\"" identifier "\"" {% nth(1) %}
param -> "\"" identifier "\"," {% nth(1) %}

fields -> field (__ field):* {% extractArray %}

field -> identifier {% nth(0) %}
field -> identifier _ "{" _ fields _ "}" {% function(d) { return d[0] + '(' + d[4] + ')'} %}

upperCase -> [A-Z] identifier
lowerCase -> [a-z] identifier
identifier -> [a-zA-Z_0-9]:+ {% fromString %}

@{%
function fromString (d) { return d[0].join('') }

function extractArray(d) {
    let output = [d[0]];

    for (let i in d[1]) {
        output.push(d[1][i][1]);
    }

    return output;
}
%}
