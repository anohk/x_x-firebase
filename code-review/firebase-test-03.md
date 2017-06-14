### 목표

1. 데이터베이스에 있는 데이터를 리스트로 화면에 표시해준다.
2. 화면 최하단에서 스크롤시 20개의 데이터를 추가 조회
3. 최신 데이터가 가장 상위에 위치하게 한다.
4. 화면에서 데이터를 추가하면 데이터베이스와 화면 리스트에서 모두 반영한다. 
5. 화면에서 데이터를 수정하면 데이터베이스와 화면 모두 반영한다.

## 데이터 조회하여 리스트로 만들기

`loadBookList()` 메서드를 기존의 html 파일 내부에 임포트하고 호출한다.

```html
<html>
...
<script src="js/loadBookList.js"></script>

loadBookList();

</html>
```

`js`폴더 내부에 `loadBookList.js` 파일을 생성 후, 내용을 작성한다.


### 1. 스크롤 시 이벤트 적용하기
`loadBookList()` 함수에는 데이터를 20개씩 보여주는 내용을 작성할 것이다.   
화면 하단에서 스크롤을 내릴 때마다 `loadBookList()`를 호출하면 스크롤 시 20개의 데이터를 조회할 수 있다. 

```javascript
// loadBookList.js

var isLoading = false;

$(window).scroll(function(){
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    if(isLoading == false) {
      loadBookList();
    }
  }
});

function loadBookList(){
	isLoading = true;
}
```

스크롤 이벤트가 발생할 때, `isLoading`이 `false`일 경우에만 `loadBookList()` 함수를 실행한다.

1. `isLoading` 이라는 변수의 초기 값은 `false`이다.
2. `loadBookList()`를 실행
3. `loadBookList()` 함수로 진입했을 때 `isLoading`의 값은 `true`로 변경된다. 

`isLoading`의 값이 `true`로 변경되었을 때에는 스크롤 이벤트가 발생하더라도,   
`if(isLoading == false)` 조건을 만족시키지 못하기 때문에 `loadBookList()`를 실행할 수 없다.   

이런 조건을 추가해주지 않으면 화면 하단에서 스크롤 이벤트가 발생하고, `loadBookList()`가 실행되는 동안 스크롤 이벤트가 또 발생하면 `loadBookList()`를 다시 호출하기 때문에 화면에 표시되는 데이터가 꼬이게 된다. 


### 2. 데이터 읽어오기
데이터베이스를 읽거나 쓰려면 `firebase.database.Reference` 객체가 필요하다.
이에 접근하는 방법은 다음과 같다.

```
var database = firebase.database();
```

`bookshelfRef`라는 지역변수에 다음과 같이 firebase 프로젝트의 데이터베이스를 할당해준다.  
`orderByChild()`를 사용하면  지정된 하위 key를 포함하는 데이터를 정렬할 수 있다. 여기에선 `createDate`를 기준으로 정렬한다. 

```
bookshelfRef = firebase.database().ref('bookshelf').orderByChild('createDate');
```
> `orderByKey()`: key를 기준으로 오름차순 정렬  
> `orderByValue()`: value를 기준으로 정렬

### 3. 데이터 20개씩 가져오기
데이터를 처음부터 20개만 가져오는 것은 다음과 같이 작성할 수 있다.
`bookshelfRef = bookshelfRef.limitToFirst(20)`

| Method | Usage |
| --- | --- |
| limitToFirst() | 순서가 지정된 결과 목록의 처음부터 리턴 할 최대 항목의 개수를 설정한다 |
| limitToLast() | 순서가 지정된 결과 목록의 마지막부터 리턴 할 최대 항목의 개수를 설정한다 |
| startAt() | 선택한 방식에 따라 지정된 키 또는 값보다 크거나 같은 항목을 리턴한다 |
| endAt() | 선택한 방식에 따라 지정된 키 또는 값보다 작은 같은 항목을 리턴한다 |
| equalTo() | 선택한 방식에 따라 지정된 키 또는 값과 같은 항목을 리턴한다 |

> `limitToFirst()`와 `limitToLast()`의 설명을 보면 **순서가 지정된 결과 목록** 이 전제가 된다.   
> 이 말은 읽어온 데이터베이스가 정렬되어 있어야한다는 것을 뜻한다.  
> 현재 bookshelfRef 는 위에서 `orderByChild('createDate')` 를 이용해 데이터를 생성순으로 정렬해 놓은 상태이다. 

### 4. 다음 20개의 데이터 가져오기
하지만 위와 같이 설정하고 끝난다면, 데이터를 생성순으로 20개밖에 가져올 수 없다. 그 다음 데이터를 가져오려면 어떻게 해야하나?  
여기에서 `startAt()`을 사용하였다. 
`startAT()`에 마지막 20번째 데이터의 `createDate`를 기준으로 다시 20개를 불러올 수 있다.   
`bookshelfRef = bookshelfRef.limitToFirst(20).startAt(lastCreateDate);` 
> 마지막 20번째의 데이터의 생성일 값을 `lastCreateDate`라는 변수에 할당한다.  

이렇게 작성했을 때 문제가 생긴다. 
상단 메서드의 용법을 보면, `startAt()`과  `endAT()`는 기준값도 포함하고 있다. (크거나 같은 항목, 작거나 같은 항목)  
따라서 출력해보면,   

`1 번째 데이터 - 20 번째 데이터`,  
`20 번째 데이터` - `29 번째 데이터`,  
...

이렇게 중복되는 결과를 갖게된다. 

해결은 다음과 같이 첫 호출 이외에는 21개 데이터를 가져오고, 나중에 중복처리를 해주었다.  
`bookshelfRef = bookshelfRef.limitToFirst(21).startAt(lastCreateDate);`  


## 읽기 이벤트 

| Event | Usage |
| --- | --- |
| value | 읽기 이벤트 발생 시점에 특정 데이터베이스 경로에 있던 내용의 정적 스냅샷을 읽는다. 초기 데이터가 확인될 때 한 번 발생한 후 데이터가 변경될 때마다 발생한다. 하위 데이터를 포함하여 해당 위치의 모든 데이터를 포함하는 스냅샷이 이벤트 콜백에 전달된다. |
| child_added | 일반적으로 데이터베이스에서 항목 목록을 검색하는 데 사용한다. 위치의 전체 내용을 반환하는 `value`와 달리 `child_added`는 기존 하위 항목마다 한 번씩 발생한 후 지정된 경로에 하위 항목이 새로 추가될 때마다 다시 발생한다. 새 하위 항목의 데이터를 포함하는 스냅샷이 이벤트 콜백에 전달된다. |
| child_changed | 하위 노드가 수정될 때마다 발생한다. 여기에는 하위 노드의 하위에 대한 수정이 포함된다. 이 이벤트는 일반적으로 `child_added` 및 `child_removed`와 함께 항목 목록의 변경에 대응하는 데 사용된다. 이벤트 콜백에 전달되는 스냅샷에는 하위 항목의 업데이트된 데이터가 포함된다. |
| child_remove | 바로 아래 하위 항목이 삭제될 때 발생한다. 이 이벤트는 일반적으로 `child_added `및 `child_changed`와 함께 사용된다. 이벤트 콜백에 전달되는 스냅샷에는 삭제된 하위 항목의 데이터가 포함된다. |
| child_move | 정렬된 데이터를 다룰 때 사용한다. | 

### child_added

데이터베이스에 추가 항목이 생성될 때 마다 불러올 수 있도록 `child_added` 이벤트를 사용했다.

`bookshelfRef.on('child_added', on_child_added);`  

`child_added` 이벤트가 발생하면, `on_child_added`라는 함수를 콜백으로 넘긴다. 
`on_child_added` 는 데이터베이스의 항목 목록을 검색한 후, 해당 데이터를 어떻게 처리할 것인지에 대한 함수이다. 이 함수에 대한 내용은 다음번에 설명.

결과적으로 `loadBookList()` 함수는 다음과 같이 작성되었다. 

```javascript
// loadBookList.js

var isLoading = false;

$(window).scroll(function(){
	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
	if(isLoading == false) {
		loadBookList();
		}
	}
});


function loadBookList(){
	isLoading = true;
	var bookshelfRef = firebase.database().ref('bookshelf').orderByChild('createDate');

	if (lastCreateDate) {
		bookshelfRef = bookshelfRef.limitToFirst(21).startAt(lastCreateDate);
	} else {
		bookshelfRef = bookshelfRef.limitToFirst(20)
	}
	
	bookshelfRef.on('child_added', on_child_added);
}
```






