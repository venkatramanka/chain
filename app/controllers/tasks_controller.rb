class TasksController < WebsocketRails::BaseController

  def player_connected
    remote_id = message[:remote_id]
    WebsocketRails[remote_id].trigger 'player_connected', remote_id
  end

  def player_move
    remote_id = message[:remote_id]
    msg_json={:row => message[:row], :col => message[:col], :player_num => message[:player_num]}.to_json
    WebsocketRails[remote_id].trigger 'player_move', msg_json
  end

end