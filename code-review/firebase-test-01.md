## json 파일 데이터를 firebase 데이터베이스에 넣기

`bookshelf.json` 이라는 파일은 다음과 같은 데이터를 가지고 있다.

```
[
 {"title": "책 이름 1", "publisher": "출판사 1"},
 {"title": "책 이름 2", "publisher": "출판사 2"},
 ...
]
```
이 파일에 있는 데이터를 firebase 데이터베이스로 옮기는 코드를 작성했다.  
처음에는 `$.getJSON()`을 이용하여 단순히 push로 데이터를 넣었지만 
데이터의 정렬 기준을 데이터의 key에서 createDate로 변경하면서 문제가 생겼다.  
빠른 속도로 데이터가 입력되기 때문에, createDate의 꽤 작은 수까지 정확히 일치하는 데이터들이 생겼다.  
각 데이터들의 createDate 값에 강제적으로 격차를 주기 위해 `setTimeout` 메서드를 사용하였다.

```javascript
function jsonToDatabase() {
  $.getJSON("./bookshelf.json", function(data) {
	// pushToFirebase() 함수에 data, 0을 인자로 넘기고 1초 후 실행하도록 하였다.
    setTimeout(function() {
      pushToFirebase(data, 0)
    }, 1000)
  })
}

// pushToFirebase() 함수는 data, i를 인자로 받는다.
function pushToFirebase(data, i) {
	// 데이터의 길이와 i 가 같다면 종료한다.
	if(i == data.length) {
		return
	}
	// 'bookshelf'라는 firebase의 database에 .push로 데이터를 생성한다.
	firebase.database().ref('bookshelf/').push({
		title: data[i]['title'],
		publisher: data[i]['publisher'],
		createDate: Number.MAX_SAFE_INTEGER - new Date().getTime()
	});

	setTimeout(function() {
		// i에 1을 더한 값으로 data의 다음 값에 접근한다.
		pushToFirebase(data, i+1)
	}, 1000)
}

jsonToDatabase();
```

### $.getJSON()

`$.getJSON()` 은 다음과 같은 ajax 메서드의 단축형이다. 

```
$.ajax({
  dataType: "json",
  url: url,
  data: data,
  success: success
});
```

비동기식으로 서버에 접속하여 json 타입의 데이터를 불러온다.

`$getJSON()` 메서드를 사용하여 `bookshelf.json` 파일을 읽어 콜백함수로 전달한다. 

> 콜백함수?  
> 함수를 인자로 넘겨 사용하는 것.
> 
> ```
> $("#btn").click(function() {
>     alert("Btn Clicked");
>});
> ```
> click()함수의 인자로 함수를 전달하고 있다.
> click() 함수가 실행되면 인자로 전달된 함수가 실행된다.


### setTimeout()
`setTimeout()` 메서드는 지정된 밀리세컨드 후에 함수를 호출하거나, 표현식을 평가한다.

> ```
> # 3초 후 alert()을 실행한다.
> setTimeout(function(){ alert("Hello"); }, 3000);
> ```

### Number()
`Number()` 메서드는 변수를 숫자로 변환한다. 

### new Date()
`new Date()` 메서드로 Date 객체를 생성할 수 있다.  
[new Date()](https://www.w3schools.com/js/js_dates.asp)

### getTime()
`getTime()` 메서드는 1970년 1월 1일 부터의 시간을 밀리세컨드로 리턴한다.   
[getTime()](https://www.w3schools.com/jsref/jsref_gettime.asp)  


### createDate: Number.MAX\_SAFE\_INTEGER - new Date().getTime()

firebase에서는 데이터베이스에서 역순으로 데이터를 읽어오는 것을 지원하지 않는다.  
따라서 데이터를 최신순으로 정렬을 하기 위해 여러가지 방법을 시도했었는데 그 중 가장 간결한 방법은 createDate의 값을 조절하는 것이었다.   

`new Date().getTime()` 으로 생성된 시간을 숫자로 나타낼 수 있다.   
`createDate = new Date().getTime()` 로 설정하고, `createDate`를 기준으로 정렬하면  
맨 처음에 생성된 데이터의 createDate 값이 제일 작은 수 이기 때문에 최상위를 차지하게된다. 

화면에서는 최신 데이터를 최상위로 보여주고 싶었다. 따라서 `createDate`의 값을 역으로 바꿔주는 방법으로 `MAX_SAFE_INTEGER`를 사용하였다. 

> `MAX_SAFE_INTEGER`는 javascript의 최대 안전 정수를 나타낸다.   
> [MAX\_SAFE\_INTEGER](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)

createDate를 다음과 같이 설정하면, 최신 데이터의 createDate가 가장 작은 값을 갖게된다. 
`createDate: Number.MAX_SAFE_INTEGER - new Date().getTime()`

위와 같이 설정한 후, createDate를 기준으로 정렬하면 최신 데이터가 최상위에 위치하게 할 수 있다. 

