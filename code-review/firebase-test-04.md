## on\_child\_added 함수 설정하기

`child_added` 이벤트가 발생했을 시, 넘겨줄 함수를 정의한다.  

### 1. 단일 데이터에 대한 html 코드 작성하여 화면에 표시하기
이 함수에서는 데이터베이스에 존재하는 단일 데이터들을 html에서 설정했던 `<div class="book-wrap"></div>` 태그 내부에서 표시해줄 것이다.

다음은 단일 데이터에 적용할 html 구조이다.

```html
// <div class="book-wrap"></div> 내부

<div class="book-container">
	
	<!-- 수정 및 삭제 버튼 -->
	<div class="btns eidt-remove">
		<div class="edit">
			<a onclick="editData(key)">
				<i class="material-icons">mode_edit</i>
			</a>
		</div>
		<div class="remove">
			<a onclick="deleteData(key)">
				<i class="material-icons">delete</i>
			</a>
		</div>
	</div>
	
	<!-- 저장 및 취소 버튼 -->
	<div class="btns save-cancel">
		<div class="add-save">
			<button type="button" name="button" onclick="saveData(key)">
				save
			</button>
		</div>
		<div class="add-cacel">
			<button type="button" name="button" onclick="cancel(key)">
				cancel
			</button>
		</div>
	</div>
	
	<!-- 북 리스트 -->
	<ul class="book-list">
		<li class="book-title origin-data"> title </li>
		<input type="text" name="title" class="editData editTitle" autofocus>
		<li class="publisher origin-data"> pulbisher </li>
		<input type="text" name="title" class="editData editPublisher">
	</ul>

</div>
```
단일 데이터마다 `<div class="book-wrap"></div>` 태그 내부에 위의 html 코드를 작성하여 추가해줄 것이다.   
위의 코드를 완성하기 위해서 필요한 것은  
해당 데이터의 key, title, publisher의 값이다. 
아래와 같이 변수에 해당 값들을 할당한다.

```javascript
function on_child_added(data) {
	var key = data.key
	var bookData = data.val();
	var title = bookData.title;
	var publisher = bookData.publisher;
}
```

- `data.key`를 이용하여 해당 데이터의 key값에 접근할 수 있다.  
- `data.val()`를 이용하여 해당 데이터의 value에 접근할 수 있다.

추가적으로 필요한 것은 이 변수에 할당된 값들을 이용한 html 코드이다.

```javascript
function on_child_added(data) {
	...
	var html = 
		"<div class=\"book-container\" id=\"" + key + "\">" +
		
		// 수정 및 삭제 버튼
		"<div class=\"btns edit-remove\">" +
		"<div class=\"edit\">" +
		"<a onclick=\"editData('"+key+"')\"><i class=\"material-icons\">mode_edit</i></a>" + "</div>" +
		"<div class=\"remove\" >" +
		"<a onclick=\"deleteData('"+key+"')\"><i class=\"material-icons\">delete</i></a>" + "</div>" +  "</div>" +
		
		// 저장 및 취소 버튼
		"<div class=\"btns save-cancel\">" +
		"<div class=\"add-save\">" +
		"<button type=\"button\" name=\"button\" onclick=\"saveData('"+key+"')\">save</button>" + "</div>" +
		"<div class=\"add-cancel\">" +
		"<button type=\"button\" name=\"button\" onclick=\"cancel('"+key+"')\">cancel</button>" + "</div>" + "</div>" +
		
		// 북 리스트
		"<ul class=\"book-list\">" +
		"<li class=\"book-title origin-data\">" + title + "</li>" +
		"<input type=\"text\" name=\"title\" class=\"editData editTitle\" autofocus>"+
		"<li class=\"publisher origin-data\">" + publisher + "</li>" +
		"<input type=\"text\" name=\"publisher\" class=\"editData editPublisher\">"+ "</ul>" + "</div>";
}
```

단일 데이터에 대한 html코드가 준비되었다면, `<div class="book-wrap"></div>` 태그 내부에 해당 html을 추가해준다.

```javascript
function on_child_added(data) {
	...
	$('.book-wrap').append(html);
}
```
### 2. lastCreateDate 설정
1. 현재 데이터의 createDate값을 가져온다. 
2. `<div class="book-wrap"></div>` 태그 내부에  해당 데이터를 이용한 html 코드를 `apppend`한 후 lastCreateDate에 createDate의 값을 할당한다.

```javascript
function on_child_added(data) {
	var createDate = bookData.createDate;
	...
	$('.book-wrap').append(html);
	lastCreateDate = createDate;
}
```
위와 같이 작성하면 함수의 마지막 동작은, lastCreateDate 변수에는 `append`를 마친 데이터의 createDate값을 할당하게된다.

### 3. 최신순으로 데이터 보여주기
lastCreateDate (`append`가 된 가장 마지막 데이터의 createDate의 값) 보다 현재 추가된 데이터의 createDate의 값이 작다면 해당 데이터의 html 코드는 `prepend`를 이용하여 화면 상단에 표시한다.

```javascript
function on_child_added(data) {
	...
	if ( lastCreateDate > createDate ){
		$('.book-wrap').prepend(html);
	} else {
		$('.book-wrap').append(html);
		lastCreateDate = createDate;
  }
  isLoading = false;
}
```

### 4. 중복 제거
`lastCreateDate`를 활용하여 중복 데이터가 화면에 표시되는 것을 막을 수 있다.

데이터를 불러오는 코드를 보면 처음 호출을 제외하면 21개의 데이터를 가져오게된다. 
중복을 제거하는 방법은, `on_child_added`에 들어온 데이터의 `createDate`가 `lastCreateDate`와 같다면 함수를 종료하게 하는 것이다.  
`on_child_added` 함수의 상단에 아래와 같이 작성하면, 중복된 데이터가 화면에 표시될 일은 없다. 

```javascript
function on_child_added(data) {
	if (createDate == lastCreateDate) {
	    isLoading = false;
	    return;
	  }
	...
}
```



