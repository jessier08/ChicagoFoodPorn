//// LOAD DATA////
queue()
    .defer(d3.csv,'data/chicago_fp_cleaned.csv', parse)
    .await(dataLoaded)

//// DRAWING MAP ////
var map = L.map('map');

    map.setView([41.898299, -87.656953], 12);

    L.tileLayer(
      'http://{s}.tribapps.com/chicago-print/{z}/{x}/{y}.png', {
        subdomains: ['maps1', 'maps2', 'maps3', 'maps4'],
        maxZoom: 13,
        minZoom: 8
    }).addTo(map);

var newMarker,
    postMarker =  L.icon({
    iconUrl: 'circle.svg',

    iconSize:     [10, 10], 
    iconAnchor:   [5, 5]
});
//// PLOTTING GRID OF IMAGES//// (imgs is arbritary placeholder for data)
function imgGallery(imgs){
    var image = d3.select('#gallery')
        .selectAll('.post')
        .data(imgs);
        
    image.exit().remove();
    
    image.enter()
        .append('img')
        .attr('class','post');
    
    image
        .attr('src', (function(d) {return d.url;}))
        .on('mouseover', function(d){
            newMarker = L.marker([d.latlng[0], d.latlng[1]], {icon: postMarker}).addTo(map);
        })
        .on('mouseout', function(){
            map.removeLayer(newMarker);

        })
}



//// WORK WITH DATA////
function dataLoaded(err,posts){ 

    console.log(posts);
    
    // load all posts with page
    document.onload = imgGallery(posts);
    
//// FILTERING FROM BUTTONS////        
    d3.selectAll('.tag').on('click', function(){
        var tag = d3.select(this).attr('id');

        if (tag == 'all'){
            imgGallery(posts);
        }
        if (tag == 'foodgasm'){
            filteredData = crossfilter(posts)
                .dimension(function(d){return d.userTags})
                .filterFunction(function(d){
                    if (d.indexOf('foodgasm') != -1) {
                        return true;
                    }
                    return false;
                })
                .top(Infinity);

            imgGallery(filteredData);
        } 
        if (tag == 'delicious'){
            filteredData = crossfilter(posts)
                .dimension(function(d){return d.userTags})
                .filterFunction(function(d){
                    if (d.indexOf('delicious') != -1) {
                        return true;
                    }
                    return false;
                })
                .top(Infinity);

            imgGallery(filteredData);
        }
        if (tag == 'yummy'){
            filteredData = crossfilter(posts)
                .dimension(function(d){return d.userTags})
                .filterFunction(function(d){
                    if (d.indexOf('yummy') != -1) {
                        return true;
                    }
                    return false;
                })
                .top(Infinity);

            imgGallery(filteredData);
        }
        if (tag == 'goodeats'){
            filteredData = crossfilter(posts)
                .dimension(function(d){return d.userTags})
                .filterFunction(function(d){
                    if (d.indexOf('goodeats') != -1) {
                        return true;
                    }
                    return false;
                })
                .top(Infinity);

            imgGallery(filteredData);
        }
        if (tag == 'tasty'){
            filteredData = crossfilter(posts)
                .dimension(function(d){return d.userTags})
                .filterFunction(function(d){
                    if (d.indexOf('tasty') != -1) {
                        return true;
                    }
                    return false;
                })
                .top(Infinity);

            imgGallery(filteredData);
        }
    })//end button functions
   
//// DRAWING CIRCLES ON MAP ////

    var circle = L.icon({
        iconUrl: 'circle40.svg',
        iconSize: [6, 6], //size of the icon in pixels
        iconAnchor: [3, 3], //point of the icon which will correspond to marker's location (the center)
        popupAnchor: [0, 0] //point from which the popup should open relative to the iconAnchor
    }); 

    omnivore.csv('data/chicago_fp_cleaned.csv')
        .on('ready', function(layer) {
            this.eachLayer(function(marker) {            
                marker.setIcon(circle);
            });
        })
        .addTo(map);    
    
    
////  creating array of all tags
    var totalArray = [];

    for (var i=0; i < posts.length; i++){
        var currentImgTags = posts[i].userTags;
        totalArray = totalArray.concat(currentImgTags);
    }
    
    var newTotalArray = totalArray;

//console.log(newTotalArray);
    
////  tag frequency counter
//    var words = (function(){
//
//        var tagCount = newTotalArray.length; // count w/ duplicates
//        
//        // array of words to ignore
//        var ignore = ['and','the','to','a','of','for','as','i','with','it','is','on','that','this','can','in','be','has','if'];
//        ignore = (function(){
//            var o = {}; // object prop checking > in array checking
//            var iCount = ignore.length;
//            for (var i=0;i<iCount;i++){
//                o[ignore[i]] = true;
//            }
//            return o;
//        }());
//
//        var counts = {}; // object for math
//        for (var i=0; i<tagCount; i++) {
//            var tag = newTotalArray[i];
//            if (!ignore[tag]) {
//                counts[tag] = counts[tag] || 0;
//                counts[tag]++;
//            }
//        }
//
//        var arr = []; // an array of objects to return
//        for (tag in counts) {
//            arr.push({
//                text: tag,
//                frequency: counts[tag]
//            });
//        }
//
//        // sort array by descending frequency | http://stackoverflow.com/a/8837505
//        var tagCountTotal = arr.sort(function(a,b){
//            return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
//        });
//        
//        console.log(tagC)
//    }());

};
//end dataLoaded


//// PARSING 
function parse(d){
    
    var imgtagArray = (d.food_ltl_1).replace(/"/g,'').split(", "),
        usertagArray = (d.tags_str).replace(/"/g,'').split(", ");

    ///////////////////////////////////
    
    return {
        latlng: [+d.lat, +d.lng],
        imgTags: imgtagArray,
        userTags: usertagArray,
        likes: +d.likes_coun,
        url: d.imageURL,
    }
}