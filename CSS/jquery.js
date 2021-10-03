$(document).ready(function(){
    $("button.btn-hide").click(function(){
        if($("p.intro").show()){
            $("p.intro").hide()
        }
        
    })
    $("button.btn-show").click(function(){
        if($("p.intro").hide()){
            $("p.intro").show()
        }
        
    })
})

$("p").click(function(){
    $(this).hide()
})

$("#p3").click(function(){
    alert("delete");
})


$(document).ready(function(){
    $("input").focus(function(){
        $(this).css("background-color", "blue")
    });
    $("input").blur(function(){
        $(this).css('background-color' , 'lightgray')
    })
})