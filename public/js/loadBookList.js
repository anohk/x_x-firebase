var isLoading = false;
var firstKey, prevKey, dataLen;
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
  var bookshelfRef = database.ref('bookshelf/').orderByKey();

  if (firstKey) {
    // 만약 마지막 키 값이 있다면 21개의 데이터 호출 : 이후 중복 체크해서 제거해야함
    // 데이터의 시작을 firstKey 보다 작거나 같은 값으로 변경
    bookshelfRef = bookshelfRef.limitToLast(21).endAt(firstKey);
    prevKey = firstKey;
    firstKey = null;
    pagenumber += 1;

  } else {
    // 처음에는 데이터의 마지막에서 20개의 데이터 호출
    // console.log('first');
    bookshelfRef = bookshelfRef.limitToLast(20)
  }

  bookshelfRef.on('value', function(dataList){
    dataLen = dataList.val()
    console.log(Object.keys(dataLen).length);
  });

  // TODO 마지막 데이터가 호출 된 후, 함수를 종료해야한다.
  // 현재 스크롤을 끝까지 내리면, 데이터를 더 불러 오지 않지만,
  // 스크롤을 위로 올렸다가 다시 내리면 처음 데이터부터 다시 순회하며 출력하고 있음.
  if ( dataLen == 1 ){
    return;
  } else {
    $(".bookshelf").append("<div class=\"prepend" + pagenumber + "\"></div>");
    bookshelfRef.on('child_added', on_child_added);
    bookshelfRef.on('child_changed', on_child_changed);
  }

}

function on_child_added(data) {
  // console.log(data);
  // 데이터 중복 체크
  // prevKey = 이전 loadBookList를 실행했을 때의 firstKey
  // prevKey와 일치하는 data.key를 가진 data는 이미 사용했기 때문에 중복 제거
  if (data.key == prevKey) {
    isLoading = false;
    return;
  }

  var key = data.key
  var bookData = data.val();
  var title = bookData.title;
  var publisher = bookData.publisher;
  var html =
  "<div class=\"book-container\" id=\"" + key + "\">" +

    "<div class=\"btns\">" +
    "<div class=\"edit\">" +
    "<a onclick=\"editData('"+key+"')\"><i class=\"material-icons\">mode_edit</i></a>" +
    "</div>" +
    "<div class=\"remove\" >" +
    "<a onclick=\"deleteData('"+key+"')\"><i class=\"material-icons\">delete</i></a>" +
    "</div>" +
    "</div>" +

  "<ul class=\"book-list\">" +

    "<li class=\"book-title origin-data\">" + title + "</li>" +
    "<input type=\"text\" name=\"title\" class=\"editData editTitle\">"+
    "<li class=\"publisher origin-data\">" + publisher + "</li>" +
    "<input type=\"text\" name=\"publisher\" class=\"editData editPublisher\">"+
    "<button type=\"button\" name=\"button\" onclick=\"saveData('"+key+"')\" class=\"input-btn\">save</button>" +
    "<button type=\"button\" name=\"button\" onclick=\"hideInputForm()\" class=\"input-btn\">cancel</button>"+

  "</ul>" +

  "</div>";
  $(".prepend"+pagenumber).prepend(html)

  if ( firstKey == null  ) {
    firstKey = data.key
  }
  isLoading = false;
}

function on_child_changed(data) {
  var key = data.key;
  var data = data.val();
  var title = data.title;
  var publisher = data.publisher;
  console.log(data);
  console.log(title);
  console.log(publisher);

  // $('#'+key).find('.book-title').text(title)
  // $('#'+key).find('.publisher').text(publisher)
  
  $('#'+key+ " > ul.book-list > li.book-title").text(title);
  $('#'+key+ " > ul.book-list > li.publisher").text(publisher);
}
