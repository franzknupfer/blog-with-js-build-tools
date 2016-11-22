function Blog(name) {
  this.name = name;
}

function Entry(entryName, entryContent) {
  this.entryName = entryName;
  this.entryContent = entryContent;
}

Entry.prototype.getTeaser = function() {
  var entry = this.entryContent.split(" ")
  var teaser = []
  for (var i = 0; i <= entry.length; i++) {
    teaser.push(entry[i]);
    if (i === 7) { break; }
  }
  teaser = teaser.join(' ') + "..."
  return teaser;
}

var clearFields = function() {
  $("input#entry").val("");
  $("textarea#content").val("");
}

exports.entryModule = Entry;
