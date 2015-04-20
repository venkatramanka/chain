function insertBall(el, r, c, type){
  curr_val = grid[r][c].get_val();
  player = grid[r][c].get_player();
  window.turn = (window.turn+1)%(window.num_players);
  if(player == -1){
    player = window.turn;
    grid[r][c].set_val(curr_val+1, player);
  }
  else if(player == window.turn){
    if(curr_val < limit[type])
      grid[r][c].set_val(curr_val+1, player);
    else{
      grid[r][c].set_val(0, player);
    }
  }
  else{
    window.turn = (window.turn-1)%(window.num_players);
    $(el).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
  }
}
function drawFirstCircle(el, type, pl){
  var player = parseInt(pl);
  if(type == "corner"){
    $(el).append($("<div class='circle spinning "+color[player]+"' value="+player+"></div>"));
  }
  else{
    $(el).append($("<div class='circle "+color[player]+"' value="+player+"></div>"));
  }
}
function getTwoCircles(player){
  return "<div class='double_circle' value="+player+"><div class='circle' style='position:absolute;left:-25%'></div><div class='circle' style='position:absolute;right:-25%'></div></div"
}
function getThreeCircles(player){
  return "<div class='triple_circle' value="+player+"><div class='circle' style='position:absolute;left:-25%'></div><div class='circle' style='position:absolute;right:-25%'></div><div class='circle' style='position:absolute;bottom:-25%'></div></div"
}
function drawSubsequentCircle(circles, el, spin, pl){
  var player = parseInt(pl);
  if(circles == 2)
    $element = $(getTwoCircles(player));
  else
    $element = $(getThreeCircles(player));
  $element.children().addClass(color[player]);
  if(spin)
    $element.children().addClass("spinning")
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
    burstCircles(r,c,pl);
    $el.children().first().remove();
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

