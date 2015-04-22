require 'securerandom'
class HomeController < ApplicationController

  def start
    
  end

  def join
    @remote_id = params[:remote_id]
    @grid_size = $sessions[@remote_id][0]
    @num_players = $sessions[@remote_id][1]
    $sessions[@remote_id][2] += 1
    @player_cnt = $sessions[@remote_id][2]
    render :action => 'index'
  end

  def index
    @grid_size = params[:grid_size].to_i
    @num_players = params[:num_players].to_i
    @secure_random = SecureRandom.hex(4)
    $sessions[@secure_random] = [@grid_size, @num_players, 0]
    if @grid_size.nil? || @grid_size < 5
      redirect_to :back, :flash => {:error => "Invalid Grid Size"}
    elsif @num_players.nil? || @num_players > 5 || @num_players <2
      redirect_to :back, :flash => {:error => "Invalid Players Selection"}
    end
  end

  def end
    remote_id = params[:remote_id]
    $sessions.delete(remote_id)
    redirect_to :home_start
  end

end
