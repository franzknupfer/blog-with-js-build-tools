function Blog(name, author) {
  this.name = name;
  this.author = author;
  this.totalEntries = 0;
}

function Entry(entryName, entryContent, timeWritten) {
  this.entryName = entryName;
  this.entryContent = entryContent;
  this.timeWritten = timeWritten;
}

Blog.prototype.tallyEntries = function() {
  this.totalEntries +=1;
};

Entry.prototype.countWords = function() {
  return this.entryContent.split(" ").length + " words";
};

Entry.prototype.getTeaser = function() {
  var entry = this.entryContent.split(" ");
  var teaser = [];
  for (var i = 0; i <= entry.length; i++) {
    teaser.push(entry[i]);
    if (i === 7) { break; }
  }
  teaser = teaser.join(' ') + "...";
  return teaser;
};

exports.entryModule = Entry;
exports.blogModule = Blog;
