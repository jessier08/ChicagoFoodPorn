//// CHICAGO FOOD PORN ////

//// DRAWING MAP ////
var map = L.map('map');

    map.setView([41.898299, -87.656953], 12);

    L.tileLayer(
      'http://{s}.tribapps.com/chicago-print/{z}/{x}/{y}.png', {
        subdomains: ['maps1', 'maps2', 'maps3', 'maps4'],
        maxZoom: 13,
        minZoom: 8
    }).addTo(map);

// marker for hovered post
var newMarker,
    postMarker =  L.icon({
    iconUrl: 'circle.svg',

    iconSize:     [10, 10], 
    iconAnchor:   [5, 5]
});

//// PLOTTING GRID OF IMAGES//// 
//// (imgs is arbritary placeholder for data)
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

// set up map structure
//var placeName = d3.map();

//// LOAD DATA////
queue()
    .defer(d3.csv,'data/chicago_fp_cleaned.csv', parse)
//    .defer(d3.csv,'data/Food_Inspections.csv', parseFood)
    .await(dataLoaded)

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
   
    // scroll back to top of gallery when filter selected
    $('#all').click(function(){
        $('#gallery').scrollTop(0);
    });
    $('#foodgasm').click(function(){
        $('#gallery').scrollTop(0);
    });
    $('#delicious').click(function(){
        $('#gallery').scrollTop(0);
    });
    $('#yummy').click(function(){
        $('#gallery').scrollTop(0);
    });
    $('#goodeats').click(function(){
        $('#gallery').scrollTop(0);
    });
    $('#tasty').click(function(){
        $('#gallery').scrollTop(0);
    });
    
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

    
    
    

    _.each(posts, function(){
        var place = _.findWhere(restaurants, {"restlatLng": this.latlng, })
        
        _.extend(this, place);
    })
    
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
        url: d.imageURL
    }
}
//function parseFood(d){
//    placeName.set(d.restlatlng, d.name);
//    
//    return {
//        restlatlng: [+d.Latitude, +d.Longitude],
//        name: d.Name
//    }
//    
//}