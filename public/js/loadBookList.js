var isLoading = false;
var firstKey, prevKey, dataLen;
var lastCreateDate = 0;
var pagenumber = 0;


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
  var bookshelfRef = database.ref('bookshelf/').orderByChild('createDate');

  if (lastCreateDate) {
    // 만약 lastCreateDate가 있다면 21개의 데이터 호출 : 이후 중복 체크해서 제거해야함
    // 데이터는 createDate(정렬기준)가 lastCreateDate 보다 같거나 큰 값을 갖는 것 부터 시작
    bookshelfRef = bookshelfRef.limitToFirst(21).startAt(lastCreateDate);
  } else {
    // 처음에는 데이터의 처음부터 20개의 데이터 호출
    bookshelfRef = bookshelfRef.limitToFirst(20)
  }
  bookshelfRef.on('child_added', on_child_added);
  bookshelfRef.on('child_changed', on_child_changed);
}


// 데이터베이스에 데이터가 추가되는 이벤트가 있을 때 동작
function on_child_added(data) {

  // 데이터 중복 체크
  var bookData = data.val();
  var createDate = bookData.createDate;
  if (createDate == lastCreateDate) {
    isLoading = false;
    return;
  }

  var key = data.key
  var title = bookData.title;
  var publisher = bookData.publisher;
  var html =
  "<div class=\"book-container\" id=\"" + key + "\">" +
  // 수정 삭제 버튼
  "<div class=\"btns\" id=\"edit-remove\">" +
  "<div class=\"edit\">" +
  "<a onclick=\"editData('"+key+"')\"><i class=\"material-icons\">mode_edit</i></a>" +
  "</div>" +
  "<div class=\"remove\" >" +
  "<a onclick=\"deleteData('"+key+"')\"><i class=\"material-icons\">delete</i></a>" +
  "</div>" +
  "</div>" +

  // 저장 취소 버튼
  "<div class=\"btns\" id=\"save-cancel\">" +
  "<div class=\"add-save\">" +
  "<button type=\"button\" name=\"button\" onclick=\"saveData('"+key+"')\">save</button>" +
  "</div>" +
  "<div class=\"add-cancel\">" +
  "<button type=\"button\" name=\"button\" onclick=\"cancel('"+key+"')\">cancel</button>"+
  "</div>" +
  "</div>" +

  // 북 리스트
  "<ul class=\"book-list\">" +
  "<li class=\"book-title origin-data\">" + title + "</li>" +
  "<input type=\"text\" name=\"title\" class=\"editData editTitle\" autofocus>"+
  "<li class=\"publisher origin-data\">" + publisher + "</li>" +
  "<input type=\"text\" name=\"publisher\" class=\"editData editPublisher\">"+

  "</ul>" +
  "</div>";

  // 조회가 일어난 가장 마지막 데이터의 createDate의 값 보다
  // 현재 추가된 데이터의 createDate의 값이 작다면
  // 데이터를 가장 상위에서 보여준다.
  if ( lastCreateDate > createDate ){
    $('.book-wrap').prepend(html);
  } else {
    $('.book-wrap').append(html);
    lastCreateDate = createDate;
  }
  isLoading = false;
}


// 데이터베이스에 데이터가 수정되는 이벤트가 있을 때 동작
function on_child_changed(data) {
  var key = data.key;
  var data = data.val();
  var title = data.title;
  var publisher = data.publisher;

  $('#'+key+ " > ul.book-list > li.book-title").text(title);
  $('#'+key+ " > ul.book-list > li.publisher").text(publisher);
}
