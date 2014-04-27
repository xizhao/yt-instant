var videoId = 0;
var commentAPI;

function fillHTML(id, content, response){
	if(response.items){	//if title/video
		var frame="<iframe width='640' height='385' src='http://www.youtube.com/embed/"+id+"'frameborder='0' allowfullscreen type='text/html'></iframe>";
		$("#title").html(content);
		$("#video").html(frame);
	}
	else if (response.feed){	//if comments
		var i = 0;
		for(i = 0; i < content.length; i += 2){
			$("#video_info").append("<div id='comment_author'>"+response.feed[i]+"</div><div id='comment_content'>"+response.feed[i+1]+"</div>")
		}
	}
	else{
		$("#video").html("No Video");
	}
}   

var handleData = function(response) {
	var videoTitle = 0;
	if(response.items) {
		var videoIndex = 0;
		while(response.items[videoIndex].id.kind != "youtube#video"){
			videoIndex++;
		}
		var item = response.items[videoIndex];
		videoId = item.id.videoId;
		videoTitle=item.snippet.title;
		commentAPI = "http://gdata.youtube.com/feeds/api/videos/"+videoId+"/comments?v=2&alt=json&prettyprint=true";
		performAJAX(commentAPI, handleComments);
	}
	fillHTML(videoId, videoTitle, response);
}

var handleComments = function(response) {
	var displayedComments = [];
	var comments;
	var individualComment;
	var commentAuthor;
	var commentContent;
	var i = 0;
	if(response.feed){
		comments = response.feed.entry;
		while(i < 5){
			individualComment = comments[i];
			commentAuthor = individualComment.author[0].name.$t;
			commentContent = individualComment.content.$t;
			displayedComments.push(commentAuthor);
			displayedComments.push(commentContent);
			i++;
		}
	}
	fillHTML(videoId, displayedComments, response);
}

performAJAX = function(url, handleType){
	var xhr;
	if(xhr && xhr.readyState != 4){
        xhr.abort();
    }
	xhr = $.ajax
	({
		type: "GET",
		url: url,
		dataType:"jsonp",
		success: handleType
	});
}


var getData = function(){
	console.log("fetching data");
	var keyword = encodeURIComponent($(this).val());
	console.log(keyword);
	var gAPI='https://www.googleapis.com/youtube/v3/search?part=snippet&q='+keyword+'&key=AIzaSyCyl4ObA4rSynwHIWd3k1Gr5bDRXnkYe1U';
	// var gAPI='https://www.googleapis.com/youtube/v3/search?part=snippet&q='+keyword+'&key=AIzaSyCyGiCD-y9ym0Bw4S3a3dTOYzXxr-BPBjE';
	//Perform AJAX Call.
	performAJAX(gAPI, handleData);
	
}

$(document).ready(function() {
	console.log("ready");
	getData();
	$(".search_box").keyup(getData);
});