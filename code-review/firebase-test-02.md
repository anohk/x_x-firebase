## html 기본구조 작성하기

### 1. firebase의 콘솔에서 만든 프로젝트의 스니펫을 복사하여 `<script></script>` 태그 내부에 추가한다.  
프로젝트의 firebse 데이터베이스를 초기화하여 설정하는 코드이다.

```html
<script>
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCLLRnW0V7z2x05_zzaQmh2Ez6xyeVtHkY",
  authDomain: "bookshelf-9b225.firebaseapp.com",
  databaseURL: "https://bookshelf-9b225.firebaseio.com",
  projectId: "bookshelf-9b225",
  storageBucket: "bookshelf-9b225.appspot.com",
  messagingSenderId: "510442681972"
};
firebase.initializeApp(config);
</script>
```

### 2. Google Icon Font를 사용하기 위해 `<head></head>` 태그 내부에 다음과 같은 코드를 추가한다.

```html
<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### 3. `<body></body>` 태그 내부에 기본 구조를 작성한다.


```html
<body>
	<div class="container">

		<div class="title">
			<h2>Bookshelf of anohk</h2>
		</div>

		<div class="bookshelf">
    
		<!--   1   -->
		<!--Start add new item -->
		<div id="inputForm">
			<div class="book-container">
			
				<!-- save, cancel btns -->
				<div class="btns">
					<div class="save-cancel">
						<div class="add-save">
							<button class="add-btn save" type="button" name="button">save</button>
						</div>
						<div class="add-cancel">
							<button class="add-btn cancel" type="button" name="button">cancel</button>
						</div>
					</div>
				</div>
          
				<!-- title, publisher input -->
				<ul class="book-list">
					<li class="book-title">
						<input type="text" name="title" id="input-title" placeholder="Title">
					</li>
					<li class="publisher">
						<input type="text" name="publisher" id="input-publisher" placeholder="Publisher">
					</li>
				</ul>
				
			</div>
		</div>
		<!--End add new item-->
      
      <!--   2   -->
      <!-- book list -->
      <div class="book-wrap"></div>

    </div>
	
	<!--   3   -->
	<!-- add floating button -->
	<div class="add-wrap">
		<a class="add-btn"><i class="material-icons">add_circle</i></a>
	</div>
    
  </div>
</body>
```

### 1. `<div id="inputForm">...</div>`는 두 가지 영역으로 이루어져있다.  
버튼 영역`<div class="btns"></div>`과 제목/출판사를 입력할 수 있는 영역`<ul class="book-list">...</ul>`으로 나뉜다.
### 2. `<div class="book-wrap"></div>`는 데이터베이스에 존재하는 데이터로 채워줄 공간이다.
### 3. 새로운 데이터를 입력할 수 있도록 추가 버튼을 floating button으로 만들기로했다.  
`<div class="bookshelf">...</div>` 의 내부가 아닌, 상위 영역인 `<div class="container">..</div>` 태그 내부에 입력한다.
