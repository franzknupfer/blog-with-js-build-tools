var Entry = require('./../js/blog.js').entryModule;
var Blog = require('./../js/blog.js').blogModule;

var clearFields = function() {
  $("input#entry").val("");
  $("textarea#content").val("");
};

$(document).ready(function() {

  $("button#signup-blog").click(function() {
    var name = $("input#name").val();
    var author = $("input#author").val();
    var blog = new Blog(name, author);
    $(".signup").hide();
    $(".blog").show();
    $("h1#blog-name").text(blog.name);
    $("h3#blog-author").text(blog.author);
  });


  $("form#new-blog-entry").submit(function(event) {
    event.preventDefault();

    var entry = $("input#entry").val();
    var content = $("textarea#content").val();
    var timeWritten = moment().format("dddd, MMMM Do YYYY");

    var blogEntry = new Entry(entry, content, timeWritten);

    $(".all-entries").append("<h3>" + blogEntry.entryName + "</h3>");
    $(".all-entries").append("<h5>" + blogEntry.timeWritten + "</h5>");
    $(".all-entries").append("<h5>" + blogEntry.getTeaser() + " / " + blogEntry.countWords() + "</h5>");
    $(".all-entries").append("<p>" + blogEntry.entryContent + "<p>");

    clearFields();
  });
});
