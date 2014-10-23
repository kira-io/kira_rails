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
  $("#delete_user").click('submit', function(){
    var del_confirm = confirm("Are you sure you want to delete your account?");
    if(del_confirm){
      $(this).submit();
    }
    return false;
  });
});
