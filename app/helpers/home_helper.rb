module HomeHelper
  def determine_cell_type(grid_size, r, c, type=nil)
    if (r==0 && c==0) || (r==0 && c==grid_size) || (r==grid_size && c==0) || (r==grid_size && c==grid_size)
      type = "corner"
    elsif r==0 || r==grid_size || c==0 || c==grid_size
      type = "edge"
    else
      type = "normal"
    end
    type
  end
end
