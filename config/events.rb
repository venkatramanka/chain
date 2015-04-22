WebsocketRails::EventMap.describe do
  namespace :game do
    subscribe :connect, :to => TasksController, :with_method => :player_connected
    subscribe :move, :to => TasksController, :with_method => :player_move
  end
end
