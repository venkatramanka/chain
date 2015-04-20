class HomeController < ApplicationController

  def start
    
  end

  def index
    @grid_size = params[:grid_size].to_i
    @num_players = params[:num_players].to_i
    if @grid_size.nil? || @grid_size < 5
      redirect_to :back, :flash => {:error => "Invalid Grid Size"}
    elsif @num_players.nil? || @num_players > 5 || @num_players <2
      redirect_to :back, :flash => {:error => "Invalid Players Selection"}
    end
  end
end
