class AddColorColumnToPosts < ActiveRecord::Migration
  def change
  	add_column :posts, :color, :string, :default => "p_green"
  end
end
