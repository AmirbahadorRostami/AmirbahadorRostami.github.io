
$(document).ready(function(){    
    

    $(".panel").hide();

    $(".nav-link").click(function(){
        
        $(".nav-link.active").removeClass("active");
        $(this).addClass("active");
        
        var panelToShow = $(this).attr("rel");
            
        $(".panel.active").slideUp("500", function(){
            $(this).removeClass("active");
                    
                    $('#'+panelToShow).slideDown("500",function(){
                            $(this).addClass("active");        
                    });
            });

    });
});



    
    







                  
                  
                  