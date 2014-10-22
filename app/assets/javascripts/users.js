$(document).ready(function(){
  $("input[type=radio][name=kira_boolean]").change(function(){
    var update_url = $("#user_edit").attr("action");
    $.ajax({
      type: "PUT",
      url: update_url,
      data: {kira_boolean: $(this).val()},
      dataType: "json",
      success: function(data){
        window.location.reload(true);
      }
    });
  });
});
