var Entry = require('./../js/blog.js').entryModule;

var clearFields = function() {
  $("input#entry").val("");
  $("textarea#content").val("");
};

$(document).ready(function() {
  $("form#new-blog-entry").submit(function(event) {
    event.preventDefault();

    var entry = $("input#entry").val();
    var content = $("textarea#content").val();

    var blogEntry = new Entry(entry, content);

    $(".all-entries").append("<h3>" + blogEntry.entryName + "</h3>");
    $(".all-entries").append("<h5>" + blogEntry.getTeaser() + " / " + blogEntry.countWords() + "</h5>");
    $(".all-entries").append("<p>" + blogEntry.entryContent + "<p>");

    clearFields();
  });
});
