class AddJoysToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :joys, :integer, :default => 0
  end
end
