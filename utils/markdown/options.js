const showdown = require('showdown');

// Set markdown flavor as GitHub markdown.
showdown.setFlavor('github');

// Set parsing of YAML metadata fields.
showdown.setOption('metadata', true);
// Allow users to mention users using GitHub.
showdown.setOption('ghMentions', true);
// Enable emoji support.
showdown.setOption('emoji', true);
