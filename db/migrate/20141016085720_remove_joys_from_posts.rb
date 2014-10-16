class RemoveJoysFromPosts < ActiveRecord::Migration
  def change
    remove_column :posts, :joys, :integer
  end
end
