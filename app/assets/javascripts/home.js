var dispatcher = new WebSocketRails(window.location.host+'/websocket');
function insertBall(el, r, c, type){
  curr_val = grid[r][c].get_val();
  player = grid[r][c].get_player();
  window.turn = window.rem_players[(window.move_count)%(window.rem_players.length)];
  window.move_count++;
  if(player == -1 && window.self_id == (window.turn)){
    player = window.turn;
    grid[r][c].set_val(curr_val+1, player);
    dispatcher.trigger('game.move', {"row": r, "col": c, "remote_id": window.remote_id, "player_num": player});
    window.is_self = true;
    blockUIForSelf();
  }
  else if(player == window.self_id){
    if(curr_val < limit[type])
      grid[r][c].set_val(curr_val+1, player);
    else{
      $(el).children().remove();
      grid[r][c].set_val(0, player);
    }
    dispatcher.trigger('game.move', {"row": r, "col": c, "remote_id": window.remote_id, "player_num": player});
    window.is_self = true;
    blockUIForSelf();
    //determineIfPlayersOut();
  }
  else{
    window.move_count--;
    $(el).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  }
}
function drawFirstCircle(el, type, pl){
  var player = parseInt(pl);
  $(el).children('.circ').remove();
  if(type == "corner"){
    $(el).append($("<div class='circ circle spinning "+color[player]+"' style='position:absolute; left:25%;top:25%' value="+player+"></div>"));
  }
  else{
    $(el).append($("<div class='circ circle "+color[player]+"' style='position:absolute; left:25%;top:25%' value="+player+"></div>"));
  }
}
function getTwoCircles(player){
  return "<div class='circ double_circle' value="+player+"><div class='circle' style='position:absolute;left:15%;top:25%'></div><div class='circle' style='position:absolute;right:15%;top:25%'></div></div"
}
function getThreeCircles(player){
  return "<div class='circ triple_circle' value="+player+"><div class='circle' style='position:absolute;left:15%;top:20%'></div><div class='circle' style='position:absolute;right:15%;top:20%'></div><div class='circle' style='position:absolute;bottom:20%;right:25%'></div></div"
}
function drawSubsequentCircle(circles, el, spin, pl){
  var player = parseInt(pl);
  $(el).children('.circ').remove();
  if(circles == 2)
    $element = $(getTwoCircles(player));
  else
    $element = $(getThreeCircles(player));
  $element.children().addClass(color[player]);
  if(spin){
    $element.children().addClass("spinning");
    $(el).addClass("spinning");
  }
  $(el).html($element);
}
function burstCircles(r,c,pl){
  grid[r][c].set_val(0,pl);
}
function checkAndBurst(grid_size, r, c, pl){
  var type = determineCellType(grid_size-1,r,c);
  var curr_val = grid[r][c].get_val();
  var $el = $('#cell_'+r+'_'+c).children().first();
  if(curr_val > limit[type]){
    $el.children().first().remove();
    burstCircles(r,c,pl);
    return;
  }
  if(curr_val == 2){
    if(type == "edge")
      drawSubsequentCircle(2, $el, true, pl);
    else
      drawSubsequentCircle(2, $el, false, pl);
  }
  else if(curr_val == 3)
    drawSubsequentCircle(3, $el, true, pl);
  else
    drawFirstCircle($el, type, pl);
}

function determineCellType(grid_size, r, c){
  if ((r==0 && c==0) || (r==0 && c==grid_size) || (r==grid_size && c==0) || (r==grid_size && c==grid_size)){
    return "corner"
  }
  else if (r==0 || r==grid_size || c==0 || c==grid_size){
    return "edge"
  }
  else{
    return "normal"
  }
}

function determineIfPlayersOut(){
  if(window.move_count > window.num_players){
    var old_rem_players = window.rem_players;
    var curr_rem_players = [];
    for(var i=0; i<window.grid_size;i++){
      for(var j=0;j<window.grid_size;j++){
        curr_rem_players.push(grid[i][j].get_player());
      }
    }
    curr_rem_players = $.unique(curr_rem_players);
    var out_players = $(old_rem_players).not(curr_rem_players).get();
    if(out_players.length > 0){
      var msg = "Player(s) ";
      for(var i=0; i<out_players.length; i++ ){
        msg+=color[out_players[i]]+" ";
      }
      msg+="Out!";
      window.rem_players = $(window.rem_players).not(out_players).get();
      var next_player = window.rem_players[(window.move_count++)%(window.rem_players.length)];
      if(next_player == window.self_id){
        $.unblockUI();
      }
      if(window.rem_players.length == 1){
        alert("Player "+color[window.rem_players[0]]+" wins!");
        window.location = "/home/end?remote_id="+window.remote_id;
      }
      else{
        alert(msg);
      }
    }
  }
}

function insertRemoteBall(r,c, pl){
  window.move_count++;
  grid[r][c].set_val(grid[r][c].get_val()+1, pl);
  var next_player = window.rem_players[(window.move_count)%(window.rem_players.length)];
  if(next_player == window.self_id){
    $.unblockUI();
  }
  //determineIfPlayersOut();
}

function blockUIForSelf(){
  $.blockUI({ message: '<h5>Wait for your turn</h5>'});
}

