var isLoading = false;
var lastKey;
$(window).scroll(function(){
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    if(isLoading == false) {
      loadBookList();
    }
  }
});

function loadBookList(){
  // loadBookList가 실행되고 있는 도중에는 스크롤 이벤트 발생하지 않음
  isLoading = true;
  var bookshelfRef = database.ref('bookshelf/').orderByKey();

  if (lastKey) {
    // 만약 마지막 키 값이 있다면 21개의 데이터 호출 , 데이터의 시작을 lastKey 보다 크거나 같은 값으로 변경
    bookshelfRef = bookshelfRef.limitToFirst(21).startAt(lastKey);

  } else {
    // 처음에는 20개의 데이터 호출
    bookshelfRef = bookshelfRef.limitToFirst(20)

  }

  bookshelfRef.on('child_added', on_child_added);

}

function on_child_added(data) {
  if (data.key == lastKey) {
    isLoading = false;
    return;
  }

  var bookData = data.val();
  var title = bookData.title;
  var publisher = bookData.publisher;
  var html =
  "<div class=\"book-container\">" +
  "<div class=\"btns\">" +
  "<div class=\"edit\">" +
  "<a><i class=\"material-icons\">add</i></a>" +
  "</div>" +
  "<div class=\"remove\">" +
  "<a><i class=\"material-icons\">remove</i></a>" +
  "</div>" +
  "</div>" +
  "<ul class=\"book-list\">" +
  "<li class=\"book_name\">" + title + "</li>" +
  "<li class=\"publisher\">" + publisher + "</li>" +
  "</ul>" +
  "</div>";

  $(".bookshelf").append(html);

  lastKey = data.key
  isLoading = false;
}
