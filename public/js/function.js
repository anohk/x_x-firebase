
// 추가 버튼을 눌렀을 때 inputForm을 보여준다.
function showInputForm() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  document.getElementById('inputForm').style.display = 'block';
}

// 취소 버튼을 눌렀을 때 inputForm을 숨기고 입력한 데이터 초기화.
function hideInputForm() {
  var element = document.getElementById('inputForm');
  changeDisplayOfElement(element, 'none')
  $('#input-title').val('');
  $('#input-publisher').val('');
}


// 수정 버튼을 눌렀을 때 동작
// 기존의 값을 input에 유지
// 수정, 삭제 버튼을 숨기고 저장, 취소 버튼 보여줌
function editData(key) {
  var targetElement = document.getElementById(key);

  var originDataList = targetElement.getElementsByClassName('origin-data');
  changeDisplayOfElementList(originDataList, 'none');

  var editDataList = targetElement.getElementsByClassName('editData');
  changeDisplayOfElementList(editDataList, 'block');

  var editTitle = editDataList['title']
  var editPublisher = editDataList['publisher']
  var originTitle = originDataList[0].textContent;
  var originPublisher = originDataList[1].textContent;
  $(editTitle).val(originTitle);
  $(editPublisher).val(originPublisher);

  var element = document.getElementById('save-cancel');
  changeDisplayOfElement(element, 'inline-block');

  var element = document.getElementById('edit-remove');
  changeDisplayOfElement(element, 'none');
}


// 삭제 버튼을 눌렀을 때 동작
function deleteData(key) {
  if ( !confirm('이 책을 지우시겠습니까?') ) {
    return;
  }
  var bookshelfRef = database.ref('bookshelf/'+key)
  bookshelfRef.remove();
  $('#'+key).remove();
}


// 저장 버튼을 눌렀을 때 동작
// 수정 후 저장의 경우 (키 값이 있는 경우) 데이터를 업데이트
// 저장, 취소 버튼을 숨기고 저장, 삭제 버튼 보여줌
// --------------------------------------------
// 새로운 데이터를 저장하는 경우 데이터를 생성
// 입력창을 숨김
function saveData(key){
  var bookshelfRef = database.ref('bookshelf');

  if ( !key == '' ){
    console.log('edit!');
    var targetElement = document.getElementById(key);
    var editDataList = targetElement.getElementsByClassName('editData')
    var title = $(editDataList[0]).val();
    var publisher = $(editDataList[1]).val();

    bookshelfRef = database.ref('bookshelf/'+key)
    bookshelfRef.update({
      title : title,
      publisher : publisher,
    });

    var originDataList = targetElement.getElementsByClassName('origin-data');
    changeDisplayOfElementList(originDataList, 'block');

    var editDataList = targetElement.getElementsByClassName('editData');
    changeDisplayOfElementList(editDataList, 'none');

    var element = document.getElementById('save-cancel');
    changeDisplayOfElement(element, 'none');

    var element = document.getElementById('edit-remove');
    changeDisplayOfElement(element, 'inline-block');

  } else {
    console.log('create!');
    title = $('#input-title').val();
    publisher = $('#input-publisher').val();

    bookshelfRef.push({
      title : title,
      publisher : publisher,
      createDate: Number.MAX_SAFE_INTEGER - new Date().getTime()
    });
    hideInputForm();
  }
}

// 취소 버튼을 눌렀을 때 동작
// 수정 중이던 입력 창을 숨기고 이전 데이터를 보여줌
// 저장, 취소 버튼을 숨기고 수정, 삭제 버튼을 보여줌
function cancel(key) {
  var targetElement = document.getElementById(key);

  var originDataList = targetElement.getElementsByClassName('origin-data');
  changeDisplayOfElementList(originDataList, 'block');

  var editDataList = targetElement.getElementsByClassName('editData');
  changeDisplayOfElementList(editDataList, 'none');

  var element = document.getElementById('save-cancel');
  changeDisplayOfElement(element, 'none');

  var element = document.getElementById('edit-remove');
  changeDisplayOfElement(element, 'inline-block');
}



function changeDisplayOfElement(element, attr) {
  element.style.display = attr;
}

function changeDisplayOfElementList(list, attr) {
  for (i=0; i < list.length; i++){
    changeDisplayOfElement(list[i], attr);
  }
}
